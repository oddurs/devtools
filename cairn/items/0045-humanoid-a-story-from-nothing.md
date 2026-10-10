---
id: 45
title: 'humanoid: a story from nothing'
type: page
status: backlog
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p1
effort: m
tool: humanoid
section: Agents
shows:
- recording
- screens
---

## Where it stands

New to the site, with nothing to show.

## What it should show

A shadow remote between agents and a real one. The story needs a scratch
repository, a burst of agent commits pushed into humanoid, and the rewritten
history that comes out — `scripts/demo.sh -planner heuristic` exists for this
and needs no model.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] Off the `unshot` list in `src/lib/data/projects.test.ts`
