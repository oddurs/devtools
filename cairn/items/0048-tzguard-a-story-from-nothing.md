---
id: 48
uid: e9ba29a4-4eb3-424e-9620-aa73aff35315
title: 'tzguard: a story from nothing'
type: page
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p2
effort: s
tool: tzguard
section: Code
shows:
- recording
- screens
---

## Where it stands

New to the site, with nothing to show.

## What it should show

Two releases and a dataset: `tzguard diff 2025a 2025b` reproducing the IANA
announcement, then `scan` saying which of your zones a release touches.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] Off the `unshot` list in `src/lib/data/projects.test.ts`
