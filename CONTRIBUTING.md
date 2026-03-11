# Contributing to Stavanger Mobilitet

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Branch strategy

- `main` — production-ready code
- Feature branches: `feature/<name>` or `<name>/<issue-number>`

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — user-facing features (included in release notes)
- `fix:` — user-facing bug fixes (included in release notes)
- `docs:` — documentation changes
- `style:` — code formatting (no logic change)
- `ci:` — CI/CD pipeline changes
- `chore:` — maintenance, dependencies
- `test:` — test additions or fixes

> **Important**: `feat` and `fix` are reserved for changes
> visible to end users. Use `ci:`, `build:`, `chore:` etc.
> for DevOps-only changes.

## i18n patterns

- Languages: Norwegian (no), English (en), Spanish (es)
- Default: `no`, persisted in `localStorage` key `lang`
- Translation files: `src/i18n/locales/{no,en,es}.json`
- In components: `const { t } = useTranslation()` → `t('key')`
- In hooks: `import i18n from '../i18n'; i18n.t('key')`

## Code style

- TypeScript strict mode
- CSS in `src/App.css` using EDS design tokens as CSS variables
- Stylelint standard rules (config: `.github/linters/`)
- Markdownlint for all `.md` files

## Testing

Run automated UAT tests against the dev server:

```bash
npm run dev &
node tests/uat-test.cjs
```

Manual tests use GitHub Issue Templates — create an issue
from the UAT template and check off each step.
