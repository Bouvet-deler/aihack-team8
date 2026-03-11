# CLAUDE.md

> Project context for AI assistants. Human-readable docs
> are in [README.md](README.md) and
> [CONTRIBUTING.md](CONTRIBUTING.md).

## Quick reference

See [README.md](README.md) for features, tech stack,
project structure, API reference, and roadmap.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development
workflow, commit conventions, i18n patterns, and testing.

## AI-specific notes

### Key packages (with versions)

- `@equinor/eds-core-react` v2.3.7
- `@equinor/eds-tokens` v2.2.0
- `@equinor/eds-icons` v1.3.0
- `styled-components` v6 (peer dep for EDS)
- `react-leaflet` v5 (required for React 19 compat)

### Gotchas

- `Antall_ledige_plasser` from the parking API is a
  **string** — always coerce with `Number()` before use
- `divIcon` uses raw HTML — sanitize all interpolated values
- Bike API has ~248 stations but only ~224 are active
  (`is_renting: true`)
- `react-leaflet` v5 is required — v4 is incompatible
  with React 19
- CORS proxy in `vite.config.ts` is dev-only — production
  needs a server-side proxy or CORS headers