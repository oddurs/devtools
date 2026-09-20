---
id: 33
title: 'clackson: a story from nothing'
type: page
status: blocked
milestone: wave-3
created: 2026-09-20
updated: 2026-09-20
priority: p0
effort: l
tool: clackson
section: Desk
shows:
- audio
- screens
---

## Where it stands

A story stub with no shots, and the one tool on the site that cannot be
photographed at all.

Today the page carries a typed session. When that goes (0006) it carries
nothing, so this item is part of what gates it.

## What it should show

The keyboard, heard. This page is why 0009 exists: the tool is the sound, and
a screenshot of a silent terminal says nothing. A sample recorded from the
tool itself, with the keys being pressed shown alongside, and more than one if
it has switch profiles worth comparing. Screens still help — the
configuration, whatever it shows while running — but the sample is the page.

## Acceptance criteria

- [ ] A four-beat story in `screens/manifest.mjs`: at a glance, getting started, in use, in depth
- [ ] Four screenshots, shot in the current palette, none of them half empty
- [ ] A sample recorded from the tool itself, and the keys shown alongside it (needs 0009)
- [ ] Captions say what the beat shows, not what was typed
- [ ] `line` and `more` finished, and the state and version true
- [ ] A site link, if the tool has a site of its own

## 2026-09-20

Blocked on two things, and the harder one is not the runner.

The runner: clackson is 'runner: host', macOS-only, so the Linux container skips it.

The sample: the audio view from 0009 is built, validated and waiting — it takes a file and a peaks array and draws the waveform from the numbers. What it cannot do is make the recording. A sample has to be captured from clackson running on a real keyboard on a real Mac, with the keys being pressed noted alongside so the page can show what is being typed while you hear it. Nothing in this container can produce that, and inventing one would break the rule the whole site is built on.

So: record two or three takes on the desk (one per switch profile, if there is more than one), measure the peaks, and the page is a few lines of screens.json away from being finished.
