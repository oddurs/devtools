---
id: 68
uid: 3b2a30df-0127-4b47-bdb4-02c883975a29
title: A page laid out by what kind of thing it is
type: feature
status: done
milestone: wave-4
created: 2026-10-09
updated: 2026-10-09
priority: p0
effort: m
section: site
---

## What changed

`src/lib/data/templates.ts` is one table from a project's kind to how its
page is built: which comes first under the title, and what the main button
says.

- Terminal tools, libraries, languages and apps: the words, the command that
  installs it, then the recording.
- Games, toys, maps, simulations, instruments and art: the picture straight
  under the name, then the words. The still is a link to the thing, and the
  main button is in the tool's own tint: Play, Try it, Explore, Open it,
  Watch, or a verb of its own (rover is driven).
- Explainers, essays, books and courses: the words first and a Read it button.

A still of a web page sits in a browser window with its address in the bar;
a terminal's screens stay in a terminal. A game with no address (arkonk)
falls back to the command that builds it. `templates.test.ts` checks that
every page offers a way in.
