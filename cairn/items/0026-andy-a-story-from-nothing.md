---
id: 26
title: 'andy: a story from nothing'
type: page
status: blocked
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
tool: andy
section: System
shows:
- recording
- screens
---

## Where it stands

A story stub exists in `screens/manifest.mjs` with no shots in it.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Where the disk went. The fixture is the whole job: a filesystem with a
believable shape — a few enormous caches, a directory that is large for a
boring reason, and one that is large for an interesting one — so the tool has
something to find. A synthetic tree of sparse files would shoot fine and stay
small in the image.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a macOS runner, not on a story.

andy is macOS-only by design — its whole subject is where developer tooling hides disk space on a Mac: OrbStack container images, Xcode leftovers, simulator disks, ~/Library caches. The screens runner is a Linux container, and the manifest already marks andy 'runner: host' so the runner skips it rather than shooting something false.

Two ways forward, both bigger than this item: a macOS runner (ttyd and a headless browser driven on the host, with the same palette and the same 1600x1000 frame), or a hand-taken screenshot on a real Mac, which would not match the palette the other twenty-three pages share.

Until then the page has nothing to show, which is why 0006 cannot land.
