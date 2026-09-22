# Contributing

This is one person's site about their own tools, so it is not looking for
features. What it is genuinely useful for is the **screens studio** in
`screens/` — a rig that builds a terminal program in a container, drives it
with real keystrokes and real mouse events, and photographs and records what
it actually printed. If you are trying to do that for your own project, take
it.

## What is worth opening an issue about

- The studio failing on something it should handle, or a step kind it should
  have.
- A page that is wrong: a caption that does not match its picture, a version
  that has moved on, a link that does not resolve.
- A bug in the site itself — the player, the gallery, the sound, the keyboard.

Pull requests for any of those are welcome. Pull requests adding tools to the
rail are not: the rail is the tools I actually run.

## Running it

```sh
npm install
npm run dev       # http://localhost:4817
npm run verify    # svelte-check, prettier, eslint, the tests, then a build
```

`npm run verify` is the gate, and CI runs the same one. Everything in it
should pass before you open a pull request.

## The rules the code follows

Two of them do real work, and a change that breaks either will be sent back:

**Nothing is invented.** Every screenshot, every recording and every figure on
the site came out of the tool being shown. Where something cannot be
photographed honestly, the page says so instead. There is no mock data
anywhere and there should not be.

**A caption describes its own picture.** Not what was typed to produce it, and
not what the tool can do in general — what is on the screen above it.

Beyond that: the site is dark, greys carry everything, colour is one tint per
tool and never decoration, and things float or sit on the page rather than
being drawn a border. `/system` documents all of it from the live stylesheet.

## Shooting a tool

One tool per run, in Docker:

```sh
npm run screens -- quarry
```

`screens/manifest.mjs` holds the stories; `docs/recordings.md` explains the
pipeline, the step kinds, the two sources a page's material can come from, and
the traps — including the one where a fixture fills the Docker disk and takes
the daemon with it.
