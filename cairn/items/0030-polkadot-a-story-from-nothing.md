---
id: 30
title: 'polkadot: a story from nothing'
type: page
status: done
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

## 2026-09-20

Unblocked, and shot — by a second source rather than a new kind of view.

polkadot is still macOS-only and the studio is still Linux. What changed is that a story can now say source: 'desk', meaning the material was captured on the machine the tool is for. The entry is stamped runner: 'desk', the page discloses it under the caption, and the data refuses to name a commit, because a desk capture came from whatever was on that Mac rather than from a checkout built here. screens.test.ts enforces that last part.

The page now shows the real doctor report — all fifty lines, links, binaries, shell and theme — in the site's terminal palette, from the capture that has been sitting in src/lib/data/captures all along. So 0007 was right to keep it.

The trick that made it clean: run it as { run: 'clear; cat report.ansi' } rather than as a hidden step. clear in the same command wipes the line just typed along with the screen, so the shot is the report and nothing else. A hidden step appends its own clear *after* the command, which throws the output away — the first attempt photographed an empty prompt.

One shot rather than four. A captured report is one picture; the four-beat story is a convention for a tool you can drive. More beats would need more captures taken on the desk, which is a few minutes with the tool in hand.
