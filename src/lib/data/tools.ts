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
				tags: ['ratatui', 'monitoring']
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
				tags: ['disk', 'caches', 'macos']
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
				tags: ['homebrew', 'inventory', 'macos']
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
				tags: ['git', 'worktree', 'ratatui']
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
				tags: ['github', 'pull requests', 'ci']
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
				tags: ['llm context', 'mcp', 'search']
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
				tags: ['portfolio', 'git', 'github', 'ratatui']
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
				tags: ['editor']
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
				tags: ['cairn', 'backlog', 'ratatui']
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
				tags: ['notes', 'markdown', 'zettelkasten']
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
				tags: ['hacker news', 'reader']
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
				tags: ['rss', 'atom', 'ratatui']
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
				tags: ['dotfiles', 'setup', 'macos']
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
				tags: ['audio', 'synthesis', 'macos']
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
				tags: ['orbital mechanics', 'monte carlo']
			}
		]
	},
	{
		label: 'Art',
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
			}
		]
	}
];
