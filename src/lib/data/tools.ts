// Every tool on the site, grouped as the rail shows them. This file is the
// source: edit an entry here. What the screens runner shot of each tool
// (screenshots, a recording) is in screens.json, written by `npm run screens`.
//
export type Media = { src: string; alt: string; width: number; height: number };

export type State =
	| { kind: 'released'; version: string }
	| { kind: 'live' }
	| { kind: 'source'; version?: string }
	// Designed in the open, docs before code: the site says pre-release.
	| { kind: 'design' };

export type Tool = {
	// The repository's name, which is also the page's address. Never changed
	// for looks: a link to /chess-strat must keep working.
	name: string;
	// What it calls itself, where that is not its repository's name: the
	// heading on its page. A hyphenated working title is an address, not a
	// name — chess-strat calls itself The Cow.
	title?: string;
	// A shorter form for the rail and the lists, where the title is too long
	// for a narrow column.
	short?: string;
	// What sort of thing it is, which decides how its page is laid out
	// (templates.ts): a terminal tool is read and then watched, a game is seen
	// and then played.
	kind:
		| 'tui'
		| 'cli'
		| 'library'
		| 'plugin'
		| 'language'
		| 'theme'
		| 'app'
		| 'game'
		| 'toy'
		| 'map'
		| 'simulation'
		| 'instrument'
		| 'art'
		| 'explainer'
		| 'essay'
		| 'course'
		| 'book';
	// What the main button says, where the kind's own word is wrong for it:
	// a rover is driven, not opened.
	verb?: string;
	line: string;
	more: string;
	state: State;
	license: string;
	lang: string;
	install?: string;
	tags: string[];
	// A website about the tool, when that is not the repository.
	site?: string;
	// A capture made elsewhere, shown when the runner has no screens of it.
	recording?: Media;
	// A still of the thing at its own address, 1600×1000, for what lives in a
	// browser: the page is the program, so a picture of it is the honest one.
	poster?: string;
};

// What a section is made of, rather than what it is about. The labels below
// say the second thing — System, Agents, Maps — and that is the right way to
// look for a thing you half remember. A shelf says the first: what kind of
// thing it is, which is what its page will be (a recording, a Mac app, a game
// to play, something to read), and the rail can be narrowed to one.
// A shelf arrives with its first section and not before: an empty one is a
// label promising something that is not there, and the test below says so.
export type Shelf = 'terminal' | 'desk' | 'play' | 'look' | 'read' | 'build';

export const shelves: { id: Shelf; label: string; of: string }[] = [
	{ id: 'terminal', label: 'Terminal', of: 'programs that run in one' },
	{ id: 'desk', label: 'Desk', of: 'Mac apps, and what changes how the machine looks and sounds' },
	{ id: 'play', label: 'Play', of: 'games and toys, most of them in a browser' },
	{ id: 'look', label: 'Look', of: 'maps, simulations and instruments to explore' },
	{ id: 'read', label: 'Read', of: 'explainers, research, books and courses' },
	{ id: 'build', label: 'Build', of: 'libraries, frameworks and languages for making other things' }
];

export type Section = { label: string; shelf: Shelf; tools: Tool[] };

