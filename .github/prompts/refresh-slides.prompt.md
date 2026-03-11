# Refresh Slidev Presentation

Gather live data and regenerate `docs/slides.md` for
**Stavanger Mobilitet** (Bouvet AI Hack, Team 8).

## Step 1 — Gather data

Run these commands and collect the output:

```console
git --no-pager rev-list --all --count
git --no-pager log --all --format="%b" | grep -c "Co-authored-by"
git --no-pager log --all --format="%b" | grep -c "Copilot"
git --no-pager log --all --format="%b" | grep -c "Claude"
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1
```

From GitHub (use `gh` CLI or GitHub MCP):

- Issue counts: open/closed, by phase label
- Actions workflow runs: total, passed, failed, total minutes
- Latest merged PRs and who authored them

Read `public/dev-costs.json` for AI cost data.

## Step 2 — Slide structure

The presentation MUST have these slides in order:

1. **Title** — name, tagline, date, city/feature/AI stats
2. **Problemet** — why this app exists, competitor table
3. **Hva vi har bygget** — features list, what's new
4. **Tech Stack** — grid of tech icons
5. **AI-drevet utvikling** — AI contribution table, philosophy
6. **Copilot CLI i praksis** — screenshot slide
7. **Kvalitetssikring** — UAT results + CI/CD pipeline
8. **Utviklingskostnad** — data from dev-costs.json, commit stats
9. **GitHub Project Status** — issue table, team contributions
10. **Veikart** — mermaid timeline with ✅ on completed items
11. **Neste steg** — upcoming work + already delivered extras
12. **Takk** — closing slide with stats

## Step 3 — Rules

- Language: Norwegian (bokmål)
- Keep `markdownlint-disable` comment on line 14
- Do NOT run prettier on slides.md (in .prettierignore)
- Use Slidev frontmatter separators (`---` with layout/class)
- Tables must use prettier-compatible alignment
- Verify with `npx markdownlint-cli2 docs/slides.md`
- Numbers must reflect ACTUAL data from Step 1, never hardcode
