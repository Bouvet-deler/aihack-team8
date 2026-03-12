---
theme: default
title: Stavanger Mobilitet
info: |
  Status Report — Bouvet AI Hack, Team 8
  Real-time parking & bike availability for Stavanger
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

<!-- markdownlint-disable MD003 MD013 MD022 MD024 MD025 MD033 -->
<!-- MD025: Slidev uses # per slide (multiple h1 by design) -->
<!-- MD003: Slidev --- separators are misread as setext headings -->

<div class="flex flex-col items-center justify-center h-full">
  <div class="text-lg opacity-50 mb-6">Hvor mange apper trenger du for parkering, bysykler og buss i Stavanger?</div>
  <div class="cover-title mb-4">Stavanger Mobilitet</div>
  <div class="cover-subtitle mb-8">Sanntids parkering, bysykler og kollektivtransport — på ett kart</div>

  <div class="flex gap-3 mb-8">
    <span class="feature-pill">🏙️ 4 byer</span>
    <span class="feature-pill">✨ 10+ funksjoner</span>
    <span class="feature-pill">🤖 100% AI-drevet</span>
  </div>

  <div class="text-sm opacity-40">
    Bouvet AI Hack · Team 8 · 11. mars 2026
  </div>
</div>

<div class="abs-br m-6">
  <a href="https://github.com/Bouvet-deler/aihack-team8" target="_blank" class="text-xl slidev-icon-btn opacity-40 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
Presenter notes:
Åpne med hook-spørsmålet: "Hvor mange apper trenger du...?"
La det synke inn et øyeblikk, deretter presenter løsningen.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Problemet 🎯

<div class="mt-2">

Stavangers innbyggere trenger **én plass** for å finne:

<div class="mt-4 space-y-2">
  <div class="glass-sm flex items-center gap-3">🅿️ <span>Ledig parkering i sanntid</span></div>
  <div class="glass-sm flex items-center gap-3">🚲 <span>Tilgjengelige bysykler</span></div>
  <div class="glass-sm flex items-center gap-3">🚌 <span>Buss- og fergeavganger</span></div>
  <div class="glass-sm flex items-center gap-3">📍 <span>Hva som er <b>nærmest meg</b></span></div>
</div>

<div v-click class="divider mt-4"></div>

<div v-click class="text-sm opacity-60 mt-2">
Informasjonen er spredt over ulike apper og nettsider. Ingen viser <b>alt</b> på ett kart.
</div>

</div>

::right::

<div class="mt-10">

## Ingen dekker Stavanger

| Løsning     | 🅿️ | 🚲 | 🚌 | Stavanger |
| ----------- | :-: | :-: | :-: | :-------: |
| Citymapper  | ❌  | ✅  | ✅  |    ❌     |
| Moovit      | ❌  | ❌  | ✅  |    ⚠️     |
| SpotHero    | ✅  | ❌  | ❌  |    ❌     |
| Parkopedia  | ✅  | ❌  | ❌  |    ⚠️     |
| Entur       | ❌  | ❌  | ✅  |    ✅     |
| **Vår app** | ✅  | ✅  | ✅  |  **✅**   |

</div>

<!--
Presenter notes:
Klikk gjennom hvert punkt for å bygge opp problemet.
Tabellen viser at ingen eksisterende løsning dekker Stavanger med parkering + sykkel + buss.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Hva vi har bygget ✨

## Kjernefunksjoner

<div class="mt-3 space-y-2 text-sm">
  <div>🗺️ Interaktivt kart — <b>parkering + sykkel + buss</b></div>
  <div>🎨 Fargekodede markører <span class="text-green-400">grønn</span> → <span class="text-red-400">rød</span></div>
  <div>🔍 Søk og filtrering</div>
  <div>📱 PWA — installerbar på mobil</div>
  <div>🌍 Flerspråklig (NO / EN / ES)</div>
  <div>🔄 Auto-oppdatering av data</div>
</div>

::right::

<div class="mt-12">

## Nye i denne hacken

