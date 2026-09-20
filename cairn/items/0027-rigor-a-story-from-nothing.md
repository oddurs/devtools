---
id: 27
title: 'rigor: a story from nothing'
type: page
status: blocked
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

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] `record: true`, and the recording plays clean from a fresh build
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on a credential decision, which is the maintainer's to make.

rigor's readme: 'It reads everything through the gh CLI, so it inherits your existing authentication and never asks for a token.' That is the right design for a desk tool and the wrong one for a container: the screens runner has no gh auth, and the fixture cannot invent pull requests, because pull requests are GitHub's, not git's.

Three ways it could be shot, in the order I would try them:

1. A read-only GITHUB_TOKEN passed into the container, and the story run against a real repository with real open pull requests — oddurs/poptop has several. The output is then genuine, and the recording ages the way hackney's does. I did not do this: putting a credential into the rig is a decision to take deliberately, not as a side effect of making a screenshot.
2. Record gh's responses once and replay them from a stub gh on PATH. Honest if the capture is real, and it holds still — but it is a small piece of infrastructure to build and maintain.
3. Wait for the macOS runner and shoot it on the desk, where gh is already authenticated.

Until one of those, the page says it has not been photographed.
