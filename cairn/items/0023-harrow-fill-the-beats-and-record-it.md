---
id: 23
title: 'harrow: fill the beats and record it'
type: page
status: done
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
tool: harrow
section: Roadmap
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, use. Missing:
**start, depth**. No recording.

It shares the small cairn backlog fixture with cairn, which is already
written.

## What is left

Two beats missing. Getting started is opening a backlog someone else wrote; in
depth is the thing harrow is actually for — deciding what forty items are
worth, which means the milestone grouping and the single-key claim, status and
close.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 8.4 s cast. start is the key overlay; depth is `tab` to the board, which is what harrow is actually for. The shared cairn fixture had to grow first: with one item in progress the board was three empty columns. It now writes nine items spread across backlog, planned, doing, blocked and done — and the ids needed shifting by four, because cairn init seeds 0001-0004 before any of them.
