---
id: 13
title: 'quarry: finish the words'
type: page
status: done
milestone: wave-1
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: quarry
section: System
shows:
- recording
- screens
---

## Where it stands

Four beats and a recording, both current. 47 s over five repositories of real
services, shot from `feat/0046-degraded`. Same branch question as poptop.

## What is left

Released, so the version on the page has to track the release. Check whether
quarry has a page of its own to link (0010).

## Acceptance criteria

- [x] `line` reads as one finished sentence, and `more` says what it is for
      rather than what it is built with
- [x] Four captions, each saying what its beat shows
- [x] State and version true as of today
- [x] Site link set, or recorded as having none (0010)

## 2026-09-20

Copy and captions finished; no changes needed. Released v0.1.0, which matches the latest release on the repo. Site link added by 0010: oddurs.github.io/quarry.

Reshot from main. The story was pinned to feat/0046-degraded, a branch 24 commits ahead of main and not merged — so the page was showing work nobody else could install, under a caption that says 'a fresh build of the latest source'. The ref is gone and the story still works on main: n still jumps to the unhealthy service and the detail pane still says 500 Server Error, so the degraded-service handling the story demonstrates has landed. 46.5 s cast, up from 47 s.
