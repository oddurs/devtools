---
id: 12
title: 'poptop: finish the words'
type: page
status: done
milestone: wave-1
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: poptop
section: System
shows:
- recording
- screens
---

## Where it stands

Four beats and a recording, both current. 63 s: typed start, a time-lapse,
menus by key and mouse, tabs, filter, inspector, tree, sort, rewind. Shot from
`feat/tab-strip` — check the branch is merged, or reshoot from main so the
page is not showing a branch nobody else has.

## What is left

Its one big idea is the rewind, and the fourth beat carries it. Make sure the
caption says that the process table is as it was then, not merely that the
graph moved.

## Acceptance criteria

- [x] `line` reads as one finished sentence, and `more` says what it is for
      rather than what it is built with
- [x] Four captions, each saying what its beat shows
- [x] State and version true as of today
- [x] Site link set, or recorded as having none (0010)

## 2026-09-20

Reshot from master, and the story had to be rewritten to do it.

poptop was pinned to feat/tab-strip, a branch 39 commits ahead of master and 32 behind — diverged, not merged. The page was showing a menu bar and tabs that nobody who installs v0.1.0 has. Dropping the ref made the story fail at step 19, clicking a 'View' menu that does not exist on master, which is the proof the branch was doing real work in the picture.

The story now uses only what master ships: ? for the keys, / to filter to the node processes, t for the tree, s to sort, and then the rewind — click the graph, wheel back, step sample by sample — which is poptop's whole idea and is on master. 4 shots, 38.4 s cast (down from 63 s, since the menu and tab sections are gone).

The use caption said the worker was selected when the API server was; it now names the three processes rather than the selection. Copy and version otherwise unchanged: v0.1.0 from source matches the repo's only release.
