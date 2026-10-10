---
id: 43
title: Retake the stills from a script, not by hand
type: chore
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p2
effort: s
section: site
---

The posters were taken by a throwaway script. They will go stale as the sites
change, and nothing records how they were made.

## Acceptance criteria

- [ ] `npm run posters` retakes every poster from the `site` in tools.ts
- [ ] Per-tool steps live beside the URL (dismiss a tour, rewrite a path, wait longer)
- [ ] Same size and quality as now: 1600×1000, `cwebp -q 84`
- [ ] Documented in docs/recordings.md alongside the studio
