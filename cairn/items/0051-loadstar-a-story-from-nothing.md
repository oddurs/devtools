---
id: 51
uid: cf6a2e25-73ac-41e8-93bd-737ce2345b75
title: 'loadstar: a story from nothing'
type: page
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p1
effort: m
tool: loadstar
section: Machines
shows:
- recording
- screens
---

## Where it stands

New to the site, with nothing to show.

## What it should show

The boot sequence and the phases, with real installs. It writes dotfiles and
makes SSH keys, so the container is the right place for it, and the GitHub
step must stop short of a real account.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] Off the `unshot` list in `src/lib/data/projects.test.ts`
