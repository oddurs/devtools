---
id: 20
title: "brainiac: fill the beats and record it"
type: page
status: backlog
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

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
