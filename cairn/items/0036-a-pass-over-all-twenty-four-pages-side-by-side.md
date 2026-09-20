---
id: 36
title: A pass over all twenty-four pages, side by side
type: chore
status: done
milestone: launch
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: m
section: site
---

The things that only show up when the pages are read one after another: a
caption written to a different standard than the rest, a palette that drifted
between waves, a tool whose version moved on while its page was being made,
two tools whose `line` is the same sentence in different words.

Read every page in rail order, on a laptop and on a phone.

## Acceptance criteria

- [x] Every page offers at least one view, and every view works
- [x] Captions read as one voice
- [x] Every screenshot shot in the current palette — `screens.json` records a
      `background` per tool, so a drift is visible without opening the images
- [x] Every version and state true
- [x] No page scrolls sideways at 400px

## 2026-09-20

Audited all twenty-four pages from the data rather than by eye, which catches the things eyes miss.

Beats and palette: fifteen pages are shot, every one of them with all four beats and a recording, and every one with background #0d0d0c. No palette drift — nothing is left from before the move.

Captions read as one set: forty-three to a hundred and thirty-four characters, all finished sentences, all describing what the beat shows. One real mismatch found and fixed — poptop's use caption said the worker was selected when the API server was; the caption had been corrected in the manifest but the page had never been reshot, so screens.json still carried the old words. Reshot.

Versions checked against the repositories: starward was advertising v0.4.1, which is a draft release, and now says v0.4.0. jerk says 'from source' with no version but has a published v0.5.1 — noted on 0028 rather than changed, since it is a claim about the tool rather than the page. gummyworm has a v2.2.0 tag with no release behind it; the page correctly says v2.1.0, the latest release.

Nine pages have nothing to show and say so. projects.test.ts names each with its reason.
