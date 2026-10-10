---
id: 67
uid: edd740bb-c917-48fb-ab14-dfe44c520f63
title: Check every linked address, every week
type: feature
status: backlog
milestone: hosting
created: 2026-10-09
updated: 2026-10-09
priority: p2
effort: m
section: site
---

Eighty-odd pages now link to sites the site does not control, and einstein
broke without anyone noticing. A scheduled workflow that requests every `site`
in tools.ts and fails on anything but a 200 — and, for the browser pieces,
that their stylesheets load too.

## Acceptance criteria

- [ ] A weekly GitHub Actions job, separate from `verify` so a flaky host cannot block a push
- [ ] Fails with the tool name and the status for each address that broke
- [ ] Catches einstein's failure mode: the page loads and its assets do not
