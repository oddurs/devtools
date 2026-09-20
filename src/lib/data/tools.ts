// Every tool on the site, grouped as the rail shows them. This file is the
// source: edit an entry here. What the screens runner shot of each tool
// (screenshots, a recording) is in screens.json, written by `npm run screens`.
//
// A demo is a terminal session: each step types `cmd`, then prints `out`.
// An `out` is only ever real output, quoted from the tool's readme or
// captured from a run into ./captures.
import polkadotDoctor from './captures/polkadot-doctor.ansi?raw';

export type Step = { cmd: string; out?: string };

export type Media = { src: string; alt: string; width: number; height: number };

export type State =
	| { kind: 'released'; version: string }
	| { kind: 'live' }
	| { kind: 'source'; version?: string }
	// Designed in the open, docs before code: the site says pre-release.
	| { kind: 'design' };

export type Tool = {
	name: string;
	kind: 'terminal' | 'cli' | 'library' | 'desktop' | 'language';
	line: string;
	more: string;
	state: State;
	license: string;
	lang: string;
	install?: string;
	tags: string[];
	// A website about the tool, when that is not the repository.
	site?: string;
	demo: Step[];
	// A capture made elsewhere, shown when the runner has no screens of it.
	recording?: Media;
	poster?: string;
};

export type Section = { label: string; tools: Tool[] };

