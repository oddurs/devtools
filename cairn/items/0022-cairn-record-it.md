---
id: 22
title: "cairn: record it"
type: page
status: backlog
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: cairn
section: Roadmap
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for all four. No beats are
missing. No recording.

Four beats already. A command-line tool, so the story is several short
commands rather than a program being driven.

## What is left

Only the recording is missing, and it is the easiest kind: no mouse, no
waiting, just typing. Released at 0.2.1 — check the version on the page still
matches. This backlog is written in cairn, which is worth a sentence in
`more`.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