<div class="mt-3 space-y-2 text-sm">
  <div>🌙 <b>Mørk modus</b> — respekterer system-tema</div>
  <div>⭐ <b>Favoritter</b> — lagre favorittplasser</div>
  <div>📏 <b>Gangavstand</b> — tid og distanse</div>
  <div>📍 <b>Geolokasjon</b> — vis min posisjon</div>
  <div>📈 <b>Prediksjon</b> — forutsi ledige plasser</div>
  <div>🏙️ <b>4 byer</b> — Stavanger, Bergen, Trondheim, Oslo</div>
</div>

<div class="divider"></div>
<div class="text-xs text-green-400">✅ Phase 1 komplett + deler av Phase 2–4</div>

</div>

<!--
Presenter notes:
Klikk gjennom kjernefunksjonene én og én. Høyre kolonne viser hva som er nytt i denne hacken.
-->

---
layout: center
class: text-center
---

# Demo 🎬

<div class="cover-subtitle mt-4 mb-8">La oss se appen i aksjon</div>

<div class="flex gap-4 justify-center">
  <span class="feature-pill">🗺️ Kartet</span>
  <span class="feature-pill">🔍 Søk & filter</span>
  <span class="feature-pill">🌙 Mørk modus</span>
  <span class="feature-pill">📱 Mobil PWA</span>
</div>

<div class="text-sm opacity-40 mt-8">Bytt til nettleseren og vis appen</div>

<div class="mt-4">
  <a href="http://localhost:8080" target="_blank" class="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all inline-flex items-center gap-2">
    🌐 Åpne appen — localhost:8080
  </a>
</div>

<!--
Presenter notes:
LIVE DEMO — bytt til nettleseren.
Vis: kartet med alle lag, søk, filtrer, bytt by, mørk modus, installer PWA.
Bruk ca. 2-3 minutter her — dette er presentasjonens høydepunkt.
-->

---
layout: center
class: text-center
---

# Tech Stack 🛠️

<div class="grid grid-cols-4 gap-6 mt-6">
  <div class="tech-tile">
    <div class="tech-icon">⚛️</div>
    <div class="tech-name">React 19</div>
    <div class="tech-desc">UI Framework</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">⚡</div>
    <div class="tech-name">Vite 6</div>
    <div class="tech-desc">Build & Dev</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">🗺️</div>
    <div class="tech-name">Leaflet</div>
    <div class="tech-desc">Kart</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">🎨</div>
    <div class="tech-name">EDS</div>
    <div class="tech-desc">Equinor Design</div>
  </div>
</div>

<div class="grid grid-cols-4 gap-6 mt-4">
  <div class="tech-tile">
    <div class="tech-icon">📦</div>
    <div class="tech-name">PWA</div>
    <div class="tech-desc">Workbox + Offline</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">🌍</div>
    <div class="tech-name">i18next</div>
    <div class="tech-desc">3 språk</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">📊</div>
    <div class="tech-name">Open Data</div>
    <div class="tech-desc">opencom.no + Entur</div>
  </div>
  <div class="tech-tile">
    <div class="tech-icon">🔒</div>
    <div class="tech-name">TypeScript</div>
    <div class="tech-desc">Strict mode</div>
  </div>
</div>

<!--
Presenter notes:
React 19 + Vite 6 gir lynrask utvikling. Leaflet for kartvisning. EDS for Equinor-standard.
PWA gjør appen installerbar. i18next for 3 språk. Open Data fra opencom.no og Entur.
-->

---
layout: two-cols
layoutClass: gap-5
---

# AI-drevet utvikling 🤖

<div class="text-sm opacity-70 mb-3">Copilot CLI var med i <b>hele arbeidsflyten</b> — ikke bare koding</div>

## Hva AI gjorde for oss

| Oppgave           | Resultat                        |
| ----------------- | ------------------------------- |
| Kodeanalyse       | Utforsket kodebasen på minutter |
| Konkurrentanalyse | 7 plattformer analysert         |
| Prosjektplan      | 26 Issues m/ akseptansekriterier |
| CI/CD             | Super-linter + Lefthook         |
| Kodekvalitet      | CSS nesting, OKLCH, @property   |
| Dokumentasjon     | README, CONTRIBUTING, Slidev    |
| Testing           | UAT-template + Playwright       |
| Deep research     | 5 rapporter, 80 000+ ord        |
| Video             | TTS + Playwright screen-capture |

::right::

<div class="mt-12">

## 5 dype research-analyser

<div v-click>

