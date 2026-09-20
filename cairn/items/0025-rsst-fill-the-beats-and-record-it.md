---
id: 25
title: "rsst: fill the beats and record it"
type: page
status: backlog
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: l
tool: rsst
section: Reading
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, use. Missing:
**start, depth**. No recording.

Feeds, numbered against a reference list.

## What is left

Two beats missing, and the real work is the fixture: the story needs feeds,
and live feeds would date the recording the way hackney's does. A handful of
seeded RSS files served locally would hold still. There is an `rsst.svg` in
`static/media/demos/` from before the runner existed, which the screens
supersede.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
