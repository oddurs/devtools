<!--
	The design system, documented by using it. Values are read back from the
	live stylesheet, so this page cannot drift from what the site actually is.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { AppIcon, Badge, Choice, Command, Kbd, identity, tints } from '$lib/design';
	import Meta from '$lib/components/Meta.svelte';
	import { groups } from '$lib/data/projects';
	import { contrast } from '$lib/design/color';
	import { scheme, theme } from '$lib/terminal/theme';
	import { ghosttyTheme } from '$lib/terminal/themes';
	import Window from '$lib/terminal/Window.svelte';
	import Session from '$lib/terminal/Session.svelte';

	const ground = ['paper', 'lifted', 'raised', 'rule', 'mark'];
	const ink = ['ink', 'muted', 'faint'];
	// State colours are tints (tokens.css), named by the job they do.
	const states = ['amber', 'mint'];
	const stateJob: Record<string, string> = { amber: 'not ready yet', mint: 'released, healthy' };
	const sizes = ['title', 'lead', 'body', 'm', 's', 'xs'];

	let values = $state<Record<string, string>>({});
	onMount(() => {
		const css = getComputedStyle(document.documentElement);
		for (const n of [...ground, ...ink]) values[n] = css.getPropertyValue(`--${n}`).trim();
		for (const n of states) values[n] = `tint ${n} · ${stateJob[n]}`;
	});

	let choice = $state<'one' | 'two'>('one');
	const ansi = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

	// What a program printing all sixteen would put on screen.
	const colours = [0, 1]
		.map((b) =>
			[0, 1, 2, 3, 4, 5, 6, 7]
				.map((i) => `\x1b[${b ? 90 + i : 30 + i}m${(b ? 'bright ' : '') + ansi[i]}\x1b[0m`)
				.join('  ')
		)
		.join('\n');

	const exported = ghosttyTheme(scheme);
	let copied = $state(false);
	async function copyTheme() {
		try {
			await navigator.clipboard.writeText(exported);
			copied = true;
			setTimeout(() => (copied = false), 1400);
		} catch {
			// No clipboard: the text below is selectable.
		}
	}
</script>

<Meta
	name="system"
	description="The design system behind the site: its tokens, components, marks and terminal scheme, documented by using them."
	path="/system"
/>

