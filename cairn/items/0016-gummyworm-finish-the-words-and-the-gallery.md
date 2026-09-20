---
id: 16
title: 'gummyworm: finish the words, and the gallery'
type: page
status: done
milestone: wave-1
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: m
tool: gummyworm
section: Desk
shows:
- recording
- screens
- gallery
---

## Where it stands

Four beats and a recording, both current. 25 s: ImageMagick's wizard in
characters, in colour, in blocks, and every palette it knows.

## What is left

This is the page the gallery (0008) is for. The recording and the four screens
stay; the gallery is added beneath them, and the copy should point at it — the
tool's whole argument is how the output looks, and a dozen of them side by
side makes it.

## Acceptance criteria

- [x] `line` reads as one finished sentence, and `more` says what it is for
      rather than what it is built with
- [x] Four captions, each saying what its beat shows
- [x] State and version true as of today
- [x] Site link set, or recorded as having none (0010)
- [x] A gallery of its output, enough of it to compare (needs 0008)

## 2026-09-20

Copy and captions finished, and the gallery built — this was the page 0008 existed for.

Eleven plates: the same ImageMagick wizard in every palette gummyworm knows, from plain characters through detailed, shades, retro, blocks, braille, binary, matrix and simple, to the moon-phase emoji at half the width because the glyphs are twice as wide.

They are terminal screenshots, not the tool's own PNG export, and that took two attempts to settle. gummyworm can export PNG through librsvg, so the first version added librsvg to the image and collected the files — and they came out as vertical stripes, because rsvg in the container has no monospace font to lay the cells out with. A plate is now a `plate` step in the story: the same screenshot as a beat, in the same terminal and the same palette as everything else on the page, trimmed to its content so a dozen of them read across rather than each being two thirds empty terminal.

One thing is worse in a plate than on the site: the blocks and braille palettes stripe, because the container has JetBrains Mono rather than the site's term-glyphs font. Filed as 0038; the recording of the same commands is fine, because the site applies the glyph font at playback.

Version v2.1.0 matches the latest release. There is a v2.2.0 tag with no release behind it, which is a gummyworm-side question rather than a page one. Site link added by 0010: gummyworm.dev.
