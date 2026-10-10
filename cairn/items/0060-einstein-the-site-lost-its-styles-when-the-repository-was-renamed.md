---
id: 60
title: 'einstein: the site lost its styles when the repository was renamed'
type: chore
status: backlog
milestone: hosting
created: 2026-10-09
updated: 2026-10-09
priority: p0
effort: s
tool: einstein
section: Explainers
---

The repository was renamed from einstein-tile to einstein, and the Astro build
still has `base: '/einstein-tile/'`. The page at oddurs.github.io/einstein/
loads, but every stylesheet and script 404s, so it renders as unstyled text
and none of the scenes run.

## Acceptance criteria

- [ ] `base` (and `site`) in the Astro config say `/einstein/`
- [ ] The README's links to oddurs.github.io/einstein-tile/ updated
- [ ] Redeployed, and the page renders with its scenes working
- [ ] The poster retaken without the path rewrite
