---
id: 27
title: 'rigor: a story from nothing'
type: page
status: done
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p2
effort: l
tool: rigor
section: Code
shows:
- recording
- screens
---

## Where it stands

No story. `docs/recordings.md` has it down as "needs a story", and notes it
needs a GitHub fixture.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

Pull requests, which means either a recorded GitHub API or a local git server
with a few pull requests staged against it. Recording the API and replaying it
is the version that holds still; going live would date the recording the way
hackney's is dated. Decide which before writing the story, because it changes
the whole shape of it.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a credential decision, which is the maintainer's to make.

rigor's readme: 'It reads everything through the gh CLI, so it inherits your existing authentication and never asks for a token.' That is the right design for a desk tool and the wrong one for a container: the screens runner has no gh auth, and the fixture cannot invent pull requests, because pull requests are GitHub's, not git's.

Three ways it could be shot, in the order I would try them:

1. A read-only GITHUB_TOKEN passed into the container, and the story run against a real repository with real open pull requests — oddurs/poptop has several. The output is then genuine, and the recording ages the way hackney's does. I did not do this: putting a credential into the rig is a decision to take deliberately, not as a side effect of making a screenshot.
2. Record gh's responses once and replay them from a stub gh on PATH. Honest if the capture is real, and it holds still — but it is a small piece of infrastructure to build and maintain.
3. Wait for the macOS runner and shoot it on the desk, where gh is already authenticated.

Until one of those, the page says it has not been photographed.

## 2026-09-20

Done, by route 1 of the three in the note above: a token in the rig.

The arrangement, in three parts. scripts/screens.sh borrows the desk's own credential with `gh auth token` and passes it as -e GH_TOKEN — nothing stored, nothing committed, nothing to rotate, and by environment rather than argv so it never reaches ps. A story has to ask for it with `github: true`; the runner deletes GH_TOKEN from every story that does not, so no other tool's build or fixture sees a credential, and a story that asks and does not get one fails loudly rather than photographing an empty dashboard. And secrets.test.ts scans screens.json, every cast, the stories and the committed captures for the shapes credentials come in — a cast is a recording of a terminal, so anything that ever reached the screen would be committed for good.

gh was not in the image at all, so that is a new layer, added last so it costs one small layer rather than every layer above it.

Shot and recorded, 4 beats, 14 s cast, against a real checkout of quarry: 22 open pull requests, Ready 17, Blocked 5. hero is the dashboard with checks rolled into a glyph, start is the keys, use is the Blocked view with the failing check named, depth is Worktrees — every checkout matched to its pull request and marked clean or not.

One correction: the fixture first made worktrees detached, and rigor matches a worktree to its pull request by branch and commit, so none of them matched and the depth beat showed five rows of 'no open PR for this branch'. It now makes them from branches that actually have pull requests open, via gh pr list.

The page dates itself, as hackney's does. That is the bargain of showing real data and it is taken deliberately.
