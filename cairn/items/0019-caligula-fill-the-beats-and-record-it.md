---
id: 19
title: 'caligula: fill the beats and record it'
type: page
status: done
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
tool: caligula
section: Code
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, use, depth. Missing:
**start**. No recording.

A fixture of three repositories with linked worktrees, some dirty, some
holding work that exists nowhere else — already written and good.

## What is left

The missing beat is getting started, which for caligula means the moment of
arriving at a machine full of checkouts and seeing them all at once.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 10.6 s cast. The start beat took two tries: run from inside a repository caligula still scans the whole machine, so 'this repository only' was a caption that did not match its picture. Getting started is the key overlay instead, which is what quarry and hackney already do. The depth beat marks three worktrees and the status bar answers with '3 marked · 2 commits only there · d removes them' — that line is the whole argument for the tool, so the caption quotes it.
