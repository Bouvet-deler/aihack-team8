# Stavanger Mobilitet — Project Guide for Claude

## What this app does
A real-time web map for Stavanger showing free parking spots and city bike stations.
Data auto-refreshes on a configurable interval. Users can search, filter by layer,
and switch between a parking list and a bike station list in the sidebar.

---

## Tech stack
| Layer | Choice |
|-------|--------|
| Build | Vite 6 |
| UI | React 19 + TypeScript 5.7 |
| Map | react-leaflet v5 (v5 required for React 19 compat) |
| Design | Equinor Design System (EDS) — pure CSS, no EDS React components |
| i18n | i18next + react-i18next |
| Styling | Plain CSS (App.css) + EDS design tokens as CSS vars |

### Key packages
- `@equinor/eds-core-react` v2.3.7
- `@equinor/eds-tokens` v2.2.0
- `@equinor/eds-icons` v1.3.0
- `styled-components` v6 (peer dep for EDS)
- `i18next` + `react-i18next`

---

## Project structure
```
src/
  i18n/
    index.ts              # i18next setup (NO/EN/ES, localStorage persistence)
    locales/
      no.json             # Norwegian translations (default)
      en.json             # English translations
      es.json             # Spanish translations
  components/
    Map.tsx               # MapContainer + TileLayer + marker rendering
    ParkingMarker.tsx     # DivIcon circle markers, color by free spots, popup
    BikeMarker.tsx        # DivIcon rounded-square markers, color by availability, popup
    Sidebar.tsx           # Search, tabs, layer toggles, list, language switcher
  hooks/
    useParking.ts         # Fetch + auto-refresh + abort + validation for parking API
    useBikes.ts           # Fetch + auto-refresh + abort + validation for bike API
  types/
    parking.ts            # ParkingSpot interface
    bike.ts               # BikeStation interface
  App.tsx                 # Top-level layout, shared state
  App.css                 # All styles (EDS tokens, sidebar, map, markers)
  main.tsx                # Entry point — imports i18n before App renders
```

---

## APIs
### Parking
- Proxy: `/api/parking` → `https://opencom.no/dataset/.../parking.json`
- Fields: `Dato`, `Klokkeslett`, `Sted`, `Latitude`, `Longitude`, `Antall_ledige_plasser`
- Note: `Antall_ledige_plasser` is returned as a **string** — always call `Number()` when using it

### City bikes
- Proxy: `/api/bikes` → `https://opencom.no/dataset/.../citybikesstvg_entur_processed.json`
- Fields: `station_id`, `name`, `lat`, `lon`, `capacity`, `num_vehicles_available`, `num_docks_available`, `is_renting`, `is_returning`, `last_reported`
- All fields are correct types (lat/lon are numbers). ~248 stations, 224 active.

CORS proxy is configured in `vite.config.ts` via `server.proxy`.

---

## Design tokens
- Primary color: `#007079` (Moss Green, `--eds-primary`)
- Font: "Equinor" — loaded from `https://cdn.eds.equinor.com/font/eds-uprights-vf.css`

### Parking marker colours
| Free spots | Colour |
|-----------|--------|
| > 100 | `#22c55e` green |
| 50–100 | `#eab308` yellow |
| 20–50 | `#f97316` orange |
| < 20 | `#ef4444` red |

### Bike marker colours
| Condition | Colour |
|-----------|--------|
| Not renting | `#9ca3af` grey |
| 0 available | `#ef4444` red |
| 1–2 available | `#f97316` orange |
| 3–5 available | `#eab308` yellow |
| > 5 available | `#22c55e` green |

---

## i18n
- Languages: Norwegian (no), English (en), Spanish (es)
- Default: `no`
- Persistence: `localStorage` key `lang`
- Translation files: `src/i18n/locales/{no,en,es}.json`
- Pattern in components: `const { t } = useTranslation()` then `t('key')`
- Pattern in hooks/non-React: `import i18n from '../i18n'; i18n.t('key')`
- Switcher: compact NO | EN | ES buttons in the sidebar header

---

## Security
- `divIcon` XSS: `Antall_ledige_plasser` coerced with `Number()` before HTML interpolation
- API validation: `isValidSpot()` / `isValidStation()` type guards filter malformed records
- CSP meta tag in `index.html` (script-src self, connect-src self, frame-ancestors none)
- Generic error messages shown to user (never raw fetch errors)

---

## Running locally
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build (runs tsc first)
```

---

## Git branches
- `main` — production-ready code
- `feature/i18n` — merged; adds NO/EN/ES language switcher
