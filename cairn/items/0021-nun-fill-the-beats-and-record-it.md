---
id: 21
title: "nun: fill the beats and record it"
type: page
status: backlog
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: l
tool: nun
section: Code
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, depth. Missing:
**start, use**. No recording.

A markdown vault with its tree, the note being edited, and its links and
backlinks.

## What is left

Mouse-first, and so the first real test of the pointer track: the runner
writes a pointer and key track into the cast header and the player draws them
over the terminal. Nothing has exercised it yet on a program that is driven by
the mouse rather than merely accepting one. Budget time for the track being
wrong before it is right. The known issue about drags not reaching poptop is
worth checking here, since nun may rely on them.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
