---
id: 60
uid: ceb999f8-a601-42e2-be3f-e8ed7c6cf178
title: 'einstein: the site lost its styles when the repository was renamed'
type: chore
status: done
milestone: hosting
created: 2026-10-09
updated: 2026-10-09
closed_at: 2026-10-09
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

- [x] `base` (and `site`) in the Astro config say `/einstein/`
- [x] The README's links to oddurs.github.io/einstein-tile/ updated
- [x] Redeployed, and the page renders with its scenes working
- [x] The poster retaken without the path rewrite

## 2026-10-09

Done 2026-10-10: base, smoke/shots/type scripts, README and the source link moved to /einstein (oddurs/einstein 5efbef0); deployed, and the poster retaken from the live page.
