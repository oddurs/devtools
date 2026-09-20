---
id: 38
title: Draw braille and blocks in the container the way the site does
type: chore
status: backlog
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
section: site
---

## 2026-09-20

Found while building gummyworm's gallery (0016).

The site loads term-glyphs.otf at playback — braille dots raised and block elements filling the whole cell, drawn as Ghostty draws them — so a recording looks right. The container does not have that font, so every **screenshot** is baked with JetBrains Mono's own versions: an unraised braille dot is a hollow ring, and a block element leaves a gap above and below, which turns gummyworm's blocks palette into horizontal stripes and poptop's timeline into a field of circles.

Tried the obvious fix — install the font in the image and put it first in xterm's fontFamily — and it fails in an interesting way: xterm measures the cell from the first family, Term Glyphs has a different advance, and the terminal fitted 76 columns instead of 125. Every other recording on the site is 125x29, so that is worse than the problem.

The way that should work is the way the site already does it: keep 'JetBrains Mono' as xterm's fontFamily so the measurement is unchanged, and add a @font-face for Term Glyphs with a unicode-range covering only braille and the block elements, injected into the page before the terminal renders. Rendering then falls to the glyph font for those ranges only.