<div class="glass-sm mb-2">
<div class="text-sm">🔍 <b>Konkurranseanalyse</b> — 7 plattformer</div>
</div>

<div class="glass-sm mb-2">
<div class="text-sm">💰 <b>Utviklingskostnader</b> — DRY + CI-strategi</div>
</div>

<div class="glass-sm mb-2">
<div class="text-sm">🎤 <b>Presentasjonsteknikk</b> — Narrativ + design</div>
</div>

<div class="glass-sm mb-2">
<div class="text-sm">📝 <b>Ren Markdown</b> — Comark/MDC i Slidev</div>
</div>

<div class="glass-sm">
<div class="text-sm">🎨 <b>Moderne CSS</b> — Nesting, OKLCH, @property</div>
</div>

</div>

<div v-click class="gradient-card mt-3 text-center text-sm">
Copilot CLI = <b>utviklingspartner</b>, ikke kodegenerator
</div>

</div>

<!--
Presenter notes:
Tabellen viser bredden av AI-bruk. Høyre kolonne: klikk gjennom 5 research-rapporter.
Copilot CLI er en utviklingspartner — analyserer, planlegger, skriver kode, setter opp CI/CD, alt fra terminalen.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Kvalitetssikring ✅

## Automatisert UAT (Playwright)

<div class="grid grid-cols-3 gap-3 mt-4">
<div class="stat-card">
  <div class="stat-value text-green-400">57</div>
  <div class="stat-label">Bestått</div>
</div>
<div class="stat-card">
  <div class="stat-value text-red-400">12</div>
  <div class="stat-label">Feil*</div>
</div>
<div class="stat-card">
  <div class="stat-value text-yellow-400">3</div>
  <div class="stat-label">Skipped</div>
</div>
</div>

<div class="divider"></div>

<div class="text-xs opacity-50">
* CSP-header + Leaflet DivIcon i headless — fungerer i ekte nettleser
</div>

::right::

<div class="mt-12">

## CI/CD Pipeline

<div class="mt-3 space-y-3 text-sm">

<div class="glass-sm">
🥊 <b>Lefthook</b> — pre-commit hooks (parallell)<br>
<span class="text-xs opacity-60">prettier · markdownlint · stylelint · tsc</span>
</div>

<div class="glass-sm">
🔍 <b>Super-linter</b> v8.3.1 — GitHub Actions<br>
<span class="text-xs opacity-60">CSS · HTML · JSON · Markdown · YAML · Actions</span>
</div>

<div class="glass-sm">
📝 <b>Docs-as-code</b> — alt versjonskontrollert<br>
<span class="text-xs opacity-60">README · CONTRIBUTING · Slidev · UAT</span>
</div>

</div>

</div>

<!--
Presenter notes:
57 av 72 UAT-tester bestått. 12 feil er CSP/DivIcon-relatert (fungerer i ekte nettleser).
CI/CD: Lefthook for pre-commit, Super-linter for GitHub Actions, docs-as-code.
-->

---
layout: two-cols
layoutClass: gap-6
---

# Utviklingskostnad 💰

<div class="text-sm opacity-70 mb-2">Mennesker jobber gratis — hva koster AI og infrastruktur?</div>

## Kostnader

| Post                    |   Kostnad |
| ----------------------- | --------: |
| Knut — Claude API       |   $43.13  |
| Einar — Copilot CLI     |     $0\*  |
| GitHub Actions (46 min) |    $0.37  |
| Copilot × 2 seter       |  $38/mnd  |
| Hosting                 |       $0  |

<div class="text-xs opacity-50 mt-1">* Copilot Business inkludert — tilsvarende API-kost: ~$207</div>

::right::

<div class="mt-12">

## AI-bidrag i tall

| Metrikk          |      Verdi |
| ---------------- | ---------: |
| Totale commits   |         78 |
| AI co-authored   |   43 (55%) |
| — Copilot CLI    |         43 |
| — Claude API     |         34 |
| Kodelinjer (src) |      2 963 |
| Premium requests |        279 |
| Tokens prosessert | 64M+ inn  |

<div class="gradient-card mt-2 text-center">
<b class="text-lg">~$81 + $38/mnd</b><br>
<span class="text-xs opacity-60">→ 3 000 LOC, full CI/CD, 4 byer (~$250 i API-verdi)</span>
</div>

</div>

