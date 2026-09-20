---
id: 15
title: "hackney: finish the words"
type: page
status: planned
milestone: wave-1
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: hackney
section: Reading
shows:
- recording
- screens
---

## Where it stands

Four beats and a recording, both current. 43 s on the live front page. Nothing
is seeded: it reads the public API, so the recording is that day's news and
will age visibly.

## What is left

Decide whether that is a feature — it is honest, and it dates the page. If
not, it needs a fixture, which is a bigger job than a caption pass. There is
also a `hackney.gif` in `static/media/demos/` at 2.1 MB, the largest file in
the repository, and nothing references it now that the screens exist.

## Acceptance criteria

- [ ] `line` reads as one finished sentence, and `more` says what it is for
      rather than what it is built with
- [ ] Four captions, each saying what its beat shows
- [ ] State and version true as of today
- [ ] Site link set, or recorded as having none (0010)
