---
id: 25
title: 'rsst: fill the beats and record it'
type: page
status: done
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

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 8.6 s cast. start is the key overlay, depth is z — the article given the whole screen at a readable measure, which is what rsst is for.

The fixture was the work, and it is now offline. Three feeds are written as Atom and RSS files and served over the loopback by python3 -m http.server, so the story reads the same nine entries every run: no network from inside the container, and a recording that will not age the way hackney's does. Dates are generated relative to the run, so the list always looks current.

Two things cost a run each. rsst fetches over HTTP and reqwest has no file:// support, so a server is genuinely needed. And the server has to be started with setsid: the fixture shell waits on its own children, so a plain background job left the run hanging in the fixture stage until the 300 s timeout. The fixture now curls the feed before handing over, so a server that did not come up says so instead of timing out later.
