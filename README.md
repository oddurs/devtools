# devtools

[![verify](https://github.com/oddurs/devtools/actions/workflows/verify.yml/badge.svg)](https://github.com/oddurs/devtools/actions/workflows/verify.yml)
[![pages](https://github.com/oddurs/devtools/actions/workflows/pages.yml/badge.svg)](https://github.com/oddurs/devtools/actions/workflows/pages.yml)
[![licence: MIT for the code](https://img.shields.io/badge/licence-MIT%20for%20the%20code-blue.svg)](LICENSE)

**[oddurs.github.io/devtools](https://oddurs.github.io/devtools/)**

The tools I build for my own terminal, each one running. A rail of tools on
the left; on the right, the tool: a recording of it at work and its screens —
and, for the ones a terminal cannot carry, a gallery of what it made or a
sample of what it sounds like.

SvelteKit (Svelte 5, runes), TypeScript strict, static output.

```sh
npm install
npm run dev       # http://localhost:4817  (strictPort: fails rather than drifting)
npm run build     # plain HTML in build/
npm run preview   # http://localhost:4818
npm test          # the logic, in Node (vitest); test:watch to leave it running
npm run verify    # svelte-check, prettier, eslint, test, build
npm run screens -- quarry   # shoot and record a tool, in Docker (screens/README.md)
```

## Where things live

    src/lib/data/tools.ts          every tool: its entry, its section; edit here
    src/lib/data/screens.json      what the runner shot of each; written by npm run screens
    src/lib/data/captures/         real output, kept for a page that cannot be shot yet
    static/media/                  screenshots, casts, other captures
    screens/                       the studio: Dockerfile, runner, one story per tool
    docs/recordings.md             how tools are recorded, and which are done

    src/lib/design/                the system: tokens, base, Badge, Choice, Command, Kbd, AppIcon
    src/lib/terminal/              Window, Screens, Recording, Gallery, Sound; scheme.js, the colours
    src/lib/components/            Rail, ProjectView, Demo, Meta
    src/routes/                    /, /[name], /system, sitemap.xml, robots.txt

`/system` documents the tokens, components, marks and terminal scheme live.

## Tested

The site is pure functions with a page drawn over them, so that is what is
tested: `*.test.ts` beside the module it is about, run in Node.

    src/lib/terminal/cast.test.ts      reading a recording: chapters, the pointer, the keys
    src/lib/design/color.test.ts       OKLCH to hex, in gamut, and contrast
    src/lib/data/projects.test.ts      the rail, and what each tool can show
    src/lib/data/screens.test.ts       what the runner wrote, and that every file it names exists
    src/lib/data/site.test.ts          the absolute URLs the head and the sitemap are built from
    screens/manifest.test.ts           the stories: beats, captions, step kinds, heredocs

`screens.json` is read through a cast TypeScript cannot check (JSON has no
tuples). `screens.test.ts` is that cast, checked: a bad run of the runner
fails `npm run verify` rather than the page. `manifest.test.ts` catches the
mistakes that otherwise cost a forty-second container run to find — an
unescaped backtick in a fixture, a beat spelled wrong, a caption nobody
wrote. GitHub Actions runs the same
gate on every push (`.github/workflows/verify.yml`).

**Adding a tool.** An entry in `src/lib/data/tools.ts`, a mark (icon and
tint) in `src/lib/design/identity.ts`, and, when it can run in Linux, a story
in `screens/manifest.mjs`, then `npm run screens -- <name>`.

## What is left

The pages are not finished: seven are shot and recorded, seven have screens
and no recording, and ten have neither. [ROADMAP.md](ROADMAP.md) is the plan
for the rest, kept as [cairn](https://github.com/oddurs/cairn) items in
`cairn/items/` — one per tool, plus the site changes the pages need.

    cairn board                   where every page is
    cairn list --view pages       every tool, by where it stands
    cairn list --view unshot      the ten with nothing to show yet

## Generated, and committed

    npm run theme      src/lib/terminal/ghostty.json   face, size, padding from ~/.config/ghostty/config
    npm run glyphs     src/lib/assets/term-glyphs.otf  braille and block elements, drawn as Ghostty does
    npm run screens    src/lib/data/screens.json, static/media/{screens,casts}

Committed, so a build needs neither Docker nor this machine's Ghostty config.

## The views

**Recording**: the tool running, recorded in the container from a fresh
build and played back in xterm.js in the site's terminal scheme, with the
pointer, keys and time-lapses drawn over it. Its chapters are the screenshot
beats.

**Screens**: the four-beat story (at a glance, getting started, in use, in
depth), taken in the same run.

**Gallery**: for a tool whose output is the argument rather than its
interface — gummyworm draws images, so its page shows a dozen of them at
once rather than stepping through four. A plate is a `plate` step in the
story: the same screenshot as a beat, trimmed to its content.

**Sound**: for a tool you hear rather than see. A sample, a waveform drawn
from levels measured off the file, and nothing that plays until it is asked.

A page with none of these says so plainly rather than stopping after its
paragraph. Nine do today; `src/lib/data/projects.test.ts` names them and why,
and that list should only get shorter.

## Keys

`j` / `k` step through tools. In a recording, space plays and pauses and
`←` / `→` move between chapters; in screens, `←` / `→` step. `t` cycles the
views.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages
(`.github/workflows/pages.yml`), running the same `npm run verify` the desk
does first. By hand:

```sh
BASE_PATH=/devtools npm run build
```

That is the one knob: the canonical links, the cards a link unfurls into,
`sitemap.xml` and `robots.txt` are all built from it and from `origin` in
`src/lib/data/site.ts`.

## Taking any of it

The code is MIT — the site, the design system, and the screens studio in
`screens/`, which is the part most likely to be useful to somebody else: it
builds a terminal program in a container, drives it with real keystrokes and
real mouse events, and photographs and records what it actually printed.

The content is not. The prose, the screenshots, the gallery plates and the
`.cast` recordings are © Oddur Sigurdsson, all rights reserved. Take the
machinery; ask before taking the writing or the pictures.

[`CONTRIBUTING.md`](CONTRIBUTING.md) says what is worth an issue, and the two
rules a change has to keep: nothing is invented, and a caption describes its
own picture.
