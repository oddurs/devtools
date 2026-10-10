---
id: 49
uid: 8662f3c8-7d8b-4f6a-9371-0749daa744f8
title: 'x-post: a story from nothing'
type: page
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p3
effort: s
tool: x-post
section: Projects
shows:
- recording
- screens
---

## Where it stands

New to the site, with nothing to show.

## What it should show

It posts to X, so the story stops at `--dry-run`: a release note turned into a
post and a thread, with the weighted character count shown. No credentials in
the container.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] Off the `unshot` list in `src/lib/data/projects.test.ts`
