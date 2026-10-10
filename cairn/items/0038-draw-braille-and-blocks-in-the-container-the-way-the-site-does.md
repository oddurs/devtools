---
id: 38
uid: edacbd4d-b5b8-4532-9cda-5452cbaa15d9
title: Draw braille and blocks in the container the way the site does
type: chore
status: done
milestone: platform
created: 2026-09-20
updated: 2026-10-03
priority: p2
effort: m
section: site
---

## 2026-09-20

Found while building gummyworm's gallery (0016).

The site loads term-glyphs.otf at playback — braille dots raised and block elements filling the whole cell, drawn as Ghostty draws them — so a recording looks right. The container does not have that font, so every **screenshot** is baked with JetBrains Mono's own versions: an unraised braille dot is a hollow ring, and a block element leaves a gap above and below, which turns gummyworm's blocks palette into horizontal stripes and poptop's timeline into a field of circles.

Tried the obvious fix — install the font in the image and put it first in xterm's fontFamily — and it fails in an interesting way: xterm measures the cell from the first family, Term Glyphs has a different advance, and the terminal fitted 76 columns instead of 125. Every other recording on the site is 125x29, so that is worse than the problem.

The way that should work is the way the site already does it: keep 'JetBrains Mono' as xterm's fontFamily so the measurement is unchanged, and add a @font-face for Term Glyphs with a unicode-range covering only braille and the block elements, injected into the page before the terminal renders. Rendering then falls to the glyph font for those ranges only.

## 2026-10-03

Done, and it turned out to be the smaller half of a bigger fault.

The bigger one: **box drawing**. A font draws its rules to its own line box, so
at any line height above 1 — and a terminal's row is always taller than its
type — every frame in every TUI comes apart between the rows. It is visible in
every screenshot the studio has ever taken: harrow's panel border was a dashed
column of gaps, not a line. The characters a terminal draws for itself are not
just braille and blocks; they are U+2500–257F as well, and those are the ones
that hold a screen together.

So the glyph font now covers all three ranges, box drawing included, drawn from
a description rather than by hand: four arms per character, each absent, light,
heavy or double, plus the arcs, the diagonals and the dashes
(`scripts/box-drawing.mjs`). 128 characters out of one table.

The 76-column failure recorded above did not come back: Term Glyphs carries
JetBrains Mono's advance exactly, so putting it first in the stack measures the
same cell, and the re-shoot came out 125 columns as always. What did change is
the line height. The studio was at 1.2 and the player at 1.12, so a glyph drawn
for one was wrong in the other; both are 1.12 now, which is also what the font
is drawn for, and `screens/line-height.test.ts` holds the three copies of that
number together.
