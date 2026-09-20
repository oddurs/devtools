---
id: 9
title: An audio sample, for tools you hear
type: feature
status: backlog
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

- [ ] An `audio` view, offered only when a tool has a sample
- [ ] Never plays on its own, and says how long it is before it starts
- [ ] A waveform, drawn from the file rather than an image of one
- [ ] Keyboard reachable, labelled, and legible in both themes
- [ ] The file is committed like the casts are, and named in `screens.json`
