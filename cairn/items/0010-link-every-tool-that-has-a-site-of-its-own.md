---
id: 10
title: Link every tool that has a site of its own
type: feature
status: done
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: s
section: site
---

The page already renders a `site` link next to Source when an entry has one,
and exactly one entry does: starward, at <https://starward.dev>.

That is almost certainly wrong rather than true. This is the pass that finds
out: for each of the twenty-four, is there a site, a documentation page, a
crates.io or Homebrew page worth linking? Some will have none, and saying so
here is the point — so the next person does not wonder whether it was checked.

The released ones are the likeliest: quarry, cairn, knit, fontina, gummyworm,
starward, tsi.

## Acceptance criteria

- [x] Every tool checked, and the ones with a site have `site:` set
- [x] The link is to a page about the tool, not to the repository, which is
      already linked
- [x] Recorded here: which tools were checked and found to have none

## 2026-09-20

Checked all 24 with `gh api repos/oddurs/<tool>/pages` and curled every URL that came back. Six have a site that serves and is about the tool, not the repository:

    quarry     https://oddurs.github.io/quarry/    200
    cairn      https://oddurs.github.io/cairn/     200
    knit       https://oddurs.github.io/knit/      200
    fontina    https://oddurs.github.io/fontina/   200
    gummyworm  https://gummyworm.dev/              200   custom domain
    starward   https://starward.dev/               200   already set

Five added; starward was the one already there, normalised to a trailing slash.

Checked and found to have none: poptop, andy, yoghurt, caligula, rigor, brainiac, jerk, nun, harrow, trafford, hackney, brevity, polkadot, clackson, tsi, turborust, triblenka. Two repos list a homepage that is only the repository again — rsst points at its own readme and knit at its repo root — so rsst gets no link and knit gets its Pages site instead. All 24 repos are public.
