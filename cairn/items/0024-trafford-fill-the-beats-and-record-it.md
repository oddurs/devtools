---
id: 24
title: 'trafford: fill the beats and record it'
type: page
status: done
milestone: wave-2
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
tool: trafford
section: Reading
shows:
- recording
- screens
---

## Where it stands

A story in `screens/manifest.mjs` with screens for hero, start. Missing:
**use, depth**. No recording.

A notebook: modal, with some mouse.

## What is left

Two beats missing, both of them the interesting half — what it is like to
actually write in it, and whatever it does that a text editor does not.

## Acceptance criteria

- [x] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [x] Four screenshots, shot in the current palette, none of them half empty
- [x] `record: true`, and the recording plays clean from a fresh build
- [x] Captions say what the beat shows, not what was typed
- [x] `line` and `more` finished, and the state and version true
- [x] A site link, if the tool has a site of its own

## 2026-09-20

Shot and recorded, 4 beats, 13.8 s cast. use is a click on a wikilink — trafford is clickable throughout, so the mouse is the honest way to show it — and the context pane answers with the outline, 2 links out, 3 backlinks, 1 unwritten and the related notes. depth is ctrl-g, the git panel, which is the claim in the readme's Why: a vault belongs next to git.

The fixture is most of the work. trafford init makes two notes, which is enough to prove it works and not enough to photograph: an empty outline and one backlink. The story now writes a vault somebody has been using — nine notes in three folders, wikilinks between them, tags, one link to a note nobody has written yet, a git history and one uncommitted change so the status bar has something true to say. First take only produced five notes: the filenames have spaces in them and were not quoted, so 'Vault design.md' became a file called Vault.
