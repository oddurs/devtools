---
id: 20
title: 'brainiac: fill the beats and record it'
type: page
status: done
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
tool: brainiac
section: Code
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, start, use. Missing:
**depth**. No recording.

Indexing a repository, then asking it a question and getting ranked
`file:line` spans back.

## What is left

The missing beat is in depth. The obvious candidate is the token budget: it
ranks a repository's skeleton against a budget, and showing what falls off the
end when the budget shrinks is the argument for the tool.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 14.6 s cast. The missing beat was in depth and the token budget was the right answer: the same repo map at -b 400 instead of -b 1500, captioned as what a smaller context window still gets told. Copy unchanged — it was already right.
