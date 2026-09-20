---
id: 11
title: Bring the recordings doc up to date
type: docs
status: done
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: s
section: site
---

`docs/recordings.md` is the best thing written about how this site is made,
and it will be out of date the moment 0006 lands: it opens by comparing four
ways of demoing a tool, one of which is the session, and its fan-out table
offers "story first, or keep the typed session" as a resting place for seven
tools.

It also needs the two new ways of showing a tool (0008, 0009) in that
comparison, and the fan-out table refreshed as each wave finishes.

## Acceptance criteria

- [x] The comparison covers recording, screens, gallery and audio
- [x] The fan-out table matches what is actually in `screens.json`
- [x] Nothing in it describes the typed session as a live option

## 2026-09-20

Done. The comparison table gains gallery and sound, and says plainly that the typed session is gone. The fan-out table now matches screens.json: jerk added, and the row that used to offer 'story first, or keep the typed session' as a resting place for seven tools is replaced by a row per reason — macOS only, needs more than one machine, has no interface, needs a GitHub fixture, needs a workspace, nothing implemented yet.
