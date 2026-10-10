---
id: 57
uid: a9a7a8c4-053a-4f17-ac5c-371d3c6ec4a5
title: 'bushy: a story from nothing'
type: page
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p2
effort: m
tool: bushy
section: Toys
shows:
- recording
- screens
---

## Where it stands

New to the site, with nothing to show.

## What it should show

Needs a face in front of a camera. Chromium can feed a video file as the
camera (`--use-file-for-fake-video-capture`), so a short clip of a willing
face, used with permission, would let it be shot headless.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] Off the `unshot` list in `src/lib/data/projects.test.ts`
