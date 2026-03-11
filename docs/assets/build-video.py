"""
Build narrated presentation video from Slidev slides.
Uses edge-tts for Norwegian TTS and Playwright for screenshots.
"""

import asyncio
import json
import subprocess
import os
import sys

SLIDES_URL = "http://localhost:3031"
BUILD_DIR = os.path.join(os.path.dirname(__file__), "video-build")
OUTPUT = os.path.join(os.path.dirname(__file__), "presentation-video.mp4")
VOICE = "nb-NO-FinnNeural"
RESOLUTION = (1920, 1080)

# Narration script — natural Norwegian for each slide
NARRATIONS = [
    # Slide 1: Cover
    (
        "Hvor mange apper trenger du egentlig for å finne parkering, bysykler og buss i Stavanger? "
        "Svaret burde være én. "
        "Vi er Team 8 fra Bouvet AI Hack, og vi har bygget Stavanger Mobilitet — "
        "en app som samler sanntids parkering, bysykler og kollektivtransport på ett kart. "
        "Fire byer, over ti funksjoner, og hundre prosent AI-drevet utvikling."
    ),
    # Slide 2: Problemet
    (
        "La oss starte med problemet. "
        "Stavanger mangler én felles løsning for mobilitetsinformasjon. "
        "Du trenger ledig parkering i sanntid. Du vil vite hvor bysyklene er. "
        "Du vil se bussavganger. Og du vil vite hva som er nærmest deg. "
        "Tabellen til høyre viser at ingen eksisterende løsning dekker alt dette for Stavanger. "
        "Citymapper har ikke parkering. SpotHero mangler sykkel og buss. "
        "Vår app er den eneste som dekker alle tre — i Stavanger."
    ),
    # Slide 3: Features
    (
        "Hva har vi bygget? "
        "Et interaktivt kart med parkering, sykkel og buss. "
        "Fargekodede markører som viser tilgjengelighet fra grønn til rød. "
        "Søk og filtrering. Appen er en PWA som kan installeres på mobilen. "
        "Den støtter tre språk: norsk, engelsk og spansk. Og dataene oppdateres automatisk. "
        "I denne hacken har vi lagt til mørk modus, favoritter, gangavstand, "
        "geolokasjon, prediksjon av ledige plasser, og støtte for fire byer."
    ),
    # Slide 4: Demo
    (
        "Nå er det tid for demo! "
        "Her bytter vi over til nettleseren og viser appen i aksjon. "
        "Vi ser på kartet med alle lagene, søker og filtrerer, "
        "bytter by, slår på mørk modus, og viser hvordan appen installeres som PWA."
    ),
    # Slide 5: Tech Stack
    (
        "Tech-stacken vår er moderne og rask. "
        "React 19 med Vite 6 gir lynrask utvikling og bygging. "
        "Leaflet brukes for kartvisningen, og Equinor Design System gir konsistent design. "
        "Appen er en PWA med Workbox for offline-støtte. "
        "Vi har i18next for flerspråklighet, Open Data fra opencom.no og Entur, "
        "og alt er skrevet i TypeScript med strict mode."
    ),
    # Slide 6: AI
    (
        "AI har vært sentralt i hele utviklingsprosessen. "
        "Copilot CLI var med i alt — fra kodeanalyse og konkurrentanalyse "
        "til prosjektplanlegging med 26 issues, CI/CD-oppsett, og dokumentasjon. "
        "Vi har gjennomført fem dype research-analyser: "
        "konkurranseanalyse av syv plattformer, utviklingskostnader, "
        "presentasjonsteknikk, ren Markdown i Slidev, og moderne CSS. "
        "Til sammen over åtti tusen ord generert av AI. "
        "Copilot CLI er en utviklingspartner, ikke bare en kodegenerator."
    ),
    # Slide 7: QA
    (
        "Kvalitetssikring er bygget inn i arbeidsflyten. "
        "Vi har 57 av 72 automatiserte UAT-tester som består. "
        "De tolv feilene skyldes CSP-headere og Leaflet DivIcon i headless-modus — "
        "alt fungerer i ekte nettleser. "
        "CI/CD-pipelinen bruker Lefthook for pre-commit hooks som kjører parallelt, "
        "Super-linter på GitHub Actions, og alt er docs-as-code — "
        "README, CONTRIBUTING, Slidev-presentasjonen og UAT er versjonskontrollert."
    ),
    # Slide 8: Cost
    (
        "Hva koster det å bygge dette? Mennesker jobber gratis i en hack. "
        "Knut brukte Claude API for 43 dollar. "
        "Einar brukte Copilot CLI som er inkludert i Copilot Business-abonnementet. "
        "GitHub Actions har kostet 37 cent for 46 minutter. "
        "Totalt: omtrent 81 dollar pluss 38 dollar i måneden for Copilot. "
        "77 prosent av alle commits er AI co-authored. "
        "39 fra Copilot og 18 fra Claude. 3500 kodelinjer totalt."
    ),
    # Slide 9: GitHub Status
    (
        "På GitHub har vi 26 issues pluss 2 test-issues. "
        "Seks er lukket, 17 er åpne med prioritet fra P1 til P4. "
        "Knut Erik har stått for alle funksjonene: "
        "i18n, dark mode, favoritter, gangavstand, geolokasjon, prediksjon, multi-city og Entur. "
        "Einar har håndtert prosjektledelse via AI, konkurranseanalyse, "
        "CI/CD, dokumentasjon og kvalitetssikring."
    ),
    # Slide 10: Roadmap
    (
        "Veikartet har fire faser. "
        "Phase 1 UX er ferdig med geolokasjon, mørk modus, favoritter og gangavstand. "
        "Phase 2 Multi-modal er i gang med Entur buss og ferge allerede levert. "
        "Phase 3 Smart har prediksjon ferdig. "
        "Og Phase 4 Plattform har multi-by ferdig med Bergen, Trondheim og Oslo. "
        "Vi har altså levert funksjonalitet fra alle fire faser."
    ),
    # Slide 11: Next Steps
    (
        "Neste steg er Phase 2 — å gjøre appen til den mobilitetsappen for Stavanger. "
        "Kolumbus sanntid, el-sparkesykler, ruteplanlegger, elbil-lading, og WCAG tilgjengelighet. "
        "Men vi har allerede levert utover Phase 1: "
        "Multi-city fra Phase 4, prediksjon fra Phase 3, "
        "Entur API fra Phase 2, og CI/CD-infrastruktur."
    ),
    # Slide 12: Takk
    (
        "Takk for oppmerksomheten! "
        "Stavanger Mobilitet — parkering, bysykler og kollektiv på ett kart. "
        "Fire byer, tre språk, 26 issues, og hundre prosent AI-drevet. "
        "Vi er Team 8: Einar Fredriksen og Knut Erik Hollund. "
        "Sjekk ut GitHub-repoet for mer detaljer. "
        "Vi tar gjerne imot spørsmål!"
    ),
]

# How many times to press right-arrow to get to final v-click state per slide
# (0 = no v-clicks, just screenshot immediately)
VCLICK_COUNTS = [
    0,   # Slide 1: Cover (no v-click)
    4,   # Slide 2: Problemet (4 v-click items)
    6,   # Slide 3: Features (6 v-click items)
    0,   # Slide 4: Demo (no v-click)
    2,   # Slide 5: Tech Stack (2 v-click groups)
    5,   # Slide 6: AI (5 research cards)
    0,   # Slide 7: QA (no v-click)
    0,   # Slide 8: Cost (no v-click)
    0,   # Slide 9: GitHub Status (no v-click)
    0,   # Slide 10: Roadmap (no v-click)
    5,   # Slide 11: Next Steps (5 v-click items)
    0,   # Slide 12: Takk (no v-click)
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
        communicate = edge_tts.Communicate(text, VOICE)
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
