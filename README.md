# Stavanger Parkering & Bysykkel

Real-time map showing free parking spots and city bike stations in Stavanger, Norway. Built during Bouvet AI Hack by Team 8 (Einar & Knut Erik).

## What it does

- Displays live parking availability at city car parks on an interactive map
- Shows city bike station status (available bikes and docks)
- Color-coded markers indicate availability at a glance
- Sidebar with search/filter, tabs to switch between parking and bikes, and layer toggles
- Auto-refreshes data at a configurable interval (default: 60 seconds)

## Color coding

| Color | Parking spots available |
|-------|------------------------|
| Green | > 100 |
| Yellow | 50–100 |
| Orange | 20–50 |
| Red | < 20 |

## Data sources

- **Parking:** [opencom.no parking API](https://opencom.no/dataset/36ceda99-bbc3-4909-bc52-b05a6d634b3f)
- **City bikes:** [opencom.no bysykkel API](https://opencom.no/dataset/3e1b1ea2-1155-4058-8f92-8cbc9f547e72) (Entur/Bysykkel Stavanger)

## Technologies

| Layer | Tech |
|-------|------|
| Framework | React 19 |
| Build tool | Vite 6 |
| Language | TypeScript 5.7 |
| Map | react-leaflet v5 + Leaflet |
| Design system | Equinor Design System (EDS) — tokens & icons |
| Styling | Pure CSS with EDS design tokens as CSS variables |
| CORS proxy | Vite dev server proxy (`server.proxy`) |

## Getting started

```bash
npm install
npm run dev
```

App runs at http://localhost:5173