<!--
Presenter notes:
Total kostnad er ~$81 + $38/mnd for Copilot-abonnement.
Copilot CLI alene brukte 174 premium requests og 64M tokens — tilsvarende ~$207 i API-kost.
55% av commits er AI co-authored via Copilot CLI. Knut brukte Claude API direkte for $43.
Samlet AI-verdi: ~$250 i API-kostnader, levert for $81 + abonnement.
-->

---
layout: two-cols
layoutClass: gap-6
---

# GitHub Project Status 📋

## Issues (26 + 2 test)

| Status           | Antall |
| ---------------- | :----: |
| ✅ Lukket         |     6  |
| 📋 Åpen (P1–P4)  |    17  |
| 🧪 Test-issues   |     2  |

<div class="divider"></div>

<div class="text-xs opacity-60">
✅ geolokasjon · dark mode · favoritter · gangavstand · prediksjon · multi-city
</div>

::right::

<div class="mt-12">

## Teamets bidrag

<div class="glass-sm mt-3">
<div class="font-bold text-sky-400 mb-1">Knut Erik — Funksjoner</div>
<div class="text-sm opacity-80">i18n · dark mode · favoritter · gangavstand · geolokasjon · prediksjon · multi-city · Entur transit</div>
</div>

<div class="glass-sm mt-2">
<div class="font-bold text-emerald-400 mb-1">Einar — AI & Kvalitet</div>
<div class="text-sm opacity-80">Copilot CLI prosjektledelse · konkurranseanalyse · 26 issues · CI/CD · docs · UAT</div>
</div>

</div>

<!--
Presenter notes:
6 issues lukket, 17 åpne med prioritet P1–P4. 2 test-issues for UAT.
Knut Erik: alle funksjoner. Einar: prosjektledelse via AI, kvalitetssikring, dokumentasjon.
-->

---

# Veikart 🗺️

<div class="mt-2">

```mermaid {theme: 'dark'}
timeline
    title Utviklingsplan — Stavanger Mobilitet
    Phase 1 - UX ✅ : Geolokasjon ✅
                    : Mørk modus ✅
                    : Favoritter ✅
                    : Gangavstand ✅
    Phase 2 - Multi-modal : Entur buss/ferge ✅
                           : Kolumbus sanntid
                           : El-sparkesykler
                           : Ruteplanlegger
    Phase 3 - Smart : ML-prediksjon ✅
                    : Push-varsler
                    : Reiseplanlegger
                    : Delbare lenker
    Phase 4 - Plattform : Multi-by ✅
                        : OpenTripPlanner
                        : Brukerkontoer
                        : Åpent API
```

</div>

<!--
Presenter notes:
4 faser: UX (ferdig), Multi-modal (pågår), Smart (prediksjon ferdig), Plattform (multi-by ferdig).
Vi har levert funksjonalitet fra alle 4 faser allerede.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Neste steg 🚀

## Phase 2: Multi-modal hub

<div class="text-sm opacity-70 mb-3">Gjøre appen til <b>den</b> mobilitetsappen for Stavanger</div>

<div class="space-y-2">
  <div class="glass-sm">🚏 <b>Kolumbus sanntid</b></div>
  <div class="glass-sm">🛴 <b>El-sparkesykler</b></div>
  <div class="glass-sm">🗺️ <b>Ruteplanlegger</b></div>
  <div v-click class="glass-sm">⚡ <b>Elbil-lading</b></div>
  <div v-click class="glass-sm">♿ <b>WCAG 2.1 AA</b></div>
</div>

::right::

<div class="mt-10">

## Allerede levert utover Phase 1

<div class="space-y-2 mt-3">

<div class="gradient-card">

🏙️ **Multi-city** — Bergen, Trondheim, Oslo [Phase 4]{.badge .badge-amber .ml-1}

</div>

<div class="gradient-card">

📈 **Prediksjon** — forutsi tilgjengelighet [Phase 3]{.badge .badge-amber .ml-1}

</div>

<div class="gradient-card">

🚌 **Entur API** — buss/ferge-data [Phase 2]{.badge .badge-green .ml-1}

</div>

<div class="gradient-card">

🔍 **CI/CD** — Super-linter + Lefthook [Infra]{.badge .badge-blue .ml-1}

</div>

</div>

