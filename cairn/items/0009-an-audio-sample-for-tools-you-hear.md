---
id: 9
title: An audio sample, for tools you hear
type: feature
status: done
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: m
section: site
shows:
- audio
---

## Problem

clackson is a keyboard you can hear. Nothing on a page of screenshots conveys
it, and a recording of a terminal conveys it least of all: the whole tool is
the sound, and the terminal is silent.

## Proposal

A player: a short sample, a waveform drawn from it, and a play button. Silent
until asked — nothing on this site makes a noise without being told to.

The sample should be the real thing, recorded the way the screens are: a take
from the tool itself, with what is being typed shown alongside, so a person
can see the keys and hear them at once.

Two or three samples would be better than one, if clackson has switch profiles
worth comparing.

## Acceptance criteria

- [x] An `audio` view, offered only when a tool has a sample
- [x] Never plays on its own, and says how long it is before it starts
- [x] A waveform, drawn from the file rather than an image of one
- [x] Keyboard reachable, labelled, and legible in both themes
- [x] The file is committed like the casts are, and named in `screens.json`

## 2026-09-20

Built as Sound.svelte. One row per sample: play, the waveform, how long it is, and what was being typed while it was recorded. The waveform is an SVG drawn from a `peaks` array the runner measures off the file — the criterion was a waveform rather than a picture of one, and precomputed levels satisfy it without fetching and decoding audio on page load. The audio element is preload=none and there is no autoplay anywhere, so the page is silent and cheap until asked. Playing one sample stops the others. Validated in screens.test.ts, which rejects a take whose peaks never rise above 0.2 — a waveform measured off silence draws a flat line and says nothing. clackson's actual samples come with 0033.
