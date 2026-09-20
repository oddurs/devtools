# Recordings

How the tools are demoed: real sessions, recorded as text in the screens
container (`screens/`) and played back in a real terminal renderer, in the
site's terminal scheme. One tool at a time.

## Why this and not the alternatives

|                      | motion  | sharp at any size | selectable | theme applied at playback | size                                                                            |
| -------------------- | ------- | ----------------- | ---------- | ------------------------- | ------------------------------------------------------------------------------- |
| screenshots          | no      | at one size       | no         | no, baked in              | ~100 KB each                                                                    |
| GIF / video          | yes     | no                | no         | no, baked in              | MBs                                                                             |
| live web demo        | yes     | yes               | yes        | yes                       | needs a real machine behind it: poptop needs a process table, quarry real ports |
| **recorded session** | **yes** | **yes**           | **yes**    | **yes**                   | **tens of KB**                                                                  |

A page shows the recording and the four screens. Two more exist for tools
those cannot carry:

| view        | for                                 | what it is                                                        |
| ----------- | ----------------------------------- | ----------------------------------------------------------------- |
| **gallery** | a tool whose output is the argument | `plate` steps: terminal screenshots, trimmed, read across at once |
| **sound**   | a tool you hear                     | a file plus levels measured off it; the page draws the waveform   |

There used to be a third view, a shell you could type into that replayed a
tool's readme. It is gone: two views and, where they do not reach, a gallery
or a sample.

