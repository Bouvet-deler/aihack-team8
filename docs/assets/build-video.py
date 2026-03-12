"""
Build narrated presentation video from Slidev slides.
Uses edge-tts for Norwegian TTS and Playwright for screenshots.
"""

import asyncio
import json
import subprocess
import os
import sys

SLIDES_URL = "http://localhost:8081"
BUILD_DIR = os.path.join(os.path.dirname(__file__), "video-build")
OUTPUT = os.path.join(os.path.dirname(__file__), "presentation-video.mp4")
VOICE = "nb-NO-FinnNeural"
RATE = "+30%"  # 1.3x speed
RESOLUTION = (1920, 1080)

# Narration script — natural Norwegian for each slide
NARRATIONS = [
    # Slide 1: Cover
    (
        "Hvor mange apper trenger du for å finne parkering, bysykler og buss i Stavanger? "
        "Svaret burde være én. "
        "Vi er Team 8 fra Bouvet AI Hack, og vi har bygget Stavanger Mobilitet — "
        "en app som samler alt på ett kart. "
        "Fire byer, tre språk, og hundre prosent AI-drevet."
    ),
    # Slide 2: Problemet
    (
        "La oss starte med problemet. "
        "Stavanger mangler én felles løsning for mobilitetsinformasjon. "
        "Du trenger ledig parkering. Bysykler. Bussavganger. Og hva som er nærmest deg. "
        "Ingen eksisterende løsning dekker alt dette for Stavanger."
    ),
    # Slide 3: Features
    (
        "Hva har vi bygget? "
        "Et interaktivt kart med parkering, sykkel, sparkesykler, lading og buss. "
        "Fargekodede markører fra grønn til rød. "
        "Søk, filtrering, PWA på mobil, tre språk, og automatisk oppdatering. "
        "Pluss mørk modus, favoritter, gangavstand, prediksjon, og fire byer."
    ),
    # Slide 4: Demo
    (
        "Nå er det tid for demo! "
        "Vi bytter over til nettleseren og viser appen i aksjon."
    ),
    # Slide 5: Tech Stack
    (
        "Tech-stacken er moderne og rask. "
        "React 19 med Vite 6 for lynrask utvikling. "
        "Leaflet for kart, Equinor Design System for design. "
        "PWA med Workbox, i18next for språk, "
        "Open Data fra opencom og Entur, alt i TypeScript strict mode."
    ),
    # Slide 6: AI
    (
        "AI har vært sentralt i hele prosessen. "
        "Copilot CLI var med i alt — kode, analyse, planlegging, CI/CD og dokumentasjon. "
        "Vi har fem dype research-analyser: "
        "konkurranseanalyse, utviklingskostnader, presentasjonsteknikk, "
        "Markdown i Slidev, og moderne CSS. "
        "Over åtti tusen ord. Copilot er en utviklingspartner, ikke bare en kodegenerator."
    ),
    # Slide 7: QA
    (
        "Kvalitetssikring er innebygd. "
        "Automatiserte UAT-tester, Lefthook pre-commit hooks som kjører parallelt, "
        "Super-linter på GitHub Actions. "
        "Alt er docs-as-code — README, CONTRIBUTING, slides og tester er versjonskontrollert."
    ),
    # Slide 8: Cost
    (
        "Hva koster dette? I en hack jobber vi gratis. "
        "AI-kostnadene er lave: 43 dollar for Claude API, "
        "Copilot Business-abonnement, og 37 cent for GitHub Actions. "
        "Over 80 prosent av commits er AI co-authored. Omtrent 3000 kodelinjer totalt."
    ),
    # Slide 9: GitHub Status
    (
        "På GitHub har vi 26 issues. "
        "Knut Erik har bygget alle features: sykler, sparkesykler, lading, "
        "prediksjon, multi-by og Entur. "
        "Einar har håndtert AI-prosjektledelse, analyse, CI/CD og dokumentasjon."
    ),
    # Slide 10: Roadmap
    (
        "Veikartet har fire faser. "
        "Vi har levert funksjonalitet fra alle fire — "
        "fra geolokasjon og mørk modus i Phase 1, "
        "til Entur i Phase 2, prediksjon i Phase 3, "
        "og multi-by i Phase 4."
    ),
    # Slide 11: Next Steps
    (
        "Neste steg er å gjøre appen til den mobilitetsappen for Stavanger. "
        "Kolumbus sanntid, sparkesykler, ruteplanlegger, elbil-lading, og WCAG tilgjengelighet."
    ),
    # Slide 12: Takk
    (
        "Takk for oppmerksomheten! "
        "Stavanger Mobilitet — alt på ett kart. "
        "Fire byer, tre språk, hundre prosent AI-drevet. "
        "Sjekk GitHub-repoet for detaljer!"
    ),
    # Slide 13: Team
    (
        "Til slutt, en liten observasjon fra AI-assistenten som har vært med hele veien. "
        "Einar er AI-flustreren og estetikeren — han gjør utviklingsprosessen til kunst. "
        "58 commits, alle med Copilot som makker. Glassmorfisme, OKLCH-farger, og 12-timers sesjoner. "
        "Knut er feature-maskinen og systematikeren — han bygger ting som virker. "
        "55 commits med sykler, lading, prediksjon, og multi-by. Feature branches og PRs på alt. "
        "Sammen utfyller de hverandre perfekt: én som selger drømmen, og én som bygger den."
    ),
]

