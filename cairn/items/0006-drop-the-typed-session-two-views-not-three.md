---
id: 6
title: 'Drop the typed session: two views, not three'
type: feature
status: done
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

- [x] Every tool page offers at most two views, and every tool has at least one
- [x] `t` still cycles, `←`/`→` still step, and nothing swallows `j`/`k`
- [x] /system does not demonstrate a component that no longer exists
- [x] `npm run verify` passes with the session's tests gone rather than skipped

## 2026-09-20

Done. Demo.svelte offers recording, screens, gallery and sound; Session.svelte, session.ts and session.test.ts are deleted, and /system draws the sixteen colours from the palette directly rather than replaying an ANSI string through the session's parser.

The consequence the item predicted is real and now visible: nine pages have nothing to show — andy, polkadot, fontina, clackson, knit, brevity, rigor, turborust, triblenka. Rather than let 0006 wait on all nine, the empty case says so: 'Not photographed yet. The studio is a Linux container, and some of these only run on a Mac.' A page that simply stops after its paragraph reads like a bug; one that says why does not.

projects.test.ts keeps the list of the nine with a reason each, and asserts they really have no views — so the list can only shrink, and a tool that falls out of the studio without being named fails the build instead of quietly emptying its page.
