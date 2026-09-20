---
id: 29
title: 'brevity: a story from nothing'
type: page
status: blocked
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: m
tool: brevity
section: Reading
shows:
- recording
- screens
---

## Where it stands

No story at all.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Cutting something short. A fixture of a few long articles to summarise, and a
decision to make first: if it calls a model, the recording has to either carry
a real answer from a real call, or be honest that the output is canned. This
site's rule is that nothing is invented, so the model call happens once, its
output is committed as a capture, and the story replays it.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked, and the reason is the tool's own design rather than the rig.

brevity's readme opens: 'Copy something long. Press a key. A chime tells you the summary has replaced it on your clipboard. No window, no terminal, no output.' There is no interface to photograph. A recording of a terminal would show a prompt and nothing else, which is true and useless.

It also needs a model key, and this site's rule is that output is never invented — so a summary on the page has to be one a real call really produced.

What would actually work is a gallery (0008), used for something other than pictures: two plates side by side, the passage that was copied and the summary that replaced it, from one real call made once and committed like a capture. That is the page. It needs a key and a decision about which model made it, both of which are the maintainer's to make.
