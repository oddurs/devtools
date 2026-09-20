---
id: 31
title: 'knit: a story from nothing'
type: page
status: blocked
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: l
tool: knit
section: Desk
shows:
- recording
- screens
---

## Where it stands

No story. Released, so it is on the site as a finished tool with nothing to
show for it.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Machines woven together, which means more than one machine — the hardest
fixture on the list. Possibly two containers on a network, possibly a fake
peer the tool can talk to. Worth scoping before it is scheduled; if it turns
out to need real hardware, say so and give the page a still.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on hardware, not on a story.

knit shares compute between machines: 'run knit up on each machine, then knit run -- <cmd> anywhere and it executes on whichever machine has the most spare headroom'. The readme's own example is output streamed back from a Mac Studio. One container is one machine, and a demonstration of distributed scheduling with a single node is a demonstration of nothing — it would always choose localhost, and the caption would have to say so.

Two ways it could be done, both beyond this item: two containers on a docker network with the runner driving one of them, which the runner has no concept of today; or shooting it on the desk against the machines it was written for, which needs the macOS runner that 0026, 0030, 0032 and 0033 are also waiting on.

knit is released at v0.4.1 and has a site, so it is one of the more finished tools on the rail with one of the emptiest pages. Worth putting ahead of the other blocked four when a runner exists.
