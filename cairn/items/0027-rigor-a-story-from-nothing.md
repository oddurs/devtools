---
id: 27
title: "rigor: a story from nothing"
type: page
status: backlog
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: l
tool: rigor
section: Code
shows:
- recording
- screens
---

## Where it stands

No story. `docs/recordings.md` has it down as "needs a story", and notes it
needs a GitHub fixture.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Pull requests, which means either a recorded GitHub API or a local git server
with a few pull requests staged against it. Recording the API and replaying it
is the version that holds still; going live would date the recording the way
hackney's is dated. Decide which before writing the story, because it changes
the whole shape of it.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own
