# devtools

The tools I build for my own terminal, each one running. A rail of tools on
the left; on the right, the tool: a recording of it at work, its screens, or a
session you can type into.

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
    src/lib/data/captures/         real output a session replays (polkadot's doctor)
    static/media/                  screenshots, casts, other captures
    screens/                       the studio: Dockerfile, runner, one story per tool
    docs/recordings.md             how tools are recorded, and which are done

    src/lib/design/                the system: tokens, base, Badge, Choice, Command, Kbd, AppIcon
    src/lib/terminal/              Window, Screens, Recording, Session; scheme.js, the terminal colours
    src/lib/components/            Rail, ProjectView, Demo, Meta
    src/routes/                    /, /[name], /system, sitemap.xml, robots.txt

`/system` documents the tokens, components, marks and terminal scheme live.

## Tested

The site is pure functions with a page drawn over them, so that is what is
tested: `*.test.ts` beside the module it is about, run in Node.

    src/lib/terminal/cast.test.ts      reading a recording: chapters, the pointer, the keys
    src/lib/terminal/session.test.ts   the session's small shell, and the ANSI it colours with
    src/lib/design/color.test.ts       OKLCH to hex, in gamut, and contrast
    src/lib/data/projects.test.ts      the rail, and what each tool can show
    src/lib/data/screens.test.ts       what the runner wrote, and that every file it names exists
    src/lib/data/site.test.ts          the absolute URLs the head and the sitemap are built from

`screens.json` is read through a cast TypeScript cannot check (JSON has no
tuples). `screens.test.ts` is that cast, checked: a bad run of the runner
fails `npm run verify` rather than the page. GitHub Actions runs the same
gate on every push (`.github/workflows/verify.yml`).

**Adding a tool.** An entry in `src/lib/data/tools.ts`, a mark (icon and
tint) in `src/lib/design/identity.ts`, and, when it can run in Linux, a story
in `screens/manifest.mjs`, then `npm run screens -- <name>`.

## Generated, and committed

    npm run theme      src/lib/terminal/ghostty.json   face, size, padding from ~/.config/ghostty/config
    npm run glyphs     src/lib/assets/term-glyphs.otf  braille and block elements, drawn as Ghostty does
    npm run screens    src/lib/data/screens.json, static/media/{screens,casts}

Committed, so a build needs neither Docker nor this machine's Ghostty config.

## The three views

**Recording**: the tool running, recorded in the container from a fresh
build and played back in xterm.js in the site's terminal scheme, with the
pointer, keys and time-lapses drawn over it. Its chapters are the screenshot
beats.

**Screens**: the four-beat story (at a glance, getting started, in use, in
depth), taken in the same run.

**Session**: the commands and output from the tool's readme, typed out. It
never invents output: anything not recorded says so. ↵ on an empty line runs
the next step, tab completes, ↑/↓ walk history.

## Keys

`j` / `k` step through tools. In a recording, space plays and pauses and
`←` / `→` move between chapters; in screens, `←` / `→` step. `t` cycles the
views.

## Deploying

`BASE_PATH=/devtools npm run build` for a GitHub Pages project URL. It is the
one knob: the canonical links, the cards a link unfurls into, `sitemap.xml`
and `robots.txt` are all built from it and from `origin` in
`src/lib/data/site.ts`.