export const sections: Section[] = [
	{
		label: 'System',
		tools: [
			{
				name: 'poptop',
				kind: 'terminal',
				line: 'A system monitor you can rewind.',
				more: 'Keeps every sample it takes, process table included, so you can scrub back and ask what was eating the box forty seconds ago. No daemon, no config, no logfiles.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'GPL-3.0',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/poptop',
				tags: ['ratatui', 'monitoring'],
				demo: [
					{
						cmd: 'poptop',
						out: ' poptop — PAUSED  -18s · warn 50 · crit 80\nCPU  89.2%   WAIT  26.7%   RUN 1/4   BLOCKED 0   MEM  37.5% █████▒▒░░░░░\n── processes (4) · all root — sort: CPU ───────────────────────────────────\n  CPU%            RSS      S   THR     PID COMMAND\n  88.4 ███▌    512.0M      S     1     824 postgres\n  12.5 ▌        32.0M      S     1    1190 nginx\n   4.2 ▏       148.0M      S     1    2077 node\n   0.1          12.0M      S     1       1 systemd\n\nq quit · ←/→ scrub · b jump · +/- zoom · Space live · ↑/↓ select · s sort'
					}
				]
			},
			{
				name: 'quarry',
				kind: 'terminal',
				line: 'See every server running on this machine, and whose project it came from.',
				more: 'Scans every listening TCP socket, maps it to the owning process, walks up to the git repository it belongs to, and probes each one for health. Grouped by project, with clickable URLs.',
				state: {
					kind: 'released',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'brew install oddurs/tap/quarry',
				tags: ['ports', 'dev servers', 'ratatui'],
				demo: [
					{
						cmd: 'quarry',
						out: ' quarry  21 listening · 8 repos · 1 unhealthy                              updated 2s ago\n─────────────────────────────────────────────────────────────────────────────────────────\n╭ Services ──────────────────────────────╮╭ Detail ──────────────────────────────────────╮\n│ ▾ orchard  chore/monorepo-structure 4 ││ ● ledger-api                                  │\n│  ●  3000 next-server     web  200  5ms ││   node index.ts · web · pid 49019            │\n│  ●  3001 next-server     web  200  3ms ││                                              │\n│ ▾ typeset  main  oddurs/atlas  ✕1  2 ││ ADDRESS                                      │\n│  ●  4320 node serve      web  404  2ms ││   http://localhost:4470  ↗                   │\n│  ●  4330 node astro.mjs  web  500  3ms ││ ...                                          │\n╰────────────────────────────────────────╯╰──────────────────────────────────────────────╯\n ↑↓ move  ↵ open  y copy  / filter  a all  K stop  r refresh  ? help'
					}
				]
			},
			{
				name: 'andy',
				kind: 'terminal',
				line: 'Where developer tooling hides your disk space.',
				more: 'Container disk images, package caches, language toolchains, Xcode leftovers, simulator disks, model weights and every target directory you have ever built — found, measured, ranked, and each with the command that would reclaim it. It never deletes anything: running the command is your decision. One file of Python, no dependencies. macOS.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Python',
				install:
					'curl -o /usr/local/bin/andy https://raw.githubusercontent.com/oddurs/andy/main/andy && chmod +x /usr/local/bin/andy',
				tags: ['disk', 'caches', 'macos'],
				demo: [
					{ cmd: 'andy                  # the ranked summary' },
					{ cmd: 'andy -i               # browse it interactively' },
					{ cmd: 'andy --commands       # what would reclaim each one, as a script' },
					{ cmd: 'andy --json           # the same, for a dashboard' }
				]
			},
			{
				name: 'yoghurt',
				kind: 'terminal',
				line: 'See what is installed on this machine, and where it came from.',
				more: 'Homebrew formulae and casks, cargo binaries, rustup toolchains and the rest, in one inventory that explains why each thing is there.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/yoghurt',
				tags: ['homebrew', 'inventory', 'macos'],
				demo: [
					{
						cmd: 'yoghurt',
						out: ' yoghurt  weezer   313 packages · 9 sources · 43G                          scanned just now\n 171 wanted   132 pulled in   44 outdated   0 unexplained   3 broken   10 system\n─ by role · size↓ ──────────────────────────────────────────────────────────────────────────\n ▾ wanted                                                                         171  35G\n  ● iMovie                                                             -    wanted    4.0G\n  ● Docker                                                        4.61.0    wanted    2.4G\n  ● stable-aarch64-apple-darwin                                        -    wanted    2.2G\n  ● Visual Studio Code                                           1.137.0    wanted    1.4G\n ↑↓ move  space fold  g group  s sort  / find  ! facet  ↵ detail  r rescan  q quit'
					}
				]
			}
		]
	},
	{
		label: 'Code',
		tools: [
			{
				name: 'caligula',
				kind: 'terminal',
				line: 'A terminal browser for git worktrees.',
				more: 'Finds every checkout on the machine, groups them by repository, and answers the question that matters before you delete one: is there anything in here worth saving?',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/caligula',
				tags: ['git', 'worktree', 'ratatui'],
				demo: [
					{
						cmd: 'caligula',
						out: ' caligula  92 repos · 189 worktrees (97 linked) · 82 dirty · 100 stale · 48 safe to remove\n╭ sort activity · lens all ────────────────────────────────╮╭──────────────────────────────────────────────╮\n│ ▾ quarry                                          21wt   ││ refactor/site-tailwind  recent · 4d           │\n│ │ ◆ main                                             1h  ││ ~/Code/.worktrees/quarry/refactor/site       │\n│ │ ● feat/responsive-layout                          47m  ││                                              │\n│ │ ● fix/0049-classify-containers                     1h  ││ ┃ 3 uncommitted files, 2 unpushed commits     │\n│ │ ● refactor/site-tailwind           ↑2 ~3           4d  ││                                              │\n│ ▾ deepwork                                     45wt 46●  ││ branch    refactor/site-tailwind  → origin…   │\n│ │ ● worktree-agent-a849ea46      ↓124 ~24         170d  ││ head      281245d0  refactor(site): replace…  │\n╰──────────────────────────────────────────────────────────╯╰──────────────────────────────────────────────╯\n j/k move  space mark  ←/→ fold  d remove  D +branch  p prune  c shell  f lens  s sort  / find  ? help'
					}
				]
			},
			{
				name: 'rigor',
				kind: 'terminal',
				line: 'A terminal dashboard for the pull requests you have out on a repo.',
				more: 'Run it inside a checkout: what is ready to merge, what is blocked, and which of your worktrees can be thrown away. Then it hands you to the browser to merge.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/rigor',
				tags: ['github', 'pull requests', 'ci'],
				demo: [
					{
						cmd: 'cd ~/src/some-repo'
					},
					{
						cmd: 'rigor'
					},
					{
						cmd: 'rigor --init-config   # writes a commented ~/.config/rigor/config.toml'
					}
				]
			},
			{
				name: 'brainiac',
				kind: 'cli',
				line: 'Ranked, token-budgeted context for your repositories.',
				more: 'Ask a question of a repo and get a reference-ranked map plus the code most likely to matter, sized to a token budget. A CLI, a TUI browser and an MCP server in one binary.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/brainiac --locked',
				tags: ['llm context', 'mcp', 'search'],
				demo: [
					{
						cmd: 'brainiac index                       # build or refresh the index'
					},
					{
						cmd: 'brainiac search "how does auth work" # ranked file:line spans'
					},
					{
						cmd: 'brainiac pack "add a retry to the client" -b 8000 | pbcopy'
					},
					{
						cmd: 'brainiac mcp                         # serve to an agent over stdio'
					}
				]
			},
			{
				name: 'jerk',
				kind: 'terminal',
				line: 'Which of these projects is actually alive, complete, and effective?',
				more: 'A terminal dashboard for a projects directory. It scans every local Git repository at once, then fills in GitHub and deployment data in the background: momentum, readiness, pull requests and releases, whether the site is up, the Cairn roadmap, and a transparent 100-point score built from all of it.',
				state: {
					kind: 'source'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --locked --git https://github.com/oddurs/jerk',
				tags: ['portfolio', 'git', 'github', 'ratatui'],
				demo: [
					{
						cmd: 'jerk ~/Code          # every repository in it, scored'
					},
					{
						cmd: 'jerk .               # just this one, in depth'
					},
					{
						cmd: 'jerk ~/Code --plain  # the same, as plain text'
					},
					{
						cmd: 'jerk ~/Code --json   # and as JSON'
					}
				]
			},
			{
				name: 'nun',
				kind: 'terminal',
				line: 'A mouse-first terminal code editor.',
				more: 'Borrows its colours from the terminal it is running in and ships with one config file you will mostly never open. Early; built one milestone at a time.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/nun',
				tags: ['editor'],
				demo: [
					{
						cmd: 'nun <file>         # open it, edit it, save it'
					},
					{
						cmd: 'nun config         # print the effective configuration and where each value came from'
					},
					{
						cmd: 'nun theme dump     # probe this terminal and print the derived ramp as TOML'
					}
				]
			}
		]
	},
	{
		label: 'Roadmap',
		tools: [
			{
				name: 'cairn',
				kind: 'cli',
				line: 'A roadmap and issue manager that lives in your repository.',
				more: 'Every item is a Markdown file with YAML frontmatter, under a schema you define in cairn.toml. Versioned with the code, reviewable in a pull request, and exposed to agents over MCP.',
				state: {
					kind: 'released',
					version: '0.2.1'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'curl -fsSL https://raw.githubusercontent.com/oddurs/cairn/main/install.sh | sh',
				tags: ['issues', 'markdown', 'mcp'],
				demo: [
					{
						cmd: 'cairn init                                    # writes cairn.toml + cairn/items/'
					},
					{
						cmd: 'cairn new "Support OAuth login" --type feature --milestone v0.1 --set priority=p0 --label auth'
					},
					{
						cmd: 'cairn set 1 status=doing'
					},
					{
						cmd: 'cairn render                                  # regenerates ROADMAP.md'
					},
					{
						cmd: 'cairn check                                   # validates everything'
					}
				],
				recording: {
					src: '/media/demos/cairn.svg',
					alt: 'cairn: creating, claiming and closing items, then the board and roadmap',
					width: 760,
					height: 906
				}
			},
			{
				name: 'harrow',
				kind: 'terminal',
				line: 'Work a cairn backlog from the terminal.',
				more: 'Reading cairn items one at a time is fine; deciding what forty of them are worth is not. A backlog by milestone with claim, status and close on single keys.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'brew install oddurs/tap/harrow',
				tags: ['cairn', 'backlog', 'ratatui'],
				demo: [
					{
						cmd: 'harrow',
						out: ' harrow  harrow  7 items · 7 ready                                       updated just now\n──────────────────────────────────────────────────────────────────────────────────────────\n╭ Backlog · by milestone ──────────────────────────╮╭ 0018 feature ──────────────────────╮\n│ ▾ v0.2  Triage that scales pa…▱▱▱▱▱▱▱▱   0%    5 ││ ○ Multi-select, for triage that is │\n│  ○ 0018 + Multi-select, for triage that … 0/3 p1 ││ actually bulk                      │\n│  ○ 0021 ~ Package it: crates.io and a tap 0/3 p1 ││   backlog · v0.2                   │\n│  ○ 0017 + Watch the directory instead of… 0/3 p2 ││ ACCEPTANCE                         │\n│  ○ 0019 + Show what changed, from the re… 0/2 p2 ││   0 of 3 ticked                    │\n│  ○ 0020 + Answer proposals without leavi… 0/2 p2 ││                                    │\n│ ▾ later  Someday              ▱▱▱▱▱▱▱▱   0%    2 ││ FIELDS                             │\n│  ○ 0022 ? How much Markdown is worth renderi… p2 ││   priority p1                      │\n│  ○ 0015 + Every cairn project on this ma… 0/1 p3 ││   area     chrome                  │\n╰──────────────────────────────────────────────────╯╰────────────────────────────────────╯\n ↑↓ move  ↵ read  c claim  s status  x close  / filter  tab board  ? help'
					}
				]
			}
		]
	},
	{
		label: 'Reading',
		tools: [
			{
				name: 'trafford',
				kind: 'terminal',
				line: 'A terminal knowledge base.',
				more: 'An Obsidian-shaped vault of plain markdown with wikilinks, backlinks and tags, a modal editor, git in the status bar, and an assistant that reads your notes before it answers.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/trafford',
				tags: ['notes', 'markdown', 'zettelkasten'],
				demo: [
					{
						cmd: 'trafford init ~/vault    # starter notes, config, and a git repo'
					},
					{
						cmd: 'trafford ~/vault',
						out: '╭ vault ─────────────────────╮╭ How linking works.md ● ────────────────────────╮╭ context ─────────────────────╮\n│2 notes · 152 words         ││  4 # How linking works                         ││OUTLINE                       │\n│▌How linking works          ││  5                                             ││How linking works             │\n│ Welcome                    ││  6 Write `[[Note name]]` anywhere and trafford  ││                              │\n│                            ││  7 resolves it against the vault.              ││LINKS OUT · 1                 │\n│                            ││  8                                             ││  → Welcome                   │\n│                            ││  9 Back to [[Welcome]].                        ││BACKLINKS · 1                 │\n╰────────────────────────────╯╰────────────────────────────────────────────────╯╰──────────────────────────────╯\n NORMAL   ⎇ main  ●3  ↑1   2 notes                                                          66 words  9:24'
					}
				]
			},
			{
				name: 'hackney',
				kind: 'terminal',
				line: 'Hacker News in the terminal.',
				more: 'A fast two-pane reader: the story list stays on the left, the thread you are on fills the right. Keyboard-driven, happy with the mouse, dressed in your terminal’s own colours.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'brew install oddurs/tap/hackney',
				tags: ['hacker news', 'reader'],
				demo: [
					{
						cmd: 'brew install oddurs/tap/hackney'
					},
					{
						cmd: 'hackney'
					}
				],
				recording: {
					src: '/media/demos/hackney.gif',
					alt: 'hackney: browsing the front page and opening a comment thread',
					width: 1280,
					height: 720
				}
			},
			{
				name: 'rsst',
				kind: 'terminal',
				line: 'A terminal RSS and Atom feed reader.',
				more: 'Feeds, entries and the selected entry in three panes, rendered as a document with code blocks kept verbatim and links numbered against a reference list.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/rsst',
				tags: ['rss', 'atom', 'ratatui'],
				demo: [
					{
						cmd: 'rsst import subs.opml       # merge an OPML list into your config'
					},
					{
						cmd: 'rsst                        # read your feeds'
					},
					{
						cmd: 'rsst export > subs.opml     # write your feeds out as OPML'
					}
				],
				recording: {
					src: '/media/demos/rsst.svg',
					alt: 'rsst: feeds, entries and a rendered entry in three panes',
					width: 874,
					height: 468
				}
			},
			{
				name: 'brevity',
				kind: 'cli',
				line: 'Summarize whatever is on your clipboard.',
				more: 'Copy something long, press a key, and a chime tells you the summary has replaced it. No window, no output. Anthropic, OpenAI, Gemini, Groq and friends, or a model on your own machine.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT/Apache-2.0',
				lang: 'Rust',
				install: 'git clone https://github.com/oddurs/brevity && cd brevity && ./install.sh',
				tags: ['clipboard', 'llm', 'hotkey'],
				demo: [
					{
						cmd: 'brevity                 # summarize the clipboard, chime, replace it'
					},
					{
						cmd: 'brevity --style bullets'
					},
					{
						cmd: 'git log | brevity --stdin -p'
					},
					{
						cmd: 'brevity --restore       # put the replaced text back'
					}
				]
			}
		]
	},
	{
		label: 'Desk',
		tools: [
			{
				name: 'polkadot',
				kind: 'cli',
				line: 'A Mac, the way I like it.',
				more: 'One Go binary that takes a machine with nothing on it but the Xcode command line tools and turns it into a working one: Homebrew, the Brewfile, dotfiles as symlinks, fish and starship, the coding agents, and the colour scheme. It never writes macOS defaults, and never deletes a config it did not write.',
				state: {
					kind: 'source'
				},
				license: 'none',
				lang: 'Go',
				install:
					'git clone git@github.com:oddurs/polkadot.git ~/Code/polkadot && cd ~/Code/polkadot && go run . install',
				tags: ['dotfiles', 'setup', 'macos'],
				demo: [
					{
						cmd: 'polkadot doctor     # report what is and isn’t in place, change nothing',
						out: polkadotDoctor
					},
					{
						cmd: 'polkadot install --dry-run   # print the plan without writing anything'
					},
					{
						cmd: 'polkadot theme      # the colour scheme only'
					}
				]
			},
			{
				name: 'knit',
				kind: 'cli',
				line: 'Share compute across your machines, with zero config.',
				more: 'One static binary. Run knit up on each machine and it becomes discoverable capacity; knit run puts a command on whichever machine has the most headroom, with stdin, stdout, stderr and the exit code behaving as if it ran locally. No IPs, no config files, no accounts, no server.',
				state: {
					kind: 'released',
					version: '0.4.1'
				},
				license: 'MIT',
				lang: 'Go',
				install: 'brew install oddurs/tap/knit',
				tags: ['distributed', 'mdns', 'compute'],
				demo: [
					{
						cmd: 'knit up -d            # start sharing this machine, in the background'
					},
					{
						cmd: 'knit run -- ffmpeg -i big.mov out.mp4',
						out: 'knit → studio'
					},
					{
						cmd: 'knit gauge            # see machines and their capacity'
					},
					{
						cmd: 'knit each -- uname -a # run everywhere at once'
					}
				]
			},
			{
				name: 'fontina',
				kind: 'desktop',
				line: 'A lightweight, cross-platform font manager.',
				more: 'Rust core, thin native shell, open standards end to end. Parses TTF, OTF, TTC, WOFF and WOFF2 into a searchable index with tags and collections, and activates and installs fonts.',
				state: {
					kind: 'released',
					version: '0.2.0'
				},
				license: 'GPL-3.0',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/fontina fontina-cli',
				tags: ['fonts', 'tauri', 'opentype'],
				demo: [
					{
						cmd: 'fontina scan --system            # index the OS font directories'
					},
					{
						cmd: 'fontina list --script Arab       # faces that cover Arabic'
					},
					{
						cmd: 'fontina covers "Þórður át 12 blóðbergsbrauð"   # faces that can set this text'
					},
					{
						cmd: 'fontina activate family:Amiri    # visible to every app, in place, per user'
					}
				]
			},
			{
				name: 'clackson',
				kind: 'cli',
				line: 'Mechanical keyboard sound for the keyboard you already have.',
				more: 'One command, no config, no sample files: every click is synthesized as the key goes down, so it never loops audibly the way sample-based clickers do. macOS.',
				state: {
					kind: 'source'
				},
				license: 'MIT',
				lang: 'Swift',
				install:
					'git clone https://github.com/oddurs/clackson && cd clackson && make install PREFIX=$HOME/.local',
				tags: ['audio', 'synthesis', 'macos'],
				demo: [
					{
						cmd: 'clackson -p typewriter --demo'
					},
					{
						cmd: 'clackson -p brown &'
					}
				]
			},
			{
				name: 'gummyworm',
				kind: 'cli',
				line: 'Turn images into ASCII art.',
				more: 'A playful command-line tool with 256-colour and true-colour output, a dozen palettes from plain to braille and emoji, animated GIFs, and export to HTML, SVG, PNG and GIF. Bash 3.2 or zsh, and ImageMagick.',
				state: {
					kind: 'released',
					version: '2.1.0'
				},
				license: 'MIT',
				lang: 'Shell',
				install: 'brew tap oddurs/gummyworm && brew install gummyworm',
				tags: ['ascii art', 'images', 'imagemagick'],
				demo: [
					{
						cmd: 'gummyworm -c sunset.png            # with colour'
					},
					{
						cmd: 'gummyworm -p blocks portrait.png   # block characters'
					},
					{
						cmd: 'gummyworm -c -f gif -o ascii-anim.gif animation.gif'
					},
					{
						cmd: 'gummyworm --list-palettes'
					}
				]
			}
		]
	},
	{
		label: 'Science',
		tools: [
			{
				name: 'starward',
				kind: 'cli',
				line: 'An astronomy toolkit that shows its work.',
				more: 'Sun and Moon positions, rise and set, twilight, phases, coordinate transforms and Julian dates. Every calculation can print every step it took, which turns an opaque number into something you can follow. Pure Python, nothing compiled.',
				state: { kind: 'released', version: '0.4.1' },
				license: 'MIT',
				lang: 'Python',
				install: 'pip install starward',
				tags: ['astronomy', 'ephemeris', 'teaching'],
				site: 'https://starward.dev',
				demo: [
					{ cmd: 'starward time now                      # the astronomical clocks, right now' },
					{ cmd: 'starward sun rise --lat 51.5 --lon -0.1' },
					{ cmd: 'starward moon phase' },
					{
						cmd: 'starward --verbose angle sep "10h00m +45d" "10h30m +46d"   # every step of it'
					}
				]
			},
			{
				name: 'tsi',
				kind: 'cli',
				line: 'Rocket staging, worked out.',
				more: 'Finds the engine configuration and propellant split that reaches a delta-v target, from a database of eleven real engines, with Monte Carlo uncertainty analysis and the rocket drawn in ASCII. Named for Tsiolkovsky, whose equation it solves.',
				state: { kind: 'released', version: '0.6.0' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/tsi',
				tags: ['orbital mechanics', 'monte carlo'],
				demo: [
					{
						cmd: 'tsi calculate --engine raptor-2 --propellant-mass 100000',
						out: 'Engine:     Raptor-2\nPropellant: 100,000 kg (LOX/CH4)\nDry mass:   11,600 kg\nΔv:         7,771 m/s\nBurn time:  2m 20s\nTWR (vac):  2.24'
					},
					{
						cmd: 'tsi engines --propellant methane',
						out: 'NAME             PROPELLANT    THRUST(vac)   ISP(vac)       MASS\n--------------------------------------------------------------\nRaptor-2         LOX/CH4           2,450 kN      350s      1,600 kg\nRaptor-Vacuum    LOX/CH4           2,550 kN      380s      1,600 kg\nBE-4             LOX/CH4           2,600 kN      340s      2,000 kg'
					},
					{ cmd: 'tsi optimize --payload 5000 --target-dv 9400 --engine raptor-2' }
				]
			}
		]
	},
	{
		label: 'Web',
		tools: [
			{
				name: 'turborust',
				kind: 'cli',
				line: 'A dev orchestrator for full-Rust stacks.',
				more: 'One binary, one config file: supervises your services, watches the right files, caches builds, and tells you exactly why anything re-ran. Orchestrates cargo, trunk, cargo leptos and dx; replaces none of them.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT/Apache-2.0',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/turborust',
				tags: ['build', 'watch', 'monorepo'],
				demo: [
					{
						cmd: 'turborust why check',
						out: '\n  check\n  inputs derived from crate `api` and its path deps: api, shared\n  5 input files, key b3:614d4a52304e\n\n  cache MISS — b3:9068e57b411c → b3:614d4a52304e\n\n      ~ crates/shared/src/lib.rs  b3:5f16c070 -> b3:d33db911'
					}
				]
			},
			{
				name: 'triblenka',
				kind: 'library',
				line: 'An Astro-shaped web framework for Rust.',
				more: 'Server-first HTML, zero JavaScript by default, islands of interactivity, typed content collections, and a single static binary at the end. Design stage: the docs come first so the API can be criticised before it is coded.',
				state: {
					kind: 'design'
				},
				license: 'MIT/Apache-2.0',
				lang: 'Rust',
				tags: ['web framework', 'islands'],
				demo: [
					{
						cmd: 'cat src/pages/index.tri',
						out: '---\nuse triblenka::prelude::*;\nlet posts = content::blog().published().take(5);\n---\n\n<Layout title="Home">\n  {#for post in posts}\n    <article>\n      <h2><a href={route!(blog::post(&post.slug))}>{ post.title }</a></h2>\n      <p>{ post.description }</p>\n    </article>\n  {/for}\n\n  <Newsletter client:visible />\n</Layout>'
					}
				]
			}
		]
	}
];
