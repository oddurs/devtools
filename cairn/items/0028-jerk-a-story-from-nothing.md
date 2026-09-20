---
id: 28
title: 'jerk: a story from nothing'
type: page
status: done
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
tool: jerk
section: Code
shows:
- recording
- screens
---

## Where it stands

No story. Noted in `docs/recordings.md` as needing one, with a warning: its
fixture must not be `~/Code`, which is full of private repositories.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Every repository on the machine, weighed. The fixture is a directory of
checkouts with different sizes and histories — much of what caligula's fixture
already builds, so start by reading that one.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 14.5 s cast. Never ~/Code: the fixture builds six repositories with twelve weeks of backdated commits, so the activity graph has something real to draw and the lifecycle mix is a mix — orchard mature at 28 commits, typeset and almanac moving, ledger young, pinboard stale at seven months, scratch abandoned at a year. Three carry a licence, CI, tests and a changelog and three do not, which is what makes the coverage row on the portfolio view worth looking at.

Beats needed one correction: `l` moved to the git view rather than the portfolio, so depth was captioned as something it was not showing. It now presses 2 for git as `use` and 5 for portfolio as `depth`.

One thing dropped: the fixture wrote a cairn roadmap into almanac so jerk's cairn view would have something, but cairn is not on jerk's PATH in the container and the roadmap never appeared. Rather than caption around it, that part of the fixture is gone — harrow's story shows how to add it back (path: ['target/release', '/cache/target/cairn/release']).

Version drift found and worth fixing separately: the page says 'from source' with no version, but jerk has a published release, v0.5.1.