# v-click counts per slide (press right-arrow this many times for final state)
VCLICK_COUNTS = [
    0,   # Slide 1: Cover
    2,   # Slide 2: Problemet (divider + punchline)
    0,   # Slide 3: Features
    0,   # Slide 4: Demo
    0,   # Slide 5: Tech Stack
    2,   # Slide 6: AI (research cards + takeaway)
    0,   # Slide 7: QA
    0,   # Slide 8: Cost
    0,   # Slide 9: GitHub Status
    0,   # Slide 10: Roadmap
    2,   # Slide 11: Next Steps (last 2 items)
    0,   # Slide 12: Takk
    2,   # Slide 13: Team (2 dev plan boxes)
]


async def generate_audio():
    """Generate TTS audio for each slide."""
    import edge_tts

    os.makedirs(BUILD_DIR, exist_ok=True)
    tasks = []
    for i, text in enumerate(NARRATIONS):
        outfile = os.path.join(BUILD_DIR, f"slide-{i+1:02d}.mp3")
        if os.path.exists(outfile):
            print(f"  ⏭️  slide-{i+1:02d}.mp3 (exists)")
            continue
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        tasks.append((i, outfile, communicate))

    for i, outfile, communicate in tasks:
        print(f"  🔊 Generating slide-{i+1:02d}.mp3 ...")
        await communicate.save(outfile)
        print(f"  ✅ slide-{i+1:02d}.mp3")


def find_slide_screenshots():
    """Find the last v-click frame for each slide from Slidev export.

    Slidev exports files like 001-01.png, 002-01.png, 002-02.png, etc.
    We want the last file per slide number (final v-click state).
    """
    export_dir = os.path.join(BUILD_DIR, "slides")
    if not os.path.isdir(export_dir):
        raise FileNotFoundError(
            f"No exported slides in {export_dir}. "
            "Run: npx slidev export docs/slides.md --format png "
            "--output docs/assets/video-build/slides --dark --with-clicks"
        )

    # Group files by slide number, pick last v-click frame
    from collections import defaultdict
    slides = defaultdict(list)
    for fname in sorted(os.listdir(export_dir)):
        if fname.endswith(".png"):
            slide_num = int(fname.split("-")[0])
            slides[slide_num].append(fname)

    result = []
    for slide_num in sorted(slides.keys()):
        last_frame = slides[slide_num][-1]  # last v-click state
        src = os.path.join(export_dir, last_frame)
        dst = os.path.join(BUILD_DIR, f"slide-{slide_num:02d}.png")
        # Copy to standard name
        import shutil
        shutil.copy2(src, dst)
        result.append(dst)
        print(f"  📸 slide-{slide_num:02d}.png ← {last_frame}")

    return result


def get_audio_duration(filepath):
    """Get duration of audio file in seconds using ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "json", filepath],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def build_segments():
    """Create video segment per slide: still image + audio."""
    concat_list = []

    for i in range(len(NARRATIONS)):
        slide_num = i + 1
        img = os.path.join(BUILD_DIR, f"slide-{slide_num:02d}.png")
        audio = os.path.join(BUILD_DIR, f"slide-{slide_num:02d}.mp3")
        segment = os.path.join(BUILD_DIR, f"segment-{slide_num:02d}.mp4")

        duration = get_audio_duration(audio)
        # Add 1.5s padding (0.5s before, 1s after) for breathing room
        total_duration = duration + 1.5

        print(f"  🎬 segment-{slide_num:02d}.mp4 ({duration:.1f}s audio, {total_duration:.1f}s total)")

        subprocess.run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", img,
            "-i", audio,
            "-filter_complex",
            f"[1:a]adelay=500|500,apad=whole_dur={total_duration}[a]",
            "-map", "0:v", "-map", "[a]",
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(total_duration),
            "-shortest",
            segment
        ], capture_output=True, text=True, check=True)

        concat_list.append(f"file '{segment}'")

    # Write concat list
    concat_file = os.path.join(BUILD_DIR, "concat.txt")
    with open(concat_file, "w") as f:
        f.write("\n".join(concat_list))

    return concat_file


def concatenate_video(concat_file):
    """Merge all segments into final video."""
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_file,
        "-c", "copy",
        OUTPUT
    ], capture_output=True, text=True, check=True)


async def main():
    print("=" * 60)
    print("  Stavanger Mobilitet — Presentation Video Builder")
    print("=" * 60)

    print("\n📝 Step 1/5: Narration script ready (12 slides)")
    print(f"   Voice: {VOICE}")
    for i, text in enumerate(NARRATIONS):
        words = len(text.split())
        print(f"   Slide {i+1:2d}: {words} words")

    print("\n🔊 Step 2/5: Generating TTS audio...")
    await generate_audio()

    print("\n📸 Step 3/5: Using Slidev-exported screenshots...")
    find_slide_screenshots()

    print("\n🎬 Step 4/5: Building video segments...")
    concat_file = build_segments()

    print("\n🎞️  Step 5/5: Concatenating final video...")
    concatenate_video(concat_file)

    # Get final duration
    duration = get_audio_duration(OUTPUT)
    size_mb = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f"\n{'=' * 60}")
    print(f"  ✅ Done! Output: {OUTPUT}")
    print(f"  ⏱️  Duration: {int(duration // 60)}:{int(duration % 60):02d}")
    print(f"  📦 Size: {size_mb:.1f} MB")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    asyncio.run(main())