<div class="text-xs opacity-40 mt-3">
Inspirasjon: Digitransit 🇫🇮 + Entur 🇳🇴
</div>

</div>

<!--
Presenter notes:
Phase 2 er neste: Kolumbus sanntid, el-sparkesykler, ruteplanlegger.
Vi har allerede levert funksjonalitet fra Phase 2, 3 og 4 i tillegg til Phase 1.
-->

---
layout: center
class: text-center
---

# Takk! 🙌

<div class="mt-4">
  <div class="cover-subtitle">
    <b>Stavanger Mobilitet</b> — parkering, bysykler og kollektiv, ett kart
  </div>
</div>

<div class="flex gap-3 justify-center mt-6">
  <span class="feature-pill">🏙️ 4 byer</span>
  <span class="feature-pill">🌍 3 språk</span>
  <span class="feature-pill">📋 26 issues</span>
  <span class="feature-pill">🤖 100% AI-drevet</span>
</div>

<div class="mt-6 text-sm opacity-50">
Team 8: <b>Einar Fredriksen</b> & <b>Knut Erik Hollund</b><br>
Bouvet AI Hack · 11. mars 2026
</div>

<div class="mt-6">
  <a href="https://github.com/Bouvet-deler/aihack-team8" target="_blank" class="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all inline-flex items-center gap-2">
    <carbon-logo-github /> GitHub Repo
  </a>
</div>

<!--
Presenter notes:
Takk for oppmerksomheten! Åpne for spørsmål.
Pek til GitHub-repo for mer detaljer.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Teamet bak 👨‍💻👨‍💻

## Einar Fredriksen

<div class="mt-3 space-y-2 text-sm">
  <div>🤖 <b>AI-flusterer</b> — 58 commits, samtlige med Copilot som makker</div>
  <div>🎨 <b>Estetikeren</b> — glassmorfisme, OKLCH-farger, CSS-nesting, slides med custom theme</div>
  <div>📊 <b>Meta-entusiasten</b> — tracker utviklingskost, lager video om utviklingsprosessen, dokumenterer alt</div>
  <div>🌙 <b>Nattugle</b> — 12-timers sesjoner er «en vanlig kveld»</div>
  <div>🗣️ <b>Pragmatiker</b> — «hvis porten er opptatt betyr det at HMR allerede kjører»</div>
</div>

<div v-click class="glass-sm mt-4 text-xs">

📋 **Utviklingsplan:**

- Bygge kompetanse som intern **AI-evangelis** — dele erfaringer med AI-par-programmering på tvers av team
- Styrke **frontend-arkitektur og testing** for å balansere presentasjonsarbeid med solid kjerneimplementasjon

</div>

::right::

<div class="mt-12">

## Knut Erik Hollund

<div class="mt-3 space-y-2 text-sm">
  <div>🏗️ <b>Feature-maskinen</b> — 55 commits med reelle features: sykler, sparkesykler, lading, prediksjon, multi-by</div>
  <div>🔀 <b>Git-pedagogen</b> — feature branches, PR-reviews, issue-numre i hver commit</div>
  <div>♿ <b>Tilgjengelighetsforkjemperen</b> — Lighthouse 92, WCAG 2.1 AA, PWA update-toast</div>
  <div>🔧 <b>Infrastruktur-guruen</b> — .htaccess rewrites, build-versjonering, skipWaiting</div>
  <div>📋 <b>Systematikeren</b> — 26 issues opprettet, alle med tydelig scope og akseptansekriterier</div>
</div>

<div v-click class="glass-sm mt-4 text-xs">

📋 **Utviklingsplan:**

- Ta en mer synlig rolle i **kunnskapsdeling** — presentere tilgjengelighet og PWA-beste-praksis for avdelingen
- Utforske **backend-arkitektur** — ta med server-side proxy og API-gateway kompetanse for produksjonsklare løsninger

</div>

</div>

<!--
Presenter notes:
En liten observasjon fra AI-assistenten som har vært med hele veien.
Einar er mannen som gjør utviklingsprosessen til kunst — tracker hver krone, lager videoer, polerer slides.
Knut er mannen som bygger ting som faktisk virker — feature etter feature, med PRs og issues.
Sammen utfyller de hverandre perfekt: én som selger drømmen, én som bygger den.
-->