<article>
	<h1>System</h1>
	<p class="lead">
		Greys carry everything. Colour is one system, twelve tints held at one lightness: they mark the
		tools, and two of them mark state. Interface is set in the text face, and monospace is kept for
		what a terminal said.
	</p>

	<h2>Colour</h2>
	{#each [['ground', ground], ['ink', ink], ['state', states]] as const as [label, names] (label)}
		<h3>{label}</h3>
		<div class="swatches">
			{#each names as n (n)}
				<div class="swatch">
					<span class="chip" style="background: var(--{n})"></span>
					<span class="name">--{n}</span>
					<code>{values[n] ?? ''}</code>
				</div>
			{/each}
		</div>
	{/each}

	<h2>Type</h2>
	{#each sizes as s (s)}
		<div class="type">
			<code>--size-{s}</code>
			<span style="font-size: var(--size-{s})">A system monitor you can rewind.</span>
		</div>
	{/each}

	<h2>Components</h2>
	<div class="row">
		<Choice
			label="Example"
			bind:value={choice}
			options={[
				{ value: 'one', label: 'screens' },
				{ value: 'two', label: 'session' }
			]}
		/>
		<span class="kbds"><Kbd>j</Kbd><Kbd>k</Kbd><Kbd>↵</Kbd><Kbd>tab</Kbd></span>
		<span class="kbds"
			><Badge tone="amber">pre-release</Badge><Badge tone="mint">released</Badge><Badge
				>from source</Badge
			></span
		>
	</div>
	<div class="row"><Command command="cargo install --git https://github.com/oddurs/poptop" /></div>

	<h2>Marks</h2>
	<p>
		Every app has a mark: a Lucide icon on a tile of its own tint. The tints are twelve hues 30°
		apart in OKLCH, all at one lightness and chroma, so no mark outshouts another. In the rail they
		rest in grey and take their tint when current or pointed at.
	</p>
	<div class="tints">
		{#each tints as t (t)}
			<div class="tint">
				<span class="chip" style="background: oklch(var(--tint-l) var(--tint-c) var(--tint-{t}))"
				></span>
				<span class="name">{t}</span>
			</div>
		{/each}
	</div>
	{#each groups as group (group.label)}
		<h3>{group.label}</h3>
		<div class="marks">
			{#each group.projects as p (p.name)}
				<div class="app">
					<AppIcon name={p.name} />
					<span class="name">{p.name}</span>
					<span class="why">{identity(p.name).tint} · {identity(p.name).why}</span>
				</div>
			{/each}
		</div>
	{/each}
	<div class="row sizes">
		<AppIcon name="poptop" size="s" /><AppIcon name="poptop" size="m" /><AppIcon
			name="poptop"
			size="l"
		/><AppIcon name="poptop" size="s" muted />
		<span class="why">s · m · l · muted</span>
	</div>

	<h2>Terminal</h2>
	<p>
		Every terminal on the site draws the <strong>{scheme.name}</strong> scheme: the greys above for
		ground and text, and for the six ANSI hues, six of the twelve tints (rose, green, amber, sky,
		orchid, teal), normal at the marks' lightness and brights lighter. The face, size, cell height
		and padding are the Ghostty config's, read by <code>npm run theme</code>:
		{theme.font.family}
		{theme.font.size}px, padding {theme.padding.x}×{theme.padding.y}. The scheme is chosen in
		<code>src/lib/terminal/theme.ts</code>.
	</p>
	<div class="ansi">
		{#each theme.palette as c, i (i)}
			<div class="swatch">
				<span class="chip" style="background: {c}"></span>
				<span class="name">{i < 8 ? '' : 'bright '}{ansi[i % 8]}</span>
				<code>{c} · {contrast(c, theme.background).toFixed(1)}:1</code>
			</div>
		{/each}
	</div>
	<Window title="~/Code/demo — fish">
		<Session
			tool="demo"
			autoplay={false}
			steps={[
				{ cmd: 'demo --colours   # the sixteen, as a program would print them', out: colours },
				{ cmd: 'demo box', out: '╭ pane ──────────╮\n│ frames recede │\n╰───────────────╯' }
			]}
		/>
	</Window>

	<h3>As a Ghostty theme</h3>
	<p>
		Save as <code>~/.config/ghostty/themes/{scheme.name}</code>, then
		<code>theme = {scheme.name}</code>.
	</p>
	<div class="export">
		<button type="button" onclick={copyTheme}>{copied ? 'copied' : 'copy'}</button>
		<pre>{exported}</pre>
	</div>
</article>

<style>
	article {
		max-width: 52rem;
	}
	h1 {
		margin: 0;
		font-size: var(--size-title);
		font-weight: 600;
		letter-spacing: -0.028em;
		line-height: 1.1;
	}
	.lead {
		margin: var(--space-3) 0 0;
		color: var(--muted);
		font-size: var(--size-lead);
		line-height: 1.45;
	}
	h2 {
		margin: var(--space-16) 0 var(--space-4);
		font-size: 1.3125rem;
		font-weight: 600;
		letter-spacing: -0.016em;
	}
	h3 {
		margin: var(--space-6) 0 var(--space-3);
		color: var(--faint);
		font-size: var(--size-s);
		font-weight: 400;
	}
	.swatches,
	.ansi {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		gap: var(--space-4);
	}
	.ansi {
		grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
		margin-bottom: var(--space-8);
	}
	.swatch {
		display: grid;
		gap: 0.125rem;
		font-size: var(--size-s);
	}
	.chip {
		height: 3rem;
		margin-bottom: var(--space-2);
		border-radius: var(--radius-s);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.06);
	}
	.swatch code {
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.tints {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
		gap: var(--space-3);
		margin-block: var(--space-6);
	}
	.tint {
		display: grid;
		font-size: var(--size-xs);
		color: var(--muted);
	}
	.tint .chip {
		height: 1.75rem;
	}
	.marks {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: var(--space-3) var(--space-6);
	}
	.app {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: var(--space-3);
		align-items: center;
	}
	.app :global(.mark) {
		grid-row: span 2;
	}
	.app .name {
		font-size: var(--size-m);
		line-height: 1.2;
	}
	.why {
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.sizes {
		margin-top: var(--space-8);
		gap: var(--space-3);
	}
	.type {
		display: grid;
		grid-template-columns: 8rem 1fr;
		align-items: baseline;
		gap: var(--space-4);
		padding-block: var(--space-2);
	}
	.type code {
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-6);
		margin-bottom: var(--space-4);
	}
	.kbds {
		display: flex;
		gap: 0.375rem;
	}
	p {
		color: var(--muted);
	}
	p strong {
		color: var(--ink);
		font-weight: 500;
	}
	.export {
		position: relative;
		border-radius: var(--radius-s);
		background: var(--raised);
		box-shadow: inset 0 0 0 1px var(--rule);
	}
	.export pre {
		margin: 0;
		padding: var(--space-4);
		overflow-x: auto;
		color: var(--muted);
		font: var(--size-xs) / 1.6 var(--mono);
	}
	.export button {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.export button:hover {
		color: var(--ink);
	}
</style>
