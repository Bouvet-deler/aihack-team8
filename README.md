# Stavanger Mobilitet 🚗🚲

> Real-time parking & bike availability for Stavanger — on one map.

Built during **Bouvet AI Hack** by Team 8: [Einar Fredriksen](https://github.com/einaren) & [Knut Erik Hollund](https://github.com/knu73r1k)

---

## Quick start

```bash
npm install
npm run dev          # App → http://localhost:5173
npm run slides       # Presentation → http://localhost:3030
```

---

## Features

| Feature | Status |
|---------|:------:|
| 🗺️ Interactive map — parking + city bikes | ✅ |
| 🎨 Color-coded availability markers | ✅ |
| 🔍 Search and filtering | ✅ |
| 📱 PWA — installable on mobile | ✅ |
| 🌍 Multi-language (NO / EN / ES) | ✅ |
| 🔄 Auto-refresh (configurable interval) | ✅ |
| 🌙 Dark mode (system-aware + manual toggle) | ✅ |
| ⭐ Favorites (localStorage) | ✅ |
| 📏 Walking distance & time | ✅ |
| 📍 Geolocation — show my position | ✅ |

---

## Documentation (docs-as-code)

All documentation lives in the repo and follows [docs-as-code](https://www.writethedocs.org/guide/docs-as-code/) principles — version-controlled, plain-text, reviewable in PRs.

| Artifact | Location | Format |
|----------|----------|--------|
| **Status report / presentation** | [`docs/slides.md`](docs/slides.md) | Slidev (Markdown) |
| **Slide assets** | [`docs/assets/`](docs/assets/) | PNG |
| **Manual test templates** | [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | GitHub Issue Template |
| **Automated tests** | [`tests/`](tests/) | Playwright / Node.js |
| **AI project guide** | [`CLAUDE.md`](CLAUDE.md) | Markdown |
| **Feature backlog** | [GitHub Issues](https://github.com/Bouvet-deler/aihack-team8/issues) | GitHub |

### 📊 Presentation

The project includes a [Slidev](https://sli.dev) status report that runs directly from the repo:

```bash
npm run slides          # Dev mode with hot reload → http://localhost:3030
npm run slides:build    # Static export → dist-slides/
```

The slide deck covers: problem & competitive landscape, features, tech stack, AI-powered workflow, UAT results, and the 4-phase roadmap. Source: [`docs/slides.md`](docs/slides.md).

### 🧪 Testing

Manual tests are maintained as **GitHub Issue Templates** (`.github/ISSUE_TEMPLATE/`) — each test run is an issue with task-list checkboxes for traceability.

Automated UAT scripts live in `tests/` and run against the dev server with Playwright.

```bash
npm run dev &                          # Start app
node tests/uat-test.cjs                # Run automated UAT
```

---

## Data sources

| Source | Dataset | Update frequency |
|--------|---------|:----------------:|
| **Parking** | [Stavanger Parkering](https://opencom.no/dataset/stavanger-parkering) — 9 P-hus | Every 2 min |
| **City bikes** | [Bysykkel Stavanger](https://opencom.no/dataset/3e1b1ea2-1155-4058-8f92-8cbc9f547e72) via Entur | Real-time |

Open data from [opencom.no](https://opencom.no), proxied through Vite dev server (`vite.config.ts`).

---

## Color coding

### Parking (circles)

| Free spots | Color |
|:----------:|:-----:|
| > 100 | 🟢 Green |
| 51–100 | 🟡 Yellow |
| 21–50 | 🟠 Orange |
| ≤ 20 | 🔴 Red |

### Bikes (rounded squares)

| Available | Color |
|:---------:|:-----:|
| > 5 | 🟢 Green |
| 3–5 | 🟡 Yellow |
| 1–2 | 🟠 Orange |
| 0 | 🔴 Red |
| Not renting | ⚪ Grey |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 6 |
| Language | TypeScript 5.7 |
| Map | react-leaflet v5 + Leaflet |
| Design system | Equinor Design System (EDS) |
| i18n | i18next + react-i18next |
| PWA | vite-plugin-pwa + Workbox |
| Docs & slides | Slidev |
| Testing | Playwright |

---

## Project structure

```
├── docs/
│   ├── slides.md                  # 📊 Slidev status report
│   └── img/                       # Slide/doc images
├── tests/
│   ├── uat-test.cjs               # 🧪 Automated UAT (Playwright)
│   └── uat-results.json           # Latest test results
├── src/
│   ├── App.tsx                    # Root layout, shared state
│   ├── App.css                    # Styles (EDS tokens)
│   ├── components/
│   │   ├── Map.tsx                # Leaflet map + markers
│   │   ├── Sidebar.tsx            # Search, tabs, toggles, list
│   │   ├── ParkingMarker.tsx      # Parking markers (color-coded)
│   │   └── BikeMarker.tsx         # Bike markers (color-coded)
│   ├── hooks/
│   │   ├── useParking.ts          # Parking data fetch + polling
│   │   ├── useBikes.ts            # Bike data fetch + polling
│   │   └── useFavorites.ts        # Favorites persistence
│   ├── i18n/
│   │   ├── index.ts               # i18next config
│   │   └── locales/               # no.json, en.json, es.json
│   └── types/                     # TypeScript interfaces
├── public/
│   ├── img/                       # Images served by Slidev & app
│   └── icons/                     # PWA icons
├── .github/ISSUE_TEMPLATE/        # Manual UAT test templates
├── CLAUDE.md                      # AI project guide
└── vite.config.ts                 # Vite + PWA + API proxy
```

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | App dev server (port 5173) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve production build |
| `npm run slides` | Slidev presentation (port 3030) |
| `npm run slides:build` | Build static slides → `dist-slides/` |

---

## Roadmap

See [GitHub Issues](https://github.com/Bouvet-deler/aihack-team8/issues) — organized in 4 phases:

| Phase | Focus | Status |
|-------|-------|:------:|
| **1 — UX Foundations** | Geolocation, dark mode, favorites, distance | ✅ Done |
| **2 — Multi-modal Hub** | Entur buses, e-scooters, EV charging, routing | 📋 Planned |
| **3 — Smart Features** | Push notifications, ML prediction, trip planner | 📋 Planned |
| **4 — Platform Scale** | Multi-city, OpenTripPlanner, accounts, open API | 📋 Planned |

---

## License

[MIT](LICENSE)
