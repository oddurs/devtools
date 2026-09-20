---
id: 30
title: 'polkadot: a story from nothing'
type: page
status: blocked
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: polkadot
section: Desk
shows:
- recording
- screens
---

## Where it stands

No story, but the only tool with a real captured output already in the
repository: `src/lib/data/captures/polkadot-doctor.ansi`, which the typed
session replays today.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

The machine itself. The easiest of the ten: the capture proves the output is
worth showing, and a story that runs `polkadot doctor` in the container
reproduces it live. If it cannot run in Linux, the capture can be typed out
instead — but then 0007 should keep the file rather than delete it.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a macOS runner, the same as 0026, 0032 and 0033 — and this one was not obvious from the roadmap, which had polkadot down as the easiest of the ten.

It is not. polkadot is 'a Mac, the way I like it': it installs Homebrew, symlinks a Mac's dotfiles, sets up launch agents and a theme. Run in a Linux container, `polkadot doctor` would truthfully report a machine with none of it, which is a photograph of nothing.

What does exist is the capture already in the repository, src/lib/data/captures/polkadot-doctor.ansi — fifty lines of real output from the Mac polkadot maintains, links and brew and agents all in place. Two ways it could reach the page, neither of them taken:

- cat the capture in the container and photograph that. The output is real, but the screenshot would show `cat doctor.ansi` at the prompt, and a shot captioned as polkadot running while the prompt says cat is not worth having.
- type `polkadot doctor` and print the capture. That is inventing, which is the one thing this site does not do.

So the capture stays where it is, and 0007 should keep the file rather than delete it: it is the raw material for this page the day there is a macOS runner.
