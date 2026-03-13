"""
Record a live demo of the Stavanger Mobilitet app using Playwright.
Outputs a video segment that replaces the static Demo slide in the presentation.
"""

import asyncio
from playwright.async_api import async_playwright

APP_URL = "http://localhost:8080"
OUTPUT_DIR = "docs/assets/video-build"
RESOLUTION = (1920, 1080)


async def record_demo():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": RESOLUTION[0], "height": RESOLUTION[1]},
            record_video_dir=OUTPUT_DIR,
            record_video_size={"width": RESOLUTION[0], "height": RESOLUTION[1]},
        )
        page = await context.new_page()

        print("  🌐 Loading app...")
        await page.goto(APP_URL, wait_until="networkidle")
        await asyncio.sleep(4)

        # 1. Show the map (initial parking view)
        print("  🗺️  Showing map with parking data...")
        await asyncio.sleep(4)

        # 2. Click on a marker area
        print("  🅿️  Clicking on map area...")
        await page.mouse.click(960, 540)
        await asyncio.sleep(3)

        # 3. Search for Valberget
        print("  🔍 Searching for Valberget...")
        search = await page.query_selector('input[type="search"], .search-input')
        if search:
            await search.click()
            await asyncio.sleep(0.5)
            await search.type("Valberget", delay=100)
            await asyncio.sleep(3)
            await page.keyboard.press("Control+a")
            await page.keyboard.press("Backspace")
            await asyncio.sleep(1)
        else:
            print("    (no search input found)")

        # 4. Switch tabs: parking → bikes → charging → transit (SKIP scooters index 2)
        print("  🚲 Switching tabs (skipping scooters)...")
        tabs = await page.query_selector_all(".tab")
        # Tab order: 0=parking, 1=bikes, 2=scooters, 3=charging, 4=transit
        for i in [1, 3, 4]:
            if i < len(tabs):
                try:
                    await tabs[i].click(timeout=3000)
                    await asyncio.sleep(3.5)
                except Exception:
                    pass

        # 5. Toggle dark mode
        print("  🌙 Toggling dark mode...")
        dark_toggle = await page.query_selector(".theme-toggle")
        if dark_toggle:
            try:
                await dark_toggle.click(timeout=3000)
                await asyncio.sleep(3)
            except Exception:
                pass

        # 6. Switch city (Bergen and back)
        print("  🏙️  Switching city...")
        city_select = await page.query_selector("select.city-select, .city-select")
        if city_select:
            try:
                await city_select.select_option(index=1)
                await asyncio.sleep(3)
                await city_select.select_option(index=0)
                await asyncio.sleep(2)
            except Exception:
                pass

        # 7. Toggle back to light mode
        print("  ☀️  Back to light mode...")
        if dark_toggle:
            try:
                await dark_toggle.click(timeout=3000)
                await asyncio.sleep(2)
            except Exception:
                pass

        # 8. Back to parking tab, final view
        print("  🗺️  Final map view...")
        if tabs:
            try:
                await tabs[0].click(timeout=3000)
            except Exception:
                pass
        await asyncio.sleep(3)

        print("  ✅ Demo recording complete")

        video_path = await page.video.path()
        await context.close()
        await browser.close()

        return video_path


async def main():
    print("🎬 Recording live demo of Stavanger Mobilitet...")
    video_path = await record_demo()
    print(f"  📹 Raw recording: {video_path}")

    import shutil
    import os
    dest = os.path.join(OUTPUT_DIR, "demo-recording.webm")
    shutil.move(video_path, dest)
    print(f"  ✅ Saved to: {dest}")


if __name__ == "__main__":
    asyncio.run(main())
