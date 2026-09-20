---
id: 32
title: 'fontina: a story from nothing'
type: page
status: done
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
tool: fontina
section: Desk
shows:
- screens
- gallery
---

## Where it stands

A story stub with no shots.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Typefaces. Like gummyworm, the output is the argument, and a carousel of four
terminal screenshots is the wrong shape for comparing faces — this is the
second customer for the gallery (0008). Specimens side by side, at a size you
can judge.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] A gallery of its output, enough of it to compare (needs 0008)
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a macOS runner, same as 0026 and 0033. fontina is marked 'runner: host' in the manifest.

What it needs beyond the runner: the gallery from 0008, which is built and working — gummyworm proves the path. Specimens of a typeface side by side is exactly the shape a gallery is for, and exactly the shape four terminal screenshots in a carousel is not.

## 2026-09-20

Unblocked by the tool, like andy: fontina is 'a lightweight, cross-platform font manager' and activates fonts per user on Linux as well as macOS, so the runner: 'host' marking was stale. Out of that list.

Shot and recorded, 4 beats and 6 plates, 44 s cast. hero is the keyboard-first browser — 204 families down one side, and everything known about the selected face beside it: axes, features, coverage by script, licence, designers, metrics. start is `scan --system`. use is `covers` asked of four scripts at once, Icelandic, Greek, Russian and Armenian, which narrows 336 faces to 8. depth is `facets`, the library counted along every axis, including the freedom verdict the project exists for: 334 free, 2 unstated.

The gallery is the point of this page, and the reason 0008 was built. A font is its shapes and no list of names carries that, so six plates set the same word in DejaVu Serif, EB Garamond, Cantarell, DejaVu Sans, Fira Code and JetBrains Mono — shaped by fontina itself and drawn in the terminal.

The fixture apt-installs fonts-liberation2, cantarell, ebgaramond, firacode and noto-core. The image ships three families, which is not a library; those five make it 336 faces across 204 families and a dozen scripts, which is what makes the coverage and freedom questions real rather than decorative.

Two takes to settle: the preview text was cut off at 24px until it came down to one specimen word, and `covers` was asked of Icelandic alone, which matched 82 faces and scrolled the question off the top.