A recording is an [asciicast v2](https://docs.asciinema.org/manual/asciicast/v2/)
file: the exact bytes the program wrote, with timestamps. Nothing is invented.
The screenshots stay as posters and as the first frame.

## Two sources, the same shapes

The studio is a Linux container, and four of these tools only run on a Mac.
That is a question of **where the material comes from**, not of what shape it
is — so there is no fifth kind of view for them. A story says
`source: 'desk'`, and the entry in `screens.json` is stamped `runner: 'desk'`
instead of `terminal`. The page then discloses it where it otherwise says the
build, and the data refuses to claim a commit, because a desk capture was
taken from whatever was on that machine rather than from a checkout built
here. `screens.test.ts` enforces that.

The shapes do not change:

- **A recording**: `asciinema rec` on the Mac writes asciicast v2, which is
  what `Recording.svelte` already plays. The runner's pointer and key tracks
  are optional (`x_devtools ?? {}`), so a desk cast plays without the overlay
  and needs no code.
- **Screens**: commit the captured output under `src/lib/data/captures/`, and
  let the story print it into the container's terminal and photograph it. The
  bytes are the ones the tool wrote; only the terminal around them is the
  studio's, which is the same thing that is true of every other screenshot
  here.

polkadot is the worked example. The one trick worth knowing: run it as
`{ run: 'clear; cat report.ansi' }`, not as a `hidden` step. `clear` in the
same command wipes the line that was just typed along with the screen, so the
shot is the report and nothing else — whereas `hidden` appends its own
`clear` _after_ the command and throws the output away.

## Pipeline

```
screens/manifest.mjs            the story: fixture, steps, beats, captions   (record: true to opt in)
        │
        ▼  npm run screens -- quarry          (one tool per run, in the container)
screens/runner/run.mjs           builds it, types, clicks, waits; taps the ttyd socket
        │
        ├─ static/media/screens/quarry/*.webp    the four beats
        ├─ static/media/casts/quarry.cast        the whole session
        └─ src/lib/data/screens.json             index: shots, cast, commit, background
        │
        ▼
src/lib/terminal/Recording.svelte                xterm.js, the site's scheme, chapters = beats
```

When a shot fails (the screen shows a shell error, say), the runner keeps it
in `screens/failed/`: the screen as a PNG, and the session up to it as a cast.

### Recording (screens/runner)

- **The tap.** The runner already relays every frame between ttyd and the
  browser's xterm.js through its own WebSocket bridge. Recording is a listener
  on that bridge: server frames tagged `0` are output, client frames carry the
  terminal size. No new binary, no image rebuild.
- **The clock.** Time starts at the first step. Everything before (fish
  starting, the page settling on its size) is dropped, and fish repaints with
  Ctrl+L, so the cast opens on a clean screen. `hidden` steps take no time. Idle gaps are
  capped at 2 s. A `{ speed: 8 }` step time-lapses what follows until
  `{ speed: 1 }`, and the player says so on screen while it lasts, so a
  forty-second wait for history to accumulate plays in five.
- **Chapters.** Every `shot` step drops a marker named for its beat, at the
  moment of the screenshot. So a chapter in the player is exactly the
  screenshot, and the captions carry over.
- **Typing** is slower when recording (45 ms a key), so it reads as a person.

### Mouse (mouse-first TUIs: nun, hackney, trafford)

New steps, for screenshots and recordings alike:

```js
{ click: 'text on screen' }            // the centre of its second cell: inside the word
{ click: { row: 3, col: 10 } }         // or a cell, 0-based
{ click: 'x', button: 'right' }
{ hover: 'text' }                      // move without pressing
{ scroll: 3, at: 'text' }              // wheel, positive is down
{ drag: 'from text', to: 'to text' }
```

They go through xterm.js, so the program receives real mouse escape sequences
(only if it turned mouse reporting on, exactly as in Ghostty). A recording
holds only what the program printed, so the runner also writes a pointer track
(cell, action, time) and a key track (`← ×6`, `q`) into the cast header, under
`x_devtools`. The player draws the pointer, a ring on each click, and the keys
as they are pressed. Without that, a mouse-driven demo is things changing for
no visible reason.

### Braille

JetBrains Mono draws every unraised braille dot as a hollow ring, so a braille
graph (poptop's timeline) becomes a field of circles in a browser, which it
never is in Ghostty: Ghostty draws braille itself. `npm run glyphs` writes a
font of raised dots only, on JetBrains Mono's cell, plus the 32 block elements
filling the whole (taller) cell, and the terminal font stack puts it first for
those ranges only. The block elements fix poptop's half-block scrub cursor,
which otherwise stops short of the cell and reads as a `[`.

### Size

The runner waits for the font before fitting the terminal, then for the size
to hold: fitting against the fallback font gave 35 rows one run and 29 the
next. Recordings are 125×29.

### Colour

The cast holds the program's own escape codes. Default foreground and
background, and anything a program leaves to the sixteen ANSI slots, come from
the site's terminal scheme at playback: `devtools` (the site palette; see
/system) or the Ghostty colours, switched in `src/lib/terminal/theme.ts`. A program that picks exact colours (poptop in
true colour) keeps them, which is what it looks like in Ghostty too.

### Playback (here)

- `@xterm/xterm`, loaded only when a recording is on screen.
- Sized to the cast's columns and rows; the font scales to the window.
- Controls: play/pause, a scrub rail with a tick per chapter, the beats as
  buttons (the same four as the screens), 1× / 2×.
- Starts when scrolled into view; never under `prefers-reduced-motion`.
- Keys: space plays and pauses, ← / → move between chapters.

## Fan-out

One tool per run: write or deepen its story in `screens/manifest.mjs`, add
`record: true`, run `npm run screens -- <name>`, watch it on its page, tick it
off. Screens from before the move (taken under rustybutt's palette, marked
with that background in `screens.json`) are retaken as each tool comes up.

| project                           | story         | recorded                             | mouse             | notes                                                                                                                                                                                                                                     |
| --------------------------------- | ------------- | ------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| poptop                            | ✓             | ✓ 2026-09-18, feat/tab-strip ae889b0 | clicks, wheel     | 63 s: typed start, time-lapse, menus by key and mouse, tabs, filter, inspector, tree, sort, rewind                                                                                                                                        |
| quarry                            | ✓             | ✓ 2026-09-19, feat/0046-degraded     | clicks, wheel     | 47 s: five repos of real services (Vite ×2, Redis, nginx, docs, a 500, a stray in /tmp); help, next trouble, filter, group by, stop with confirm, `quarry why`                                                                            |
| caligula                          | ✓             |                                      |                   |                                                                                                                                                                                                                                           |
| harrow                            | ✓             |                                      |                   |                                                                                                                                                                                                                                           |
| cairn                             | ✓             |                                      |                   | CLI: several short commands                                                                                                                                                                                                               |
| brainiac                          | ✓             |                                      |                   |                                                                                                                                                                                                                                           |
| nun                               | ✓             |                                      | **mouse-first**   | first real test of the pointer track                                                                                                                                                                                                      |
| jerk                              | needs a story |                                      |                   | local entry for now; its fixture must not be ~/Code (private repos)                                                                                                                                                                       |
| hackney                           | ✓             | ✓ 2026-09-19, main                   | click, wheel      | 43 s on the live front page: the list and its thread, help, reading and folding threads, feeds, search, `z` full width. Nothing seeded — it reads the public API, so every run is that day's news                                         |
| rsst                              | ✓             |                                      |                   | feeds need a fixture                                                                                                                                                                                                                      |
| trafford                          | ✓             |                                      | modal, some mouse |                                                                                                                                                                                                                                           |
| rigor                             | needs a story |                                      |                   | needs a GitHub fixture                                                                                                                                                                                                                    |
| yoghurt                           | ✓             | ✓ 2026-09-19, main                   | clicks            | 36 s, as user `dev` on a seeded machine (screens/Dockerfile): 16 formulae + deps, neovim's orphans, rustup with two toolchains, cargo crates, npm globals, a hand-downloaded yq; by source, by role, why pcre2 (bat), the six unexplained |
| tsi                               | ✓             | ✓ 2026-09-19, main                   |                   | 43 s in a 46-row terminal (it prints tall): staging optimisation, the engine table, one stage, Monte Carlo                                                                                                                                |
| starward                          | ✓             | ✓ 2026-09-19, master                 |                   | 23 s: the astronomical clocks, sunrise, the Moon, and a Julian date converted step by step                                                                                                                                                |
| gummyworm                         | ✓             | ✓ 2026-09-19, main                   |                   | 25 s: ImageMagick's own wizard drawn in characters, in colour, in blocks, and every palette it knows                                                                                                                                      |
| jerk                              | ✓             | ✓ 2026-09-20, main                   |                   | 22 s: six repositories built with twelve weeks of backdated history, one mature, two moving, one young, one stale at seven months, one abandoned at a year. Overview, git, portfolio                                                      |
| andy, polkadot, fontina, clackson | —             |                                      |                   | **macOS only.** `runner: 'host'`, so the Linux container skips them. Waiting on a macOS runner; clackson additionally needs a real audio take                                                                                             |
| knit                              | —             |                                      |                   | needs more than one machine; a single node always schedules to itself                                                                                                                                                                     |
| brevity                           | —             |                                      |                   | has no interface at all — a clipboard, a key and a chime. A gallery of one real before/after is the shape, and it needs a model key                                                                                                       |
| rigor                             | needs a story |                                      |                   | needs a GitHub fixture with real pull requests                                                                                                                                                                                            |
| turborust                         | needs a story |                                      |                   | needs a multi-service Rust workspace to orchestrate                                                                                                                                                                                       |
| triblenka                         | —             |                                      |                   | design stage: nothing is implemented, so there is nothing to record                                                                                                                                                                       |

## Known

- **Drags don't reach poptop.** A `drag` step moves the pointer with the
  button held, but poptop saw no motion: the rewind uses a click on the graph
  and the wheel instead. Worth checking against nun, which may rely on drags.
- **Clicks on labels do nothing.** poptop's `past … now` row is a label under
  the graph, not the timeline; target the graph rows.
- **quarry's `K` asks first.** Stop opens a confirmation; answer it (`y`) or
  the next key goes to the dialog.
- **Give a TUI time to leave.** A key typed while a program restores the
  terminal on exit is swallowed: wait before the next command.
- **Never press `a` in quarry's story.** "All" includes system services, which
  includes the rig: ttyd's socket and Chromium's.
- **quarry files a JSON API as `system`.** A Node server answering JSON 200s
  on :3000 was classified `system` (open socket, no HTTP) and hidden by
  default. The fixture leaves it out rather than stage around it; worth an
  issue on quarry. In the same probe, `-p` named nginx "OpenResty".
- **Seeds that need a real machine go in the image.** Homebrew on Linux lives
  only at `/home/linuxbrew/.linuxbrew` and refuses root, so yoghurt's machine
  is a final layer of the Dockerfile and its story runs as `dev` (`user:` in a
  story). Its PATH leaves out `/usr/local/bin`, where the rig keeps ttyd; the
  runner calls its own programs by absolute path so a story's PATH can't break
  it.
- **Homebrew autoremoves on uninstall now.** The seed sets
  `HOMEBREW_NO_AUTOREMOVE=1` for neovim's uninstall, which is how orphans
  happen on real machines.
- **yoghurt lists rustup's `shims` as a wanted toolchain** (265 MB) on a
  standard Linux rustup layout. Worth a look on yoghurt's side.
- **Wait on the tool's own chrome, not its content.** hackney's first wait was
  for the word `points`, which it never prints (votes are `▲ 88`), and the
  headlines change hourly: `Top stories` is what stays put.
- **Any failed step keeps its screen.** `screens/failed/<tool>-step<N>.png`,
  plus the cast so far, and the error names the step. That is how the wait
  above was found.
- **A story can set its terminal's size.** `terminal: { height: 1500 }` gives a
  command-line tool that prints forty lines a terminal that fits them. Pick it
  for the longest output the story shows, and let the short commands stack up
  the screen rather than clearing between them, so no shot is half empty.
- **Fixtures can make their own image.** gummyworm converts ImageMagick's
  `logo:` (its wizard), which survives being drawn in characters; its `rose:`
  is a 70×46 thumbnail that turns to mush.
