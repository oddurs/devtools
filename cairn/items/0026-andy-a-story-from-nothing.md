---
id: 26
title: 'andy: a story from nothing'
type: page
status: done
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

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a macOS runner, not on a story.

andy is macOS-only by design — its whole subject is where developer tooling hides disk space on a Mac: OrbStack container images, Xcode leftovers, simulator disks, ~/Library caches. The screens runner is a Linux container, and the manifest already marks andy 'runner: host' so the runner skips it rather than shooting something false.

Two ways forward, both bigger than this item: a macOS runner (ttyd and a headless browser driven on the host, with the same palette and the same 1600x1000 frame), or a hand-taken screenshot on a real Mac, which would not match the palette the other twenty-three pages share.

Until then the page has nothing to show, which is why 0006 cannot land.

## 2026-09-20

Unblocked by the tool, not by the rig: andy 1.2 works on Linux as well as macOS ('work everywhere, not just run everywhere'), so the container can shoot it. Out of the runner: 'host' list.

Shot and recorded, 4 beats, 12.7 s cast, in a 39-row terminal because the summary is tall. hero is the ranked accounting, start is `--commands` — the promise the tool is built on, that it prints what would reclaim each thing and runs none of it — use is the interactive browser, depth is the treemap, where the area carries the magnitude.

The fixture allocates real bytes across the paths andy genuinely looks for on Linux: cargo registry, go module cache, npm, maven, uv, rustup toolchains, podman storage, the Hugging Face hub, turbo cache, and project target/ and node_modules directories. du counts allocated blocks, which is what andy measures, so every figure on screen is a measurement.

Two corrections along the way. The first fixture used the sizes from andy's own readme — 7.5G of one target, 28G of container images — and filled the Docker VM's disk, which took the daemon's metadata store with it and cost an image rebuild. It now checks df first and refuses under 6G free, and allocates about 3G. The second: andy counts a target/ or node_modules as project output only when a manifest sits beside it saying what kind of project it is, so the first run put 1 GB of cargo targets nowhere. With Cargo.toml and package.json written, project artifacts is the largest category at 1.2G, which is andy's own point about where the disk goes.
