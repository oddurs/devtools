---
id: 8
title: A gallery, for tools whose output is pictures
type: feature
status: done
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: m
section: site
shows:
- gallery
---

## Problem

gummyworm draws images in the terminal. Its recording shows it doing that, and
its four screens show four moments of it — but the thing a person wants from
that page is to see a dozen outputs at once and judge whether the renderer is
any good. Four screenshots in a carousel is the wrong shape for that.

## Proposal

A third kind of window: a grid of stills, captioned, with the source image
named. Not a carousel — the comparison is the point, so they are all on screen
together, and a click enlarges one.

It takes what the runner already produces (webp, and gif where the output
moves), so the runner needs a step that shoots a plain image rather than the
terminal, or a story that copies the tool's own output files out of the
container.

Worth keeping in mind for fontina too (0032), which is about typefaces and has
the same problem.

## Acceptance criteria

- [x] A `gallery` view, alongside `recording` and `screens`, offered only when
      a tool has one
- [x] It reads from `screens.json`, validated by `screens.test.ts` like the rest
- [x] Animated output plays without a library, and does not autoplay under
      `prefers-reduced-motion`
- [x] It works at phone width: the grid reflows rather than scrolling sideways

## 2026-09-20

Built as Gallery.svelte: a contact sheet, not a window — the other two views are the tool running and belong in one; these are what it produced. A plate carries an optional `source` (what the tool was given) and an optional `still`, which is what shows for an animated plate until it is asked to play, and all it ever shows under reduced motion. Click enlarges; arrows and escape work in the lightbox. Validated in screens.test.ts, which also refuses a gif without a still. No tool has a gallery yet: gummyworm's plates come with 0016.
