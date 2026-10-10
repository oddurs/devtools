---
id: 70
uid: 79b4bf7b-f484-402f-b9a0-1fdb0bf79fa1
title: 'rockaway: deploy the site the README links'
type: chore
status: backlog
milestone: hosting
created: 2026-10-09
updated: 2026-10-09
priority: p2
effort: s
tool: rockaway
section: Web
---

The README links oddurs.github.io/rockaway, which is a 404. Pages is configured for a workflow build, and CI builds the site and uploads it as an artifact, but nothing deploys it: the workflow says deploying is a separate step, and that step does not exist yet.

Until then the page on this site shows a capture from the README and the command that runs the site locally.

## Acceptance criteria

- [ ] A deploy job (or workflow) that publishes the built site from main to Pages
- [ ] oddurs.github.io/rockaway/ answers and renders
- [ ] `site` set in tools.ts, and a poster taken from it
- [ ] Repository homepage set
