---
id: 30
title: "polkadot: a story from nothing"
type: page
status: backlog
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: polkadot
section: Desk
shows:
- recording
- screens
---

## Where it stands

No story, but the only tool with a real captured output already in the
repository: `src/lib/data/captures/polkadot-doctor.ansi`, which the typed
session replays today.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

The machine itself. The easiest of the ten: the capture proves the output is
worth showing, and a story that runs `polkadot doctor` in the container
reproduces it live. If it cannot run in Linux, the capture can be typed out
instead — but then 0007 should keep the file rather than delete it.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
