---
id: 10
title: Link every tool that has a site of its own
type: feature
status: backlog
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

- [ ] Every tool checked, and the ones with a site have `site:` set
- [ ] The link is to a page about the tool, not to the repository, which is
      already linked
- [ ] Recorded here: which tools were checked and found to have none
