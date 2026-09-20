// Every tool on the site, grouped as the rail shows them. This file is the
// source: edit an entry here. What the screens runner shot of each tool
// (screenshots, a recording) is in screens.json, written by `npm run screens`.
//
export type Media = { src: string; alt: string; width: number; height: number };

// One row of the features table: a short claim, and the sentence that makes
// it. Two to four words on the left, one sentence on the right — the table is
// meant to be scanned down the left and read across only where it catches.
// Backticks in `what` are set as code, as they are in a screen's caption.
export type Feature = { claim: string; what: string };

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
	features: Feature[];
	// A website about the tool, when that is not the repository.
	site?: string;
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
				features: [
					{
						claim: 'Every sample kept',
						what: 'Nothing is thrown away as it scrolls past, so the process table forty seconds ago is still there to look at.'
					},
					{
						claim: 'Scrub, do not guess',
						what: 'Click the graph, wheel back, or step sample by sample; the whole screen goes with you, process table included.'
					},
					{
						claim: 'The machine, not a number',
						what: 'CPU, memory and disk over time, with the process table under them and a tree of who started whom.'
					},
					{
						claim: 'Nothing to set up',
						what: 'No daemon, no config file and nothing written to disk — it starts and it is already recording.'
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
				features: [
					{
						claim: 'Every listening port',
						what: 'Reads the sockets from `/proc` on Linux and `lsof` on macOS, so nothing that is running is missed.'
					},
					{
						claim: 'Whose project it is',
						what: 'Walks up from the owning process to the git repository that started it, and groups the list by that.'
					},
					{
						claim: 'Probed, not guessed',
						what: 'Each service is asked what it answers: an HTTP status, TLS, gRPC, or a socket that says nothing at all.'
					},
					{
						claim: 'Show your work',
						what: '`quarry why` prints the evidence behind a classification — what matched, what it scored, and what it lost to.'
					}
				],
				site: 'https://oddurs.github.io/quarry/'
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
				features: [
					{
						claim: 'Every hiding place',
						what: 'Container images, package caches, language toolchains, model weights, simulator disks and every target directory you have ever built.'
					},
					{
						claim: 'Ranked by what it costs',
						what: 'Categories in order of size, then the largest single things inside them, so the first line is the one worth acting on.'
					},
					{
						claim: 'The command, not the deletion',
						what: 'Each item comes with the line that would reclaim it. andy never deletes, moves or modifies anything.'
					},
					{
						claim: 'An area map',
						what: 'Press `m` and every category becomes a rectangle whose size is its share of the total.'
					}
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
				features: [
					{
						claim: 'Every manager at once',
						what: 'Homebrew formulae and casks, cargo binaries, rustup toolchains, npm globals, and the things installed by hand.'
					},
					{
						claim: 'Why it is here',
						what: 'Grouped by what you asked for, what came along with it, and what nothing on the machine needs any more.'
					},
					{
						claim: 'The residue',
						what: 'What an uninstall left behind that no package manager finished clearing, and the command that clears it.'
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
				features: [
					{
						claim: 'Every checkout',
						what: 'Finds the worktrees on the machine and groups them by the repository they hang off.'
					},
					{
						claim: 'What you would lose',
						what: 'Off-base commits, untracked files and work that exists nowhere else, counted before anything is removed.'
					},
					{
						claim: 'One key each',
						what: 'Mark, fold, remove, prune, or drop into a shell in the worktree under the cursor.'
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
				features: [
					{
						claim: 'Ready, and not ready',
						what: 'Green checks and no conflicts on one tab; red CI, requested changes and conflicts on another.'
					},
					{
						claim: 'The checks behind the glyph',
						what: 'Selecting a pull request expands every check run, with what it did and how long it took.'
					},
					{
						claim: 'Worktrees too',
						what: 'Every checkout matched to the pull request it belongs to, and which of them are safe to collect.'
					},
					{
						claim: 'Your own authentication',
						what: 'Reads everything through the GitHub CLI, so it inherits the auth you already have and never asks for a token.'
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
				features: [
					{
						claim: 'Ranked by reference',
						what: 'The repository’s skeleton, ordered by how much the rest of the code points at it.'
					},
					{
						claim: 'Sized to a budget',
						what: 'Ask for four hundred tokens or four thousand and it decides what fits, rather than truncating at the edge.'
					},
					{
						claim: 'Three ways in',
						what: 'A command line, a browser you can walk, and an MCP server — one binary.'
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
				features: [
					{
						claim: 'Every repository at once',
						what: 'Scans the whole directory locally first, then fills in GitHub and deployment data in the background.'
					},
					{
						claim: 'Momentum against readiness',
						what: 'Commits, contributors and twelve weeks of activity, set against readme, licence, CI, tests and packaging.'
					},
					{
						claim: 'One number, shown working',
						what: 'A hundred-point score with every signal that produced it listed beside it.'
					},
					{
						claim: 'The portfolio, not the project',
						what: 'What is alive, what has gone stale, and what nothing has touched in a year.'
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
				features: [
					{
						claim: 'Driven by the mouse',
						what: 'Click places the caret, double-click takes a word and triple-click a line; alt-click adds a caret, alt-drag selects a column.'
					},
					{
						claim: 'Your terminal’s colours',
						what: 'Derives its palette from the terminal it is running in rather than shipping a theme of its own.'
					},
					{
						claim: 'One config file',
						what: 'Zero config is a supported configuration, and the one most people should stay on.'
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
				more: 'Every item is a Markdown file with YAML frontmatter, under a schema you define in cairn.toml. Versioned with the code, reviewable in a pull request, and exposed to agents over MCP. The roadmap for this site is kept in it.',
				state: {
					kind: 'released',
					version: '0.2.1'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'curl -fsSL https://raw.githubusercontent.com/oddurs/cairn/main/install.sh | sh',
				tags: ['issues', 'markdown', 'mcp'],
				features: [
					{
						claim: 'Markdown, in the repository',
						what: 'Every item is a file with YAML frontmatter, versioned with the code and reviewable in a pull request.'
					},
					{
						claim: 'A schema you define',
						what: 'The types, statuses and fields are yours, in `cairn.toml`, and `cairn check` holds every item to them.'
					},
					{
						claim: 'Agents read it too',
						what: 'An MCP server over the same backlog, so a coding agent writes into your structure instead of inventing one.'
					}
				],
				site: 'https://oddurs.github.io/cairn/'
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
				features: [
					{
						claim: 'Forty items at a glance',
						what: 'Grouped by milestone with progress, so the question is what the backlog is worth rather than what one item says.'
					},
					{
						claim: 'Single keys',
						what: 'Read, claim, set a status, close, filter — one key each, with the help a keystroke away.'
					},
					{
						claim: 'Or a board',
						what: 'Tab swaps the list for columns: what is waiting, what is moving, what is blocked, what is done.'
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
				features: [
					{
						claim: 'Links that resolve by name',
						what: '`[[wikilinks]]` against the vault, by the same rules Obsidian uses, with backlinks appearing unasked.'
					},
					{
						claim: 'Git in the status bar',
						what: 'Branch, dirty count and ahead-behind, with stage, diff, commit and push one key away.'
					},
					{
						claim: 'All of it clickable',
						what: 'Click a note, a link, an outline entry or a backlink; right-click answers with what can be done to whatever is under the pointer.'
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
				features: [
					{
						claim: 'Two panes',
						what: 'The front page on the left and the thread you are on filling the right; moving down the list swaps the comments in.'
					},
					{
						claim: 'Seven feeds',
						what: 'Top, New, Best, Ask, Show and Jobs on the number keys, and search beside them.'
					},
					{
						claim: 'Threads that read',
						what: 'Replies hang from guide rails, the poster is marked, and code and quotes are drawn as they were written.'
					}
				]
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
				features: [
					{
						claim: 'Three panes',
						what: 'Feeds, their entries, and the selected entry rendered as a document rather than as a blob of text.'
					},
					{
						claim: 'Read, not skim',
						what: '`z` gives the article the whole screen, set to a measure you can actually read.'
					},
					{
						claim: 'Links you can follow',
						what: 'Numbered inline against a reference list at the foot, the way a printed page does it.'
					}
				]
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
				features: [
					{
						claim: 'No interface at all',
						what: 'Copy something long, press a key, and a chime tells you the summary has replaced it. No window, no output.'
					},
					{
						claim: 'Any model',
						what: 'Anthropic, OpenAI, Gemini, Groq and friends, or one running on your own machine.'
					},
					{
						claim: 'One binary',
						what: 'Rust, with no runtime to install and no daemon to remember.'
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
				features: [
					{
						claim: 'One command',
						what: '`go run . install` takes a machine with nothing on it but the Xcode command line tools and makes it a working one.'
					},
					{
						claim: 'It never surprises you',
						what: 'It never writes macOS defaults, and never deletes a config it did not write — anything already there is backed up first.'
					},
					{
						claim: 'Says what it would do',
						what: '`--dry-run` prints the plan without writing, and `doctor` reports what is and is not in place, changing nothing.'
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
				features: [
					{
						claim: 'Zero config',
						what: '`knit up` on each machine and it becomes discoverable capacity. No IPs, no config files, no accounts, no server.'
					},
					{
						claim: 'Wherever there is room',
						what: '`knit run` puts the command on whichever machine has the most headroom, including the one you are sitting at.'
					},
					{
						claim: 'Behaves as if local',
						what: 'stdin, stdout, stderr and the exit code come back byte for byte.'
					}
				],
				site: 'https://oddurs.github.io/knit/'
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
				features: [
					{
						claim: 'Every format',
						what: 'TTF, OTF, TTC, WOFF and WOFF2, parsed by fontations — the same code Chrome and Skia use.'
					},
					{
						claim: 'Asked of the glyphs',
						what: '`covers` answers which faces can actually set a given text, rather than trusting what the font claims about itself.'
					},
					{
						claim: 'Free, and it says which',
						what: 'SPDX identifiers, embedding rights and reserved names, with a verdict and a reason for every face.'
					},
					{
						claim: 'Nothing leaves the machine',
						what: 'No network calls, no telemetry, no accounts, and no writes to system font directories.'
					}
				],
				site: 'https://oddurs.github.io/fontina/'
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
				features: [
					{
						claim: 'Synthesized, not sampled',
						what: 'Every click is generated as the key goes down, so it never loops audibly the way sample-based clickers do.'
					},
					{
						claim: 'One command',
						what: 'No config, no sample files, and nothing to download.'
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
				features: [
					{
						claim: 'A dozen palettes',
						what: 'Blocks fill the cell, braille halves it again, standard keeps it to type — and emoji, for the fun of it.'
					},
					{
						claim: 'Colour, or not',
						what: '256-colour and true-colour output, taken from the terminal’s own palette.'
					},
					{
						claim: 'Export anywhere',
						what: 'HTML, SVG, PNG, GIF, ANSI or plain text, animated GIFs included.'
					}
				],
				site: 'https://gummyworm.dev/'
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
				state: { kind: 'released', version: '0.4.0' },
				license: 'MIT',
				lang: 'Python',
				install: 'pip install starward',
				tags: ['astronomy', 'ephemeris', 'teaching'],
				features: [
					{
						claim: 'Shows its work',
						what: 'Every calculation can print each step it took, which turns an opaque number into something you can follow.'
					},
					{
						claim: 'Sun, Moon and sky',
						what: 'Rise and set, twilight, phases, coordinate transforms and Julian dates.'
					},
					{
						claim: 'Nothing compiled',
						what: 'Pure Python, so it runs anywhere Python does.'
					}
				],
				site: 'https://starward.dev/'
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
				features: [
					{
						claim: 'Solves for the staging',
						what: 'Finds the engine configuration and propellant split that reaches a delta-v target.'
					},
					{
						claim: 'Eleven real engines',
						what: 'A database of engines that were actually built, with the numbers that decide what a stage can do.'
					},
					{
						claim: 'Uncertainty, not a point',
						what: 'Monte Carlo over uncertain inputs: how often the design still makes orbit.'
					}
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
				features: [
					{
						claim: 'Derived from cargo',
						what: 'Watch globs come from the crate’s path-dependency closure, not from globs you wrote and will forget to update.'
					},
					{
						claim: 'Tells you why',
						what: '`why` answers whether a task would run right now, and on account of what.'
					},
					{
						claim: 'Orchestrates, replaces nothing',
						what: 'Drives cargo, trunk, cargo leptos and dx. It is not a bundler and not a compiler.'
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
				features: [
					{
						claim: 'Server-first HTML',
						what: 'Zero JavaScript by default, with islands of interactivity only where you ask for them.'
					},
					{
						claim: 'Typed content',
						what: 'Content collections whose shape is checked when the site is built, not when someone loads it.'
					},
					{
						claim: 'Documented before built',
						what: 'The docs come first so the API can be argued with before it is coded. Nothing is implemented yet.'
					}
				]
			}
		]
	}
];
