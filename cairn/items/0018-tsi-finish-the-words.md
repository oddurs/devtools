---
id: 18
title: 'tsi: finish the words'
type: page
status: done
milestone: wave-1
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
tool: tsi
section: Science
shows:
- recording
- screens
---

## Where it stands

Four beats and a recording, both current. 43 s in a 46-row terminal: staging
optimisation, the engine table, one stage, Monte Carlo.

## What is left

The tall-terminal case. Check the screens are not letterboxed on a phone,
where a 46-row shot is very small.

## Acceptance criteria

- [x] `line` reads as one finished sentence, and `more` says what it is for
      rather than what it is built with
- [x] Four captions, each saying what its beat shows
- [x] State and version true as of today
- [x] Site link set, or recorded as having none (0010)

## 2026-09-20

Copy and captions finished; nothing to change. v0.6.0 is tagged and matches the page; there is no GitHub release for it, which is a tsi-side question rather than a page one. No Pages site (0010).

The tall-terminal case: its story sets terminal.height 1500 because tsi prints forty lines, so the shots are 125x46 rather than 125x29. They hold up scaled down — the tables are wide rather than dense — but this is the page to look at first on a phone during 0036.
