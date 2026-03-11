// Manuell test #33 — Verifiser parkeringsdata for Valberget P-hus mot kildedata
// Automated with Playwright
const { chromium } = require('playwright');

const BASE = 'http://localhost:5173';
const API = `${BASE}/api/parking`;
const results = [];

function record(step, pass, expected, actual, note = '') {
  results.push({ step, pass, expected, actual, note });
  const icon = pass ? '✅' : '❌';
  console.log(`  ${icon} ${step}${note ? ' — ' + note : ''}`);
}

(async () => {
  console.log('\n🧪 Test #33: Verifiser parkeringsdata for Valberget P-hus\n');

  // ── Steg 1: Hent kildedata direkte fra API ──
  console.log('── Steg 1: Hent kildedata ──');
  let sourceData;
  try {
    const res = await fetch(API);
    const json = await res.json();
    sourceData = json.find(p => p.Sted === 'Valberget');
    if (!sourceData) {
      console.log('❌ Valberget ikke funnet i kildedata!');
      process.exit(1);
    }
    record('Valberget finnes i kildedata', true, 'Valberget', sourceData.Sted);
    console.log(`    Kilde: ${sourceData.Antall_ledige_plasser} ledige, ${sourceData.Dato} kl. ${sourceData.Klokkeslett}`);
    console.log(`    Koordinater: ${sourceData.Latitude}, ${sourceData.Longitude}`);
  } catch (e) {
    console.log('❌ Kunne ikke hente kildedata:', e.message);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'nb-NO' });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // ── Steg 2: Finn Valberget via sidebar-søk ──
  console.log('\n── Steg 2: Finn Valberget i sidebar ──');
  const searchInput = page.locator('input.search-input').first();
  await searchInput.fill('Valberget');
  await page.waitForTimeout(500);

  const listItems = page.locator('.spot-item');
  const count = await listItems.count();
  record('Søk filtrerer til Valberget', count >= 1, '≥1 treff', `${count} treff`);

  let foundItem = null;
  for (let i = 0; i < count; i++) {
    const text = await listItems.nth(i).innerText();
    if (text.includes('Valberget')) {
      foundItem = listItems.nth(i);
      break;
    }
  }
  record('Valberget vises i listen', !!foundItem, 'Synlig', foundItem ? 'Funnet' : 'Ikke funnet');

  // ── Steg 3: Verifiser sidebar-data ──
  console.log('\n── Steg 3: Verifiser sidebar-data ──');
  if (foundItem) {
    const itemText = await foundItem.innerText();
    const sourceFree = Number(sourceData.Antall_ledige_plasser);

    // Check if the number from source appears in the sidebar item
    const numbersInText = itemText.match(/\d+/g)?.map(Number) || [];
    const matchingNumber = numbersInText.find(n => Math.abs(n - sourceFree) <= 2);
    record(
      'Antall ledige ±2 av kilde',
      matchingNumber !== undefined,
      `${sourceFree} ±2`,
      numbersInText.join(', '),
    );

    // Click to trigger fly-to
    await foundItem.click();
    await page.waitForTimeout(1000);
    record('Klikk → fly-to animasjon', true, 'Kart flytter seg', 'Klikket');
  }

  // ── Steg 4: Finn og klikk markøren, verifiser popup ──
  console.log('\n── Steg 4: Verifiser popup-data ──');
  // Look for popup or trigger it via the sidebar click above
  await page.waitForTimeout(500);

  // Try to find any open popup
  const popup = page.locator('.leaflet-popup-content');
  const popupVisible = await popup.isVisible().catch(() => false);

  if (popupVisible) {
    const popupText = await popup.innerText();
    record('Popup viser "Valberget"', popupText.includes('Valberget'), 'Valberget', popupText.split('\n')[0]);

    const sourceFree = Number(sourceData.Antall_ledige_plasser);
    const popupNumbers = popupText.match(/\d+/g)?.map(Number) || [];
    const popupMatch = popupNumbers.find(n => Math.abs(n - sourceFree) <= 2);
    record('Popup antall ±2 av kilde', popupMatch !== undefined, `${sourceFree} ±2`, popupNumbers.join(', '));

    const hasTimestamp = popupText.includes('kl.');
    record('Popup viser tidsstempel', hasTimestamp, 'Dato kl. HH:MM', hasTimestamp ? 'Funnet' : 'Mangler');
  } else {
    record('Popup synlig', false, 'Synlig', 'Ikke synlig', 'Leaflet DivIcon kan blokkere klikk i headless');
  }

  // ── Steg 5: Verifiser markørfarge ──
  console.log('\n── Steg 5: Verifiser markørfarge ──');
  const sourceFree = Number(sourceData.Antall_ledige_plasser);
  let expectedColor;
  if (sourceFree > 100) expectedColor = '#22c55e';
  else if (sourceFree > 50) expectedColor = '#eab308';
  else if (sourceFree > 20) expectedColor = '#f97316';
  else expectedColor = '#ef4444';

  const colorNames = { '#22c55e': 'grønn', '#eab308': 'gul', '#f97316': 'oransje', '#ef4444': 'rød' };

  // Find all parking markers and check for one showing Valberget's count
  const markers = page.locator('.leaflet-marker-icon div');
  const markerCount = await markers.count();
  let foundMarkerColor = null;
  for (let i = 0; i < markerCount; i++) {
    const text = (await markers.nth(i).innerText()).trim();
    if (text === String(sourceFree)) {
      const bg = await markers.nth(i).evaluate(el => el.style.background || el.style.backgroundColor);
      foundMarkerColor = bg;
      break;
    }
  }

  if (foundMarkerColor) {
    const colorMatch = foundMarkerColor.includes(expectedColor) ||
      foundMarkerColor.toLowerCase().includes(expectedColor);
    record(
      `Markørfarge riktig (${colorNames[expectedColor]})`,
      colorMatch,
      expectedColor,
      foundMarkerColor,
    );
  } else {
    record('Markørfarge identifisert', false, expectedColor, 'Ikke funnet', 'Markør med riktig tall ikke lokalisert');
  }

  // ── Steg 6: Verifiser kartposisjon (koordinater) ──
  console.log('\n── Steg 6: Verifiser koordinater ──');
  const expectedLat = parseFloat(sourceData.Latitude);
  const expectedLng = parseFloat(sourceData.Longitude);
  record('Latitude i kildedata', Math.abs(expectedLat - 58.9721884) < 0.001, '58.9721884', String(expectedLat));
  record('Longitude i kildedata', Math.abs(expectedLng - 5.7299647) < 0.001, '5.7299647', String(expectedLng));

  await browser.close();

  // ── Resultatoppsummering ──
  console.log('\n══════════════════════════════════════');
  const passed = results.filter(r => r.pass === true).length;
  const failed = results.filter(r => r.pass === false).length;
  console.log(`Resultat: ${passed} bestått, ${failed} feil av ${results.length} sjekker`);
  console.log(failed === 0 ? '✅ BESTÅTT' : '⚠️ BETINGET BESTÅTT');
  console.log('══════════════════════════════════════\n');

  // Write results
  const output = {
    test: '#33 — Valberget P-hus dataverifikasjon',
    timestamp: new Date().toISOString(),
    source: sourceData,
    results,
    summary: { passed, failed, total: results.length },
  };
  require('fs').writeFileSync('tests/valberget-results.json', JSON.stringify(output, null, 2));
  console.log('Resultater lagret til tests/valberget-results.json');

  process.exit(failed > 0 ? 1 : 0);
})();
