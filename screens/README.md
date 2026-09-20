# screens

Screenshots and recordings of every tool, taken the same way every time, from
the latest source (or a named branch), in a container.

```sh
npm run screens                          # every tool with a story
npm run screens -- quarry                # just this one
npm run screens -- --rebuild-image quarry  # after changing the Dockerfile
```

Output lands in `static/media/screens/<tool>/` (WebP) and
`static/media/casts/<tool>.cast` (asciicast v2), indexed in
`src/lib/data/screens.json`, which the site reads. Nothing is hand-placed.
`docs/recordings.md` has the recording plan and the fan-out table.

## The story

Every tool gets the same four-beat story, so a reader who has seen one knows
how to read the next. A tool may skip a beat, but never reorders them.

| beat    | question it answers     | what the shot shows                                         |
| ------- | ----------------------- | ----------------------------------------------------------- |
| `hero`  | what is this?           | the main screen, full of plausible data                     |
| `start` | how do I begin?         | the first command and what it prints, or the landing screen |
| `use`   | what is it like to use? | mid-task: something selected, filtered, open, running       |
| `depth` | what is it good at?     | the distinctive thing: a detail view, the rewind, the `why` |

Captions are sentences about what you are looking at, not about the tool.
With `record: true`, the whole session is recorded too, and each beat becomes
a chapter at the moment its screenshot was taken.

## How a shot is taken

`screens/manifest.mjs` holds one story per tool: how to fetch and build it
(`ref` for a branch), any fixture, and its steps: typing, keys, mouse clicks,
wheel, waits, time-lapses, shots. The header of that file lists every step.

The terminal is fish under [ttyd](https://github.com/tsl0922/ttyd), its
xterm.js page in headless Chromium, driven by Playwright: real keystrokes,
real mouse reports, waits that read the screen's own text. It is themed in the
site's devtools scheme (`src/lib/terminal/scheme.js`, imported by
`runner/theme.mjs`), with the shell in palette slots, so screenshots,
recordings and the page are one set of colours.

A recording is a tap on the runner's own bridge between ttyd and the browser
(`runner/record.mjs`): the bytes the program wrote, a story clock (hidden
steps take no time, `speed` time-lapses, idle gaps capped), chapter markers,
and a pointer and key track for playback to draw.

## Consistent, fresh, bounded

- Terminal: 1600×1000 CSS px at 2×, JetBrains Mono 20, sized once the font is
  in (125×29 cells). No window chrome: the site frames every screen.
- Each tool is cloned into the cache volume and pulled every run; the index
  records the commit its shots came from.
- Builds use the tool's own recipe with a shared cargo cache. The container
  runs with CPU and memory limits (`SCREENS_CPUS`, `SCREENS_MEMORY`), one tool
  at a time, each step under a timeout. A failure is reported and skipped; its
  previous screens stay.
- `isolate: true` gives a story its own PID namespace, so a process monitor
  sees the fixture's programs and not the rig.
- macOS-only tools (fontina, clackson) are marked `host` and keep
  what they have until there is a macOS runner.
