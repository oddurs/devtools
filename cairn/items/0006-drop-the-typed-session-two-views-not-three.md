---
id: 6
title: "Drop the typed session: two views, not three"
type: feature
status: planned
milestone: platform
labels:
- blocked-by-wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: l
section: site
---

## Problem

A page can show three things: a recording, the screens, and a session you can
type into. The session was the fallback for tools that could not be
photographed — it never invents output, but it is a shell that answers `help`
and little else, and it is the weakest of the three everywhere it appears.

Two views is the decision: the tool running, and the tool's screens.

## The order matters

Ten tools have nothing but a session today (wave-3). `views()` returns the
views a tool can offer, and with the session gone it returns an empty list for
every one of them: no window, no caption, a page that is a title and a
paragraph. So this lands **after** wave-3, or at the same time as it.

The alternative — landing it first and letting ten pages stand empty — is
worth considering only if wave-3 slips badly.

## What it touches

    src/lib/components/Demo.svelte     the third branch, and the `chosen` state
                                       that exists only so the session can take
                                       the keyboard without swallowing j and k
    src/lib/terminal/Session.svelte    delete
    src/lib/terminal/session.ts        delete: nothing else imports it
    src/lib/terminal/session.test.ts   delete with it
    src/lib/data/projects.ts           `View`, `views()`
    src/routes/system/+page.svelte     it demonstrates a Session; needs another
                                       example, or the section goes

The data and the docs are 0007.

## Acceptance criteria

- [ ] Every tool page offers at most two views, and every tool has at least one
- [ ] `t` still cycles, `←`/`→` still step, and nothing swallows `j`/`k`
- [ ] /system does not demonstrate a component that no longer exists
- [ ] `npm run verify` passes with the session's tests gone rather than skipped
