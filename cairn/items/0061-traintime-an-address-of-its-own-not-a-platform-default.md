---
id: 61
title: 'traintime: an address of its own, not a platform default'
type: chore
status: backlog
milestone: hosting
created: 2026-10-09
updated: 2026-10-09
priority: p1
effort: s
tool: traintime
section: Maps
---

Live only at traintime-site-production.up.railway.app. The repository's
homepage still points at oddurs.github.io/traintime/, which is a 404. Made
public on 2026-10-09.

Keep it on Railway: the poller records the feeds and the browser-only Pages
build cannot replay or score. Give it a custom domain instead.

## Acceptance criteria

- [ ] A custom domain on the Railway service (traintime.oddurs.com, say)
- [ ] The repository's homepage set to it
- [ ] `site` in tools.ts updated, and the poster retaken