export const sections: Section[] = [
	{
		label: 'System',
		shelf: 'terminal',
		tools: [
			{
				name: 'poptop',
				kind: 'tui',
				line: 'A system monitor you can rewind.',
				more: 'Keeps every sample it takes, process table included, so you can scrub back and ask what was eating the box forty seconds ago. No daemon, no config, no logfiles.',
				state: { kind: 'source', version: '0.2.0' },
				license: 'GPL-3.0',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/poptop',
				tags: ['ratatui', 'monitoring']
			},
			{
				name: 'quarry',
				kind: 'tui',
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
				site: 'https://oddurs.github.io/quarry/'
			},
			{
				name: 'yoghurt',
				kind: 'tui',
				line: 'See what is installed on this machine, and where it came from.',
				more: 'Homebrew formulae and casks, cargo binaries, rustup toolchains and the rest, in one inventory that explains why each thing is there.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/yoghurt',
				tags: ['homebrew', 'inventory', 'macos']
			},
			{
				name: 'andy',
				kind: 'cli',
				line: 'Where developer tooling hides your disk space.',
				more: 'Container disk images, package caches, language toolchains, Xcode leftovers, simulator disks, model weights and every target directory you have ever built — found, measured, ranked, and each with the command that would reclaim it. It never deletes anything: running the command is your decision. One file of Python, no dependencies. macOS.',
				state: { kind: 'source', version: '2.0.0' },
				license: 'MIT',
				lang: 'Python',
				install:
					'curl -o /usr/local/bin/andy https://raw.githubusercontent.com/oddurs/andy/main/andy && chmod +x /usr/local/bin/andy',
				tags: ['disk', 'caches', 'macos']
			},
			{
				name: 'findr',
				kind: 'tui',
				line: 'Finder’s column view in the terminal, with git in it.',
				more: 'Three columns — parent, current, preview — with syntax-highlighted previews built on a background thread, git status on every entry and rolled up to directories, fuzzy filtering, find-anywhere-below that honours every .gitignore it meets, file operations with undo, and the mouse if your terminal has one. Press D on a changed file and the preview becomes its diff. It hands the shell back the directory you left in.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/findr',
				tags: ['files', 'git', 'ratatui']
			},
			{
				name: 'foldr',
				kind: 'cli',
				line: 'Everything a folder carries besides its name.',
				more: 'Permissions, extended attributes, native flags, inherited access rules and filesystem policies — found, explained, and edited deliberately, with previews, partial presets and a conflict-aware undo. Early: the workspace, the CLI entry points and the plan are in place, and the inspection commands are not written yet.',
				state: { kind: 'design' },
				license: 'MIT',
				lang: 'Rust',
				tags: ['permissions', 'xattrs', 'macos']
			}
		]
	},
	{
		label: 'Code',
		shelf: 'terminal',
		tools: [
			{
				name: 'caligula',
				kind: 'tui',
				line: 'A terminal browser for git worktrees.',
				more: 'Finds every checkout on the machine, groups them by repository, and answers the question that matters before you delete one: is there anything in here worth saving?',
				state: { kind: 'source', version: '0.2.0' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/caligula',
				tags: ['git', 'worktree', 'ratatui']
			},
			{
				name: 'rigor',
				kind: 'tui',
				line: 'A terminal dashboard for the pull requests you have out on a repo.',
				more: 'Run it inside a checkout: what is ready to merge, what is blocked, and which of your worktrees can be thrown away. Then it hands you to the browser to merge.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/rigor',
				tags: ['github', 'pull requests', 'ci']
			},
			{
				name: 'nun',
				kind: 'tui',
				line: 'A mouse-first terminal code editor.',
				more: 'Borrows its colours from the terminal it is running in and ships with one config file you will mostly never open. Early; built one milestone at a time.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/nun',
				tags: ['editor']
			},
			{
				name: 'dscheck',
				kind: 'cli',
				line: 'The linter that knows your design system.',
				more: 'Reads the token source you already have — a Tailwind `@theme` or plain `:root` custom properties — and flags every off-system colour, length, font, shadow and invented `var(--…)` in CSS, JSX styles and Tailwind arbitrary values, with the nearest real token attached and an autofix where the match is exact. Written for agent-written UI: a hook lints what the agent just wrote and hands the fix back before a human sees the diff. Baselines accept existing debt so CI fails only on new findings.',
				state: { kind: 'source', version: '0.1.0' },
				license: 'MIT',
				lang: 'TypeScript',
				install: 'npm install -D dscheck',
				tags: ['design tokens', 'eslint', 'stylelint']
			},
			{
				name: 'tzguard',
				kind: 'cli',
				line: 'The timezone database, treated as the dependency it is.',
				more: 'The IANA tz database changes under running systems several times a year, on the timeline of politics, and the failure is a scheduled event firing an hour off, silently. tzguard pins the release you resolve, verifies it, diffs two releases by meaning and says whether one touches the zones your data uses; `tzguard diff 2025a 2025b` reproduces the IANA announcement mechanically. Pre-release: the core works, and nothing is on PyPI yet.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Python',
				install: 'pip install git+https://github.com/oddurs/tzguard',
				tags: ['timezones', 'iana', 'ci']
			}
		]
	},
	{
		label: 'Agents',
		shelf: 'terminal',
		tools: [
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
				tags: ['llm context', 'mcp', 'search']
			},
			{
				name: 'moan',
				kind: 'tui',
				line: 'A compressed, live transcript of your coding-agent sessions.',
				more: 'Claude Code writes everything it does to a JSONL file, most of it machinery. moan tails that file and gives back the conversation — you, the agent, you, the agent — as a feed you can read, with each turn fused into a headline and up to three notes. Tool calls condense by rule rather than by model, your own words are never paraphrased, and anything that looks like an API key is caught before it reaches the screen.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/moan',
				tags: ['coding agents', 'transcripts', 'ratatui']
			},
			{
				name: 'humanoid',
				kind: 'cli',
				line: 'Your agent writes the code. This writes the history.',
				more: 'A shadow git remote between your coding agents and the real one. Agents push as fast as they like; humanoid rewrites the firehose into the history a careful engineer would have written — atomic commits, messages that say why, pull requests a person can review, every commit green — and you decide what leaves. The code is never changed, only the story of how it got there.',
				state: { kind: 'source' },
				license: 'Apache-2.0',
				lang: 'Go',
				install: 'go install github.com/oddurs/humanoid/cmd/humanoid@latest',
				tags: ['git', 'agents', 'history']
			},
			{
				name: 'herdr-namesync',
				title: 'namesync',
				kind: 'plugin',
				line: 'Workspace names that follow the work, and know when to leave it alone.',
				more: 'A herdr plugin that keeps workspace, tab and agent labels in step with what the coding agent inside is actually doing — the repository rather than the folder, how long it has held its state, what it is doing now — with no model call, key or account. It reads whatever herdr reports, so it works with every agent herdr knows, and a name you typed by hand is held.',
				state: { kind: 'released', version: '0.3.0' },
				license: 'MIT',
				lang: 'JavaScript',
				install: 'herdr plugin install oddurs/herdr-namesync && namesync setup --write',
				tags: ['herdr', 'agents', 'workspaces'],
				site: 'https://oddurs.github.io/herdr-namesync/',
				poster: '/media/posters/herdr-namesync.webp'
			},
			{
				name: 'ag-test',
				title: 'agt',
				kind: 'library',
				line: 'A test framework whose reader is an agent, not a person.',
				more: 'A failure is now mostly read by an agent in a loop, thirty times before anyone looks. So every failure carries a fingerprint and every run reports a delta; a failure says what a person would have inferred — inconclusive as distinct from failed, the minimised witness, a reproduce command that reproduces — and every change to a test is classified, so weakening one is never silent. New tests are scored by the mutants they kill, not by coverage.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/ag-test && cd ag-test && cargo build --release',
				tags: ['testing', 'agents', 'mutation']
			}
		]
	},
	{
		label: 'Projects',
		shelf: 'terminal',
		tools: [
			{
				name: 'cairn',
				kind: 'cli',
				line: 'A roadmap and issue manager that lives in your repository.',
				more: 'Every item is a Markdown file with YAML frontmatter, under a schema you define in cairn.toml. Versioned with the code, reviewable in a pull request, and exposed to agents over MCP. The roadmap for this site is kept in it.',
				state: { kind: 'released', version: '0.3.0' },
				license: 'MIT',
				lang: 'Rust',
				install: 'curl -fsSL https://raw.githubusercontent.com/oddurs/cairn/main/install.sh | sh',
				tags: ['issues', 'markdown', 'mcp'],
				site: 'https://oddurs.github.io/cairn/'
			},
			{
				name: 'harrow',
				kind: 'tui',
				line: 'Work a cairn backlog from the terminal.',
				more: 'Reading cairn items one at a time is fine; deciding what forty of them are worth is not. A backlog by milestone with claim, status and close on single keys.',
				state: { kind: 'source', version: '0.2.0-alpha.1' },
				license: 'MIT',
				lang: 'Rust',
				install: 'brew install oddurs/tap/harrow',
				tags: ['cairn', 'backlog', 'ratatui']
			},
			{
				name: 'sprig',
				kind: 'language',
				line: 'A plain-text format for plans.',
				more: 'A shopping list and an eighteen-month build use the same handful of marks: a dash to do, a tilde doing, an x done, a question and its answer, and a double bracket to graft another file in as a branch. Indentation is the structure, and progress, estimates and what is blocked are computed rather than written. People and coding agents read and edit the same file. The spec and the playground are up; the Rust parser is not written yet.',
				state: { kind: 'design' },
				license: 'MIT (CC0 for the spec)',
				lang: 'Rust',
				tags: ['plans', 'plain text', 'agents'],
				site: 'https://oddurs.github.io/sprig/'
			},
			{
				name: 'jerk',
				kind: 'tui',
				line: 'Which of these projects is actually alive, complete, and effective?',
				more: 'A terminal dashboard for a projects directory. It scans every local Git repository at once, then fills in GitHub and deployment data in the background: momentum, readiness, pull requests and releases, whether the site is up, the Cairn roadmap, and a transparent 100-point score built from all of it.',
				state: { kind: 'source', version: '0.5.1' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --locked --git https://github.com/oddurs/jerk',
				tags: ['portfolio', 'git', 'github', 'ratatui']
			},
			{
				name: 'x-post',
				kind: 'cli',
				line: 'Announce a release on X from the command line, safely.',
				more: 'Templates for a launch post with the version, notes, link and tags filled in; X’s weighted 280-character count checked before anything is sent, links included; long release notes split into a reply thread at word boundaries. It always shows the post and asks first, and `--dry-run` never contacts X at all.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'JavaScript',
				install:
					'git clone https://github.com/oddurs/x-post && cd x-post && npm install && npm link',
				tags: ['releases', 'x', 'announcements']
			}
		]
	},
	{
		label: 'Machines',
		shelf: 'terminal',
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
				tags: ['dotfiles', 'setup', 'macos']
			},
			{
				name: 'loadstar',
				kind: 'tui',
				line: 'A machine setup wizard, as a Commodore 64 boot sequence.',
				more: 'Named for `LOAD"*",8,1`: load whatever is on the disk. Eight phases in a TUI with matrix rain, and it really runs them — Homebrew and cargo installs, a `.gitconfig` and shell config written from your choices, SSH keys made and wired to GitHub — with every existing file backed up first. Pick a preset or choose by hand.',
				state: { kind: 'released', version: '0.1.0' },
				license: 'MIT',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/loadstar && cd loadstar/installer && cargo build --release',
				tags: ['setup', 'dotfiles', 'ratatui']
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
				site: 'https://oddurs.github.io/knit/'
			},
			{
				name: 'mcdir',
				kind: 'cli',
				line: 'Make a directory. Move into it.',
				more: '`mkdir -p` and `cd`, together, as a native function for fish, bash, zsh and PowerShell — so the new directory is the one you are standing in, which a program in a subprocess cannot do for you. Missing parents are created, spaces work, CDPATH cannot redirect you, and a failed creation leaves you where you were.',
				state: { kind: 'released', version: '0.1.0' },
				license: 'MIT',
				lang: 'Shell',
				install: 'git clone https://github.com/oddurs/mcdir && sh mcdir/install.sh',
				tags: ['shell', 'fish', 'one job']
			}
		]
	},
	{
		label: 'News and notes',
		shelf: 'terminal',
		tools: [
			{
				name: 'hackney',
				kind: 'tui',
				line: 'Hacker News in the terminal.',
				more: 'A fast two-pane reader: the story list stays on the left, the thread you are on fills the right. Keyboard-driven, happy with the mouse, dressed in your terminal’s own colours.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'brew install oddurs/tap/hackney',
				tags: ['hacker news', 'reader']
			},
			{
				name: 'rsst',
				kind: 'tui',
				line: 'A terminal RSS and Atom feed reader.',
				more: 'Feeds, entries and the selected entry in three panes, rendered as a document with code blocks kept verbatim and links numbered against a reference list.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/rsst',
				tags: ['rss', 'atom', 'ratatui']
			},
			{
				name: 'trafford',
				kind: 'tui',
				line: 'A terminal knowledge base.',
				more: 'An Obsidian-shaped vault of plain markdown with wikilinks, backlinks and tags, a modal editor, git in the status bar, and an assistant that reads your notes before it answers.',
				state: {
					kind: 'source',
					version: '0.1.0'
				},
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/trafford',
				tags: ['notes', 'markdown', 'zettelkasten']
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
				tags: ['clipboard', 'llm', 'hotkey']
			}
		]
	},
	{
		label: 'Science',
		shelf: 'terminal',
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
				site: 'https://starward.dev/'
			},
			{
				name: 'tsi',
				kind: 'cli',
				line: 'Rocket staging, worked out.',
				more: 'Finds the engine configuration and propellant split that reaches a delta-v target, from a database of eleven real engines, with Monte Carlo uncertainty analysis and the rocket drawn in ASCII. Named for Tsiolkovsky, whose equation it solves.',
				state: { kind: 'released', version: '0.8.0' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/tsi',
				tags: ['orbital mechanics', 'monte carlo']
			},
			{
				name: 'tungsten',
				kind: 'cli',
				line: 'Calculate with real-world quantities, offline.',
				more: 'A small nod to Wolfram|Alpha in the terminal: `60 mph * 2h 15min` is 135 miles, and it offers the same in kilometres and in marathons. Units are checked rather than guessed, so adding a length to a time is an error that underlines both halves and suggests the division you probably meant. Exact arithmetic stays exact as long as it can, there are variables, functions and a REPL, and nothing leaves the machine. Named for element 74, symbol W.',
				state: { kind: 'source', version: '0.3.1' },
				license: 'MIT',
				lang: 'Rust',
				install: 'cargo install --git https://github.com/oddurs/tungsten',
				tags: ['units', 'quantities', 'repl']
			}
		]
	},
	{
		label: 'Art and life',
		shelf: 'terminal',
		tools: [
			{
				name: 'windsor',
				kind: 'cli',
				line: 'A Ford 302 V8, modelled from first principles, for the sound.',
				more: 'Specify the forging — four throw angles, eight rods, a camshaft — and the firing order, the dyno curve, the indicator card and the exhaust note all fall out of it. Swap the cross-plane crank for a flat one and the burble becomes a shriek, with nothing else changed. Sixty-three checks against flow benches, shock tubes and the 1968 casting. No dependencies.',
				state: { kind: 'released', version: '1.0.0' },
				license: 'MIT',
				lang: 'C++',
				install: 'git clone https://github.com/oddurs/windsor && cd windsor && make',
				tags: ['engine simulation', 'sound synthesis']
			},
			{
				name: 'cornell',
				kind: 'cli',
				line: 'A path tracer that never types a colour.',
				more: 'The Cornell box from its measured geometry, paints and lamp, with light carried as spectral radiance throughout. Gold is a table of refractive index and Fresnel’s equations rather than an RGB triple, so copper turns pink and aluminium stays neutral because of physics. The same image on any machine at any thread count, and every claim it makes checked in one run. No dependencies.',
				state: { kind: 'source', version: '0.5' },
				license: 'MIT',
				lang: 'C++',
				install: 'git clone https://github.com/oddurs/cornell && cd cornell && make',
				tags: ['path tracing', 'spectral rendering']
			},
			{
				name: 'biotic',
				kind: 'tui',
				line: 'A culture of cells that write themselves, in a dish you can watch.',
				more: 'Each cell’s genome is a small Python function that decides, once a tick, whether it eats, moves, divides, signals or rests. Agar depletes, cells starve and burst, and the ones that gather energy divide. A language model is the mutagen, rewriting a daughter’s genome on a few divisions, with a control arm of random edits to measure it against. You plant a seed — a word, a question — and mostly watch.',
				state: { kind: 'released', version: '0.1.0' },
				license: 'MIT',
				lang: 'Python',
				install: 'git clone https://github.com/oddurs/biotic && cd biotic && uv sync',
				tags: ['artificial life', 'evolution', 'llm'],
				site: 'https://oddurs.github.io/biotic/',
				poster: '/media/posters/biotic.webp'
			},
			{
				name: 'gummyworm',
				kind: 'cli',
				line: 'Turn images into ASCII art.',
				more: 'A playful command-line tool with 256-colour and true-colour output, a dozen palettes from plain to braille and emoji, animated GIFs, and export to HTML, SVG, PNG and GIF. Bash 3.2 or zsh, and ImageMagick.',
				state: { kind: 'released', version: '2.4.0' },
				license: 'MIT',
				lang: 'Shell',
				install: 'brew tap oddurs/gummyworm && brew install gummyworm',
				tags: ['ascii art', 'images', 'imagemagick'],
				site: 'https://gummyworm.dev/'
			}
		]
	},
	{
		label: 'Apps',
		shelf: 'desk',
		tools: [
			{
				name: 'doot',
				kind: 'app',
				line: 'A terminal emulator for macOS, written from scratch in Zig.',
				more: 'The VT parser, cell grid, scrollback, glyph atlas and Metal renderer are its own; SDL3 brings the window and FreeType the glyphs, and nothing else is borrowed. End-to-end tests drive a real shell on a real PTY and check the screen. Every session’s output is recorded by default, and the title says `● rec` for as long as it is; keystrokes never are unless you ask.',
				state: { kind: 'released', version: '0.1.0' },
				license: 'MIT',
				lang: 'Zig',
				install:
					'git clone https://github.com/oddurs/doot && cd doot && zig build -Doptimize=ReleaseFast',
				tags: ['terminal emulator', 'metal', 'zig'],
				site: 'https://oddurs.github.io/doot/',
				poster: '/media/posters/doot.webp'
			},
			{
				name: 'milky',
				kind: 'app',
				line: 'A notes app that looks like Apple Notes and keeps plain Markdown.',
				more: 'No account, no database, no sync service of its own: point it at a folder and that folder is the app’s whole state, one Markdown file per note, readable by anything else. Native Swift, built with SwiftPM rather than Xcode, with its design system in one token file. The Mac app works; the iPhone one is next.',
				state: { kind: 'source' },
				license: 'none',
				lang: 'Swift',
				tags: ['notes', 'markdown', 'macos'],
				site: 'https://oddurs.github.io/milky/',
				poster: '/media/posters/milky.webp'
			},
			{
				name: 'fontina',
				kind: 'app',
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
				site: 'https://oddurs.github.io/fontina/'
			}
		]
	},
	{
		label: 'Look and sound',
		shelf: 'desk',
		tools: [
			{
				name: 'subway-seat',
				title: 'Subway Seat',
				kind: 'theme',
				line: 'A walnut-brown colour scheme from a 1970s subway car.',
				more: 'Parchment text, harvest gold, burnt orange and avocado, in three cities — New York, London and Paris — generated from one palette file for 92 apps, Ghostty, VS Code, Neovim and Zed among them. One command finds the apps on the machine, shows the plan, asks once, and switches each one over between markers it can take back out.',
				state: { kind: 'released', version: '0.3.0' },
				license: 'MIT',
				lang: 'Python',
				install: 'curl -fsSL https://oddurs.github.io/subway-seat/install.sh | sh',
				tags: ['colour scheme', 'ghostty', 'editors'],
				site: 'https://oddurs.github.io/subway-seat/',
				poster: '/media/posters/subway-seat.webp'
			},
			{
				name: 'windflow',
				kind: 'app',
				line: 'A screensaver that paints your aerial photographs out of moving wind.',
				more: 'The photograph is never drawn. It is only a palette the wind samples: coloured streaks flow along the image’s own structure — a braided river, a dune field, the shear in a cloud deck — until the picture assembles out of accumulated paint, then dissolves back into weather and the next one begins. macOS 13 or later.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Swift',
				install:
					'git clone https://github.com/oddurs/windflow && cd windflow && scripts/build.sh && scripts/install.sh',
				tags: ['screensaver', 'flow fields', 'macos']
			},
			{
				name: 'backpage',
				kind: 'cli',
				line: 'The desktop wallpaper, as a dashboard you never have to click.',
				more: 'The desktop behind your windows is the largest surface on the machine that is always in view, and it shows a photograph. backpage draws a terminal-style dashboard there instead — poptop’s figures, or poptop itself running on a pseudo-terminal — glanceable, never interactive, never taking focus. Early, but it does the thing. macOS.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/backpage && cd backpage && cargo install --path .',
				tags: ['wallpaper', 'dashboard', 'macos']
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
				tags: ['audio', 'synthesis', 'macos']
			}
		]
	},
	{
		label: 'Games',
		shelf: 'play',
		tools: [
			{
				name: 'sharkplane',
				kind: 'game',
				line: 'A low-poly flight game: you are a big plane with a bad attitude.',
				more: 'Roll down the strip, pull up and chase planes down in a shark-mouthed WW2 fighter — and eat them rather than shoot them: one bite, two for a bomber, five weak points for the zeppelin. Combos build a feeding frenzy, sorties last three minutes, and everyone flies the same skies each day. Terrain, planes, music and every sound are generated in code.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['three.js', 'arcade', 'procedural'],
				site: 'https://oddurs.github.io/sharkplane/',
				poster: '/media/posters/sharkplane.webp'
			},
			{
				name: '3310',
				kind: 'game',
				line: 'Snake II on a 3D Nokia 3310, in your browser.',
				more: 'Pixel-accurate: the real game logic, the real LCD green, and Finnish radio. In 2000 the phone cost 189 markka; within two years 126 million had shipped, and Snake II was why people wore out the 5 key. A love letter to playing it at two in the morning under the covers.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'JavaScript',
				tags: ['snake', 'nokia', 'three.js'],
				site: 'https://3310.love/',
				poster: '/media/posters/3310.webp'
			},
			{
				name: 'hose-rodeo',
				title: 'Hose Rodeo',
				kind: 'game',
				line: 'A firefighter on a hose that will not stop spraying.',
				more: 'The valve is stuck open, so aiming the water at the fire aims the recoil at you: the hose is your tool and your transport, and it has opinions. Hold the ridge for three minutes while lightning starts fires, the wind decides where they spread and embers jump the front. There is no score: every tree you save stays green on the map, and every one you lose stays scorched.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'JavaScript',
				tags: ['three.js', 'physics', 'wildfire'],
				site: 'https://oddurs.github.io/hose-rodeo/',
				poster: '/media/posters/hose-rodeo.webp'
			},
			{
				name: 'toolbar-season',
				title: 'Toolbar Season',
				kind: 'game',
				line: 'Internet Explorer 6, October 2005, buried in bundled toolbars.',
				more: 'A free screensaver came with a toolbar, and the toolbar came with three more. You dial in to a browser that is 94% toolbar; close them, scan for them, uninstall them, and they come back with friends. It ends with a tally — toolbars you agreed to, toolbars that installed themselves, pop-ups that got through. The modem does the whole handshake, and every toolbar in it is invented.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'Svelte',
				tags: ['internet history', 'parody', 'interactive'],
				site: 'https://oddurs.github.io/toolbar-season/',
				poster: '/media/posters/toolbar-season.webp'
			},
			{
				name: 'chess-strat',
				title: 'The Cow',
				kind: 'game',
				line: 'Learn the Cow: one chess opening, every game.',
				more: 'Six moves — e3, d3, Ne2, Nd2, Nb3, Ng3 — whatever the opponent does: the system Anna Cramling invented and Tyler1 climbed with. Guided lessons, a hint ladder, drills, and a club-strength engine with a sloppiness setting, so its weaker levels blunder like a person instead of playing at random. Progress stays in the browser.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['chess', 'openings', 'trainer'],
				site: 'https://oddurs.github.io/chess-strat/',
				poster: '/media/posters/chess-strat.webp'
			},
			{
				name: 'arkonk',
				kind: 'game',
				line: 'A small, precise brick breaker.',
				more: 'Twelve authored sectors in three chapters, checkpoints, replayable sectors and thirty-six medals to earn at your own pace. Direct mouse control and collision simulated at 240 Hz keep the attention on the next bounce; the look is flat and quiet, with a palette for each chapter. A native Mac app in Rust, in thirty languages.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/arkonk && cd arkonk && cargo run --locked --release',
				tags: ['breakout', 'macos', 'physics']
			},
			{
				name: 'rim',
				kind: 'game',
				line: 'A plugin-first colony sim.',
				more: 'You start as one naked warrior with nothing, and build shelter, draw in settlers and grow a colony; everything you build makes you visible, and visibility brings the world — traders, beasts, raiders. There is no difficulty setting: your wealth is the curve. The engine provides mechanisms only, and everything else is a plugin, the base game included.',
				state: { kind: 'source' },
				license: 'Apache-2.0',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/rim && cd rim && cargo run --release -p rim_client',
				tags: ['colony sim', 'modding', 'simulation']
			}
		]
	},
	{
		label: 'Toys',
		shelf: 'play',
		tools: [
			{
				name: 'piano-cat',
				title: 'Piano Cat',
				kind: 'toy',
				line: 'Mime a classical masterpiece at your webcam.',
				more: 'Every stroke of your hands plays the next beat, so the music goes at your speed: play hard for forte, soft for piano, lift your hands to hold the pedal. A keystroke fires as the wrist starts to fall rather than at the bottom of its travel, which is where an instrument starts to feel connected to your hands. There is a cat, and it has opinions. No camera? The space bar works.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['webcam', 'hand tracking', 'music'],
				site: 'https://oddurs.github.io/piano-cat/',
				poster: '/media/posters/piano-cat.webp'
			},
			{
				name: 'airchord',
				kind: 'toy',
				line: 'A chord synthesiser you play with your hands.',
				more: 'Raise fingers to pick a chord and tilt your wrists to shape it: the left hand chooses what is played, the right how it sounds — voicing, octave, filter, volume — and a wrist flick borrows a chord from the parallel key. Hand tracking runs on the device. An independent reimplementation of Gesture Synth by Eric Wei, whose gesture vocabulary and musical design it is, offered on the same non-commercial terms.',
				state: { kind: 'live' },
				license: 'Non-commercial',
				lang: 'TypeScript',
				tags: ['hand tracking', 'synthesis', 'web audio'],
				site: 'https://oddurs.github.io/airchord/',
				poster: '/media/posters/airchord.webp'
			},
			{
				name: 'glitterbug',
				kind: 'toy',
				line: 'A tiny 3D glitter-art studio.',
				more: 'A desk by a window on a bright afternoon. Spread glue on a sheet of paper, shake glitter over it, then tip the page and watch the loose glitter slide off, leaving only what the glue caught. Pick a stencil for a scored round, or just make a mess. The room, the wood grain and every stencil are generated at load; there are no asset files.',
				state: { kind: 'live' },
				license: 'none',
				lang: 'JavaScript',
				tags: ['three.js', 'toy', 'procedural'],
				site: 'https://oddurs.github.io/glitterbug/',
				poster: '/media/posters/glitterbug.webp'
			},
			{
				name: 'bushy',
				kind: 'toy',
				line: 'A webcam photobooth that grows you a unibrow out of your own hair.',
				more: 'Countdown, flash, and a caterpillar creeps out from between your eyes. It never pastes on a cartoon brow: it measures the hair you already have and grows more of the same, then distorts your face slightly, because a unibrow alone was not unsettling enough. Everything runs in the browser, and no photo leaves the device.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'JavaScript',
				tags: ['webcam', 'face tracking', 'photobooth'],
				site: 'https://oddurs.github.io/bushy/'
			},
			{
				name: 'snappers',
				kind: 'toy',
				line: 'Silly camera filters, entirely in your browser.',
				more: 'Point a phone at the page, open the camera and swipe between filters; tap the shutter for a photo, hold it for a clip. Each filter is a scene with its own rendering technique in WebGL2 rather than a colour tweak, and the video never leaves the device.',
				state: { kind: 'live' },
				license: 'none',
				lang: 'JavaScript',
				tags: ['webcam', 'webgl', 'filters'],
				site: 'https://oddurs.github.io/snappers/',
				poster: '/media/posters/snappers.webp'
			}
		]
	},
	{
		label: 'Maps',
		shelf: 'look',
		tools: [
			{
				name: 'traintime',
				kind: 'map',
				line: 'Every New York subway train, moving on a map.',
				more: 'The MTA publishes no train positions — only predicted arrivals and a coarse status, with quirks that differ by division. traintime turns that into continuous motion: a physical model of each train, paced to an arrival time corrected by a model learned from recorded feeds, and scored by replay against what the trains actually did. No reversals and no jumps in 460,000 replayed train-seconds.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['mta', 'realtime', 'maplibre'],
				site: 'https://traintime-site-production.up.railway.app/',
				poster: '/media/posters/traintime.webp'
			},
			{
				name: 'yggdrasil',
				kind: 'map',
				line: 'The plant kingdom, as one tree you can walk.',
				more: '479 families and some fourteen thousand genera of land plant, mosses to orchids, sized by species, coloured by lineage and dated to geological time, in four linked views with a scrubber that grows the tree from its origin 445 million years ago. One self-contained file with no frameworks and no network calls, and a plain page for every family if you would rather read.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'JavaScript',
				tags: ['botany', 'phylogeny', 'd3'],
				site: 'https://yggdrasil.oddurs.com/',
				poster: '/media/posters/yggdrasil.webp'
			},
			{
				name: 'museo',
				kind: 'map',
				line: 'Every museum in New York’s five boroughs, on a map of the city after dark.',
				more: 'An index set in type and drawn on a map made from the city’s own coastline and street centrelines — no tiles, no map key, no server. Built to static files, and set in the reader’s own system face, so it serves no fonts at all.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'JavaScript',
				tags: ['nyc', 'museums', 'cartography'],
				site: 'https://oddurs.github.io/museo/',
				poster: '/media/posters/museo.webp'
			},
			{
				name: 'cartogram',
				title: 'Inflatable World',
				kind: 'map',
				line: 'A world map where every country inflates to its share of the data.',
				more: 'Pick a dataset and each country swells or shrinks until its area matches, with its borders stitched to its neighbours’ all the way; switch datasets and the world re-inflates smoothly. The solver is Dougenik, Chrisman and Niemeyer’s 1985 method, written from scratch and run in a worker.',
				state: { kind: 'live' },
				license: 'none',
				lang: 'TypeScript',
				tags: ['cartography', 'd3', 'data'],
				site: 'https://oddurs.github.io/cartogram/',
				poster: '/media/posters/cartogram.webp'
			}
		]
	},
	{
		label: 'Simulations',
		shelf: 'look',
		tools: [
			{
				name: 'rover',
				verb: 'Drive',
				kind: 'simulation',
				line: 'Drive a Mars rover across Gale Crater.',
				more: 'Six-wheel rocker-bogie suspension on a real height field from MOLA, the laser altimeter that fired six hundred million shots at Mars, with Mount Sharp on the horizon 31 km away, where it actually is. Everything larger than about 460 m is measured, and what is invented is written down. No goals and no score: drive around and look at Mars.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['mars', 'three.js', 'terrain'],
				site: 'https://oddurs.github.io/rover/',
				poster: '/media/posters/rover.webp'
			},
			{
				name: 'fluidity',
				kind: 'simulation',
				line: 'A wind tunnel that runs in your browser.',
				more: 'Seven live fluid-dynamics experiments — a Kármán vortex street, a wing at angle of attack, buoyant plumes, the Rayleigh–Taylor instability — solved on the GPU at sixty frames a second, with each equation explained beside the thing it governs. X-ray any field, drag the obstacle, park a probe, and hear the vortex shedding as a tone measured from the pressure. There is a section called What this gets wrong.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['fluid dynamics', 'webgl', 'explainer'],
				site: 'https://oddurs.github.io/fluidity/',
				poster: '/media/posters/fluidity.webp'
			},
			{
				name: 'coalesce',
				kind: 'art',
				line: 'Two black holes spiral together and become one.',
				more: 'An inspiral, merger and ringdown as a seamless 75-second loop, from a GPU ray tracer written for the piece in Rust and WGSL. A black hole bends light, so every sample follows a curved path through the field of both holes, and a second pass grades the frames the way film and glass would. The loop closes without a cut you can see.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'Rust',
				tags: ['ray tracing', 'wgpu', 'general relativity'],
				site: 'https://coalesce.oddurs.com/',
				poster: '/media/posters/coalesce.webp'
			}
		]
	},
	{
		label: 'Instruments',
		shelf: 'look',
		tools: [
			{
				name: 'meridian',
				kind: 'instrument',
				line: 'Meeting times across time zones, on a marine chronometer.',
				more: 'Each city is a bezel ring on the dial; turn one and they all turn, and whatever lines up under the red needle is the same instant everywhere. Behind the numerals runs an enamel sky from midnight through sunrise to dusk, so you can see whose night you are taking, and a glass globe at the centre carries the real line between day and night. One HTML file.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'HTML',
				tags: ['time zones', 'canvas', 'skeuomorphic'],
				site: 'https://oddurs.github.io/meridian/',
				poster: '/media/posters/meridian.webp'
			},
			{
				name: 'titi',
				kind: 'instrument',
				line: 'A graphing calculator with the TI-84 keypad and none of its pixels.',
				more: 'Every key in its real place, 2ND and ALPHA, and the Y= → WINDOW → GRAPH → TRACE loop, on a dot-matrix display drawn one dot per physical pixel, with the grid between the dots left showing, in colour. It works on a phone. A conformance document lists every menu and key the real one has, and a test fails if it claims something the code cannot back up.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['calculator', 'graphing', 'ti-84'],
				site: 'https://oddurs.github.io/titi/',
				poster: '/media/posters/titi.webp'
			},
			{
				name: 'srt-08',
				title: 'SRT-08',
				kind: 'instrument',
				line: 'Sorting algorithms, as a piece of vintage bench equipment.',
				more: 'An amber CRT scope, dot-matrix counters, an analogue VU meter and machined dials, with every comparison and write voiced through Web Audio. Nine programs, bubble to radix, and a slot for your own. One HTML file, no build step, no dependencies.',
				state: { kind: 'live' },
				license: 'none',
				lang: 'JavaScript',
				tags: ['sorting', 'web audio', 'visualiser'],
				site: 'https://oddurs.github.io/srt-08/',
				poster: '/media/posters/srt-08.webp'
			}
		]
	},
	{
		label: 'Explainers',
		shelf: 'read',
		tools: [
			{
				name: 'paradigm-lost',
				title: 'Paradigm Lost',
				kind: 'explainer',
				line: 'One problem, solved eleven ways between 1935 and 2026.',
				more: 'Total the amounts by department and print a report — from cords in a plugboard to an APL one-liner and on to now — with the execution model of each shown working. The usual story is a ladder up to the declarative; read from the top and it falls apart, because we started declarative. Each exhibit animates what its machine actually holds in its hands while it works.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['history of computing', 'paradigms', 'essay'],
				site: 'https://oddurs.github.io/paradigm-lost/',
				poster: '/media/posters/paradigm-lost.webp'
			},
			{
				name: 'einstein',
				kind: 'explainer',
				line: 'A shape that never repeats.',
				more: 'An interactive explainer for the einstein tile — one ordinary-looking polygon that covers an endless floor without the pattern ever repeating. Six scenes, about four minutes; three are driven by scrolling, and the ones where you use your hands are not. Underneath is an exact engine that places tiles on an integer lattice, so a patch six substitutions deep is as precise as the first.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['tiling', 'geometry', 'explainer'],
				site: 'https://oddurs.github.io/einstein/',
				poster: '/media/posters/einstein.webp'
			},
			{
				name: 'quantii',
				title: 'A Field Guide to Quantization',
				short: 'quantii',
				kind: 'explainer',
				line: 'How machine learning models learned to think in fewer bits.',
				more: 'A long-form, interactive explainer on numerical precision in machine learning, from what a floating-point number is to rotation-based outlier suppression, vector codebooks and the precision scaling laws. About 23,500 words, 25 interactive figures and 69 machine-checked references, written to be read straight through by a curious non-specialist and consulted piecemeal by a practitioner.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['machine learning', 'quantization', 'explainer'],
				site: 'https://oddurs.github.io/quantii/',
				poster: '/media/posters/quantii.webp'
			}
		]
	},
	{
		label: 'Research',
		shelf: 'read',
		tools: [
			{
				name: 'session-context',
				title: 'Session Context',
				kind: 'essay',
				line: 'Everything one web page can work out about you.',
				more: 'One page states, in plain English, everything it can observe about the browser, device and person that asked for it, with the raw values behind each finding; a second documents every technique and where browser defences stand. The argument is not that any one measurement is alarming, but that a page which asks for nothing already knows a great deal. A demonstration of surveillance should not itself be surveillance, and the repository shows it is not.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['privacy', 'fingerprinting', 'essay'],
				site: 'https://sessioncontext.org/',
				poster: '/media/posters/session-context.webp'
			},
			{
				name: 'chat-chat',
				kind: 'essay',
				line: 'Two language models talk to each other, and nobody else is in the room.',
				more: 'A harness that pairs models through OpenRouter, logs every turn, stops conversations that have collapsed into agreement, mines the transcripts for what is actually interesting, and publishes the corpus as a site. It asks what these systems do with each other when no person is in the loop. The whole corpus cost $1.28.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['llm', 'corpus', 'openrouter'],
				site: 'https://oddurs.github.io/chat-chat/',
				poster: '/media/posters/chat-chat.webp'
			},
			{
				name: 'portfolio-paycheck-gap',
				title: 'Portfolio–Paycheck Gap',
				short: 'Paycheck Gap',
				kind: 'essay',
				line: 'How far a stock portfolio has outgrown a paycheck since 1980.',
				more: 'A quarterly index comparing the growth of a broad US stock-market investment with the growth of the median full-time paycheck. At 2025 Q3 the market had compounded about 202 times and the paycheck about 4.8, a ratio reported as 4,217 index points. Every figure is reproducible, and the limitations are set out as carefully as the method.',
				state: { kind: 'source' },
				license: 'none',
				lang: 'Python',
				install:
					'git clone https://github.com/oddurs/portfolio-paycheck-gap && cd portfolio-paycheck-gap && make reproduce',
				tags: ['economics', 'index', 'data']
			}
		]
	},
	{
		label: 'Books and courses',
		shelf: 'read',
		tools: [
			{
				name: 'measure-of-the-world',
				title: 'The Measure of the World',
				short: 'Measure of the World',
				kind: 'book',
				line: 'A technical history of the Royal Observatory, Greenwich.',
				more: 'Nearly 350 years, from 1675 to now, told through precision measurement: positions in the sky, local solar time made into a global standard, distance from parallax to the cosmic ladder, and the shape and spin of the Earth itself — with the mathematics, the instruments and the people who built them. 417 pages, set in TeX.',
				state: { kind: 'released', version: '1.3' },
				license: 'CC-BY-4.0',
				lang: 'TeX',
				tags: ['astronomy', 'history', 'book'],
				site: 'https://oddurs.github.io/measure-of-the-world/',
				poster: '/media/posters/measure-of-the-world.webp'
			},
			{
				name: 'joy-of-randomness',
				title: 'The Joy of Randomness',
				kind: 'course',
				line: 'A hands-on course in probability, simulation and chance.',
				more: 'Eighteen chapters in six parts, from the drunkard’s walk and the chain that ranked the internet to epidemics, queues and Markov chain Monte Carlo — narrative first, meant to be discovered rather than memorised, with every idea run as a simulation in Python.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'Python',
				install:
					'git clone https://github.com/oddurs/joy-of-randomness && cd joy-of-randomness && pip install -r requirements.txt && jupyter notebook chapters/',
				tags: ['probability', 'simulation', 'course']
			},
			{
				name: 'a-program-looking-in-the-mirror',
				title: 'A Program Looking in the Mirror',
				short: 'Looking in the Mirror',
				kind: 'course',
				line: 'A small, executable course about quines.',
				more: 'A quine is a program whose only output is its own source: it does not open its file or receive a copy of itself, and yet it already holds everything it needs. An hour, Python 3 and a text editor, starting from the phenomenon and earning the explanation one piece at a time — a doorway into quotation, fixed points and compilers. Every specimen is checked to really be one.',
				state: { kind: 'live' },
				license: 'MIT',
				lang: 'Python',
				tags: ['quines', 'self-reference', 'course'],
				site: 'https://oddurs.github.io/a-program-looking-in-the-mirror/',
				poster: '/media/posters/a-program-looking-in-the-mirror.webp'
			}
		]
	},
	{
		label: 'Web',
		shelf: 'build',
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
				tags: ['build', 'watch', 'monorepo']
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
				tags: ['web framework', 'islands']
			},
			{
				name: 'rockaway',
				kind: 'library',
				line: 'A TUI design system for the web.',
				more: 'Everything sits on a character grid: one cell wide, one row tall, no halves. An integer geometry engine with no DOM in it, four painters over one geometry — glyphs, CSS hairlines, ANSI, plain text — tokens as data with ten themes and a contrast gate, and components on React Aria: Frame, Tree, List, Button, Badge, KeyHint and the fields forms are built from. Boxes close at every zoom because the cell draws them, and a screen still copies as `┌──┐`. Not on npm yet; 0.1.0 is next.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'TypeScript',
				install:
					'git clone https://github.com/oddurs/rockaway && cd rockaway && pnpm install && pnpm site',
				tags: ['design system', 'character grid', 'react'],
				recording: {
					src: '/media/captures/rockaway.webp',
					alt: 'A real screen from the workbench: Frame, Tree, List, Badge, Button and KeyHint at the default density.',
					width: 694,
					height: 360
				}
			},
			{
				name: 'rummy',
				kind: 'library',
				line: 'Real-time 3D scenes drawn as ASCII, in WebGL2.',
				more: 'Takes a raymarched scene, a video or any canvas and draws it as live text, like a terminal with a GPU in it. It shades one sample per character cell rather than per pixel and keeps the shape of an edge rather than flattening it to a brightness ramp, so a full-screen hero costs about as much as a thumbnail. One ES module, no dependencies; it pauses off screen and respects reduced motion.',
				state: { kind: 'source' },
				license: 'MIT',
				lang: 'TypeScript',
				tags: ['webgl', 'text rendering', 'hero backgrounds'],
				site: 'https://oddurs.github.io/rummy/',
				poster: '/media/posters/rummy.webp'
			}
		]
	},
	{
		label: 'Languages and libraries',
		shelf: 'build',
		tools: [
			{
				name: 'nether-c',
				title: 'Nether C',
				kind: 'language',
				line: 'A C dialect in which nothing runs.',
				more: 'A program is buried, not executed: burial evaluates it as far as the world allows and leaves a trace — a complete, immutable, content-addressed record of what happened — and the holes where it asked the world a question nobody has answered yet. Answering one is a separate, later act called exhumation, and it makes a new trace. That is the whole language; the rest is consequence.',
				state: { kind: 'released', version: '0.2.0' },
				license: 'Unlicense',
				lang: 'Rust',
				tags: ['language design', 'provenance'],
				site: 'https://oddurs.github.io/nether-c/',
				poster: '/media/posters/nether-c.webp'
			},
			{
				name: 'oath',
				kind: 'language',
				line: 'A language where a definition is a promise.',
				more: 'In most languages a function is its name, and in Unison the hash of its body. In Oath it is the hash of its specification — the type, the laws it must satisfy, the examples it must reproduce — and any number of implementations compete to keep it; one that demonstrably does is sworn. Design stage: `oath run` and `oath swear` arrive with v0.1.',
				state: { kind: 'design' },
				license: 'MIT',
				lang: 'Rust',
				tags: ['language design', 'specification']
			},
			{
				name: 'subcell',
				kind: 'library',
				line: 'A terminal renderer where resolution is a runtime property.',
				more: 'A terminal cell offers sixteen million colours and very few pixels, so subcell spends colour precision to buy back spatial precision: the screen is described in continuous coordinates and quantised down to whatever this terminal can actually draw, and nothing is allowed to assume a tier. Pre-release: the pure, tested half is built, and the terminal I/O half is next.',
				state: { kind: 'source', version: '0.0.1' },
				license: 'Apache-2.0',
				lang: 'Rust',
				install:
					'git clone https://github.com/oddurs/subcell && cd subcell && cargo run --bin subcell-probe',
				tags: ['rendering', 'glyphs', 'ratatui']
			}
		]
	}
];
