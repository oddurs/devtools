---
id: 34
title: 'turborust: a story from nothing'
type: page
status: done
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
tool: turborust
section: Web
shows:
- recording
- screens
---

## Where it stands

No story. A web project, so it is shot through the browser steps (`goto`,
`waitFor`, `click`) rather than the terminal ones.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Fast rebuilds, which is a claim about time — so the beat that matters is the
one showing a rebuild happening, and a recording carries that better than any
screenshot. A time-lapse of a cold build against a warm one would make the
argument in ten seconds.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 18 s cast. It needed only cargo, not trunk or leptos, so it is shootable in the Linux container after all — the roadmap had it down as needing a multi-service workspace, which it does, but a small one is enough.

The fixture is a three-crate workspace with a real path-dependency closure: api and worker both depend on shared. That is the whole point of the tool — turborust asks cargo metadata for the closure and derives the watch globs from it, instead of you writing them by hand and forgetting crates/shared. The plan and why beats show exactly that: api watches crates/api and crates/shared, 'derived from crate api'.

First take left the plan and why shots in an almost empty terminal. Removed the clears between them so the short commands stack up the screen, which is the technique docs/recordings.md already recommends.
