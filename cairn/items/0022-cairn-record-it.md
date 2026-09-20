---
id: 22
title: 'cairn: record it'
type: page
status: done
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

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded: 4 shots, a 12.0 s cast (14 KB), from commit 3d67f0c7ea57 on main. The CLI case is the easy one — no mouse, no waiting, and the four short commands fit one screen each with a clear between them.

Captions were already right and are unchanged. Version checked against the binary on the desk: cairn 0.2.1, which is what the page says. Site link added by 0010 (oddurs.github.io/cairn). `more` now ends by saying this site's own roadmap is kept in cairn, which it is — these items.
