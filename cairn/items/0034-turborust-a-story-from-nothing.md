---
id: 34
title: "turborust: a story from nothing"
type: page
status: backlog
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
tool: turborust
section: Web
shows:
- recording
- screens
---

## Where it stands

No story. A web project, so it is shot through the browser steps (`goto`,
`waitFor`, `click`) rather than the terminal ones.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Fast rebuilds, which is a claim about time — so the beat that matters is the
one showing a rebuild happening, and a recording carries that better than any
screenshot. A time-lapse of a cold build against a warm one would make the
argument in ten seconds.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
