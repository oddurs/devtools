<!--
	The tool, running. Two ways in: a recording of it running and its real
	screens, both told as the screens studio's four-beat story (what is it, how
	do I begin, what is it like, what is it good at). The recording's chapters
	are the screens' beats, so the beats and their captions mean the same thing
	in either.

	Two more, for tools the terminal cannot carry: a gallery, for a tool whose
	output is pictures, and a sample, for one you hear.

	A tool nobody has photographed yet says so, rather than leaving a hole.
-->
<script lang="ts">
	import { Choice, Kbd } from '$lib/design';
	import Gallery from '$lib/terminal/Gallery.svelte';
	import Recording from '$lib/terminal/Recording.svelte';
	import Screens from '$lib/terminal/Screens.svelte';
	import Sound from '$lib/terminal/Sound.svelte';
	import Window from '$lib/terminal/Window.svelte';
	import { MEDIA, prerelease, stills, views, type Project, type View } from '$lib/data/projects';

	let { project }: { project: Project } = $props();

	const shots = $derived(stills(project));
	const available = $derived(views(project));
	// A capture taken by hand on the machine the tool runs on, rather than in
	// the studio. The output is as real either way; the page says which.
	const fromDesk = $derived(project.source === 'desk');

	let view = $state<View>('screens');
	let index = $state(0);
	let chapter = $state(-1);
	let player = $state<Recording>();
	// Expanded: the demo takes the page. Nothing else changes about it — the
	// same window, the same controls, more room — so it costs one flag.
	let expanded = $state(false);

	// A new project starts at whichever view it leads with.
	$effect.pre(() => {
		view = available[0] ?? 'screens';
		index = 0;
		chapter = -1;
		expanded = false;
	});

	const shot = $derived(shots[index]);
	// Real terminal screens sit in a terminal; a poster of a web page does not.
	const isTerminal = $derived(project.screens.length > 0);
	// The row is there when there is something in it to choose: another view,
	// or more than one screen or chapter. Key hints alone are not a reason.
	const hasControls = $derived(
		available.length > 1 ||
			(view === 'screens' && shots.length > 1) ||
			(view === 'recording' && (project.cast?.markers.length ?? 0) > 1)
	);
	// The recording's chapters, with the caption of the screenshot each one is.
	const chapters = $derived(
		(project.cast?.markers ?? []).map(([, beat]) => ({
			beat,
			caption: project.screens.find((s) => s.beat === beat)?.caption ?? ''
		}))
	);
	const chapterCaption = $derived(chapters[chapter]?.caption);
	const beatLabel: Record<string, string> = {
		hero: 'at a glance',
		start: 'getting started',
		use: 'in use',
		depth: 'in depth'
	};

	function step(by: number) {
		if (view === 'recording') return player?.step(by);
		if (view !== 'screens' || shots.length < 2) return;
		index = (index + by + shots.length) % shots.length;
	}

	function onkeydown(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (t.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey)
			return;
		if (e.key === 'ArrowRight' || e.key === 'l') step(1);
		else if (e.key === 'ArrowLeft' || e.key === 'h') step(-1);
		else if (e.key === ' ' && view === 'recording' && !t.closest('button, [role="slider"]'))
			player?.toggle();
		else if (e.key === 't' && available.length > 1) {
			view = available[(available.indexOf(view) + 1) % available.length];
		} else if (e.key === 'f' && available.length) expanded = !expanded;
		else if (e.key === 'Escape' && expanded) expanded = false;
		else return;
		e.preventDefault();
	}
</script>

<svelte:window {onkeydown} />

<section class="demo" class:expanded aria-label="{project.name}, running">
	{#if hasControls || available.length}
		<div class="controls">
			{#if available.length > 1}
				<Choice
					label="Show"
					bind:value={view}
					options={available.map((v) => ({ value: v, label: MEDIA[v].label }))}
				/>
			{/if}

			{#if view === 'recording' && chapters.length > 1}
				<div class="beats" role="tablist" aria-label="Chapters">
					{#each chapters as c, i (c.beat)}
						<button
							type="button"
							role="tab"
							aria-selected={i === chapter}
							onclick={() => player?.jump(i)}>{beatLabel[c.beat] ?? c.beat}</button
						>
					{/each}
				</div>
			{:else if view === 'screens' && shots.length > 1}
				<div class="beats" role="tablist" aria-label="Screens">
					{#each shots as s, i (s.src)}
						<button type="button" role="tab" aria-selected={i === index} onclick={() => (index = i)}
							>{beatLabel[s.beat] ?? s.beat}</button
						>
					{/each}
				</div>
			{/if}

			<button
				type="button"
				class="expand"
				aria-pressed={expanded}
				onclick={() => (expanded = !expanded)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					{#if expanded}
						<path d="M4 14h6v6" /><path d="M20 10h-6V4" /><path d="M14 10l7-7" /><path
							d="M3 21l7-7"
						/>
					{:else}
						<path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path
							d="M3 21l7-7"
						/>
					{/if}
				</svg>
				{expanded ? 'close' : 'expand'}
			</button>

			<span class="keys">
				{#if view === 'recording'}
					<Kbd>space</Kbd> play <Kbd>←</Kbd><Kbd>→</Kbd> chapters
				{:else if view === 'screens' && shots.length > 1}
					<Kbd>←</Kbd><Kbd>→</Kbd>
				{:else if view === 'gallery'}
					<Kbd>←</Kbd><Kbd>→</Kbd> in a plate
				{/if}
			</span>
		</div>
	{/if}

	{#if view === 'recording' && project.cast}
		{#key project.name}
			<Window title="{project.name} — fish">
				<Recording cast={project.cast} bind:chapter bind:this={player} />
			</Window>
		{/key}
		<p class="caption">
			{#if chapterCaption}
				{#each chapterCaption.split('`') as part, i (i)}{#if i % 2}<code>{part}</code
						>{:else}{part}{/if}{/each}
			{:else}
				Recorded from a fresh build of the latest source, played back in the site's terminal theme.
				What it prints is what it printed.
			{/if}
		</p>
	{:else if view === 'screens' && shot}
		<Window
			title={isTerminal ? `${project.name} — fish` : project.name}
			background={isTerminal ? (project.screenBackground ?? undefined) : undefined}
		>
			<Screens {shots} {index} />
		</Window>
		<p class="caption">
			{#each shot.caption.split('`') as part, i (i)}{#if i % 2}<code>{part}</code
					>{:else}{part}{/if}{/each}
			{#if fromDesk}<span class="where"
					>Captured on a Mac — {project.name} does not run in the studio's Linux container — and shown
					in the site's terminal.</span
				>{/if}
		</p>
	{:else if view === 'gallery'}
		<Gallery plates={project.gallery} label="What {project.name} made" />
		<p class="caption">
			{project.gallery.length} outputs of {project.name}, made in the same run as the screens above.
			Click one to see it whole.
		</p>
	{:else if view === 'audio'}
		<Sound samples={project.audio} label="{project.name}, heard" />
		<p class="caption">
			Recorded from {project.name} itself. Nothing plays until you ask it to.
		</p>
	{:else if !prerelease(project)}
		<!--
			Nothing has been shot of this one yet. Say so plainly: a page that
			simply stops after its paragraph reads like a mistake. A pre-release
			says it in its own notice instead, so it is not said twice.
		-->
		<p class="nothing">
			Not photographed yet. Every page here shows the tool running, and this one has not been
			through the studio — so for now it is the words and the source.
		</p>
	{/if}
</section>

<style>
	/* The controls belong to the window and sit close to it; the caption is a
	   step further away, because it is about what the window shows. */
	.demo {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	/* Expanded, the demo is the page: the rail and the rest of the article are
	   behind it, and the ground drops a shade so the window still floats. */
	.demo.expanded {
		position: fixed;
		inset: 0;
		z-index: 20;
		grid-template-rows: auto minmax(0, 1fr) auto;
		padding: var(--space-6) clamp(1rem, 3vw, 2.5rem) var(--space-8);
		background: var(--raised);
		overflow: auto;
	}
	.demo.expanded .caption {
		max-width: none;
	}

	/* The expand control sits at the end of the row, before the key hints. */
	.expand {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		margin-left: auto;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: var(--faint);
		font-size: var(--size-s);
		transition: color var(--quick);
	}
	.expand:hover,
	.expand[aria-pressed='true'] {
		color: var(--ink);
	}
	.expand svg {
		width: 0.8125rem;
		height: 0.8125rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	/* With the expand control taking the row's end, the key hints follow it. */
	.expand + .keys {
		margin-left: var(--space-4);
	}
	.controls {
		margin-bottom: var(--space-3);
	}
	.caption {
		margin-top: var(--space-4);
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-6);
		min-height: 2rem;
	}
	.beats {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}
	.beats button {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: var(--faint);
		font-size: var(--size-s);
		transition: color var(--quick);
	}
	.beats button:hover {
		color: var(--muted);
	}
	.beats button[aria-selected='true'] {
		color: var(--ink);
	}
	/* The keys are said when they could be used: the pointer over the demo,
	   or focus in it. The rest of the time the chapters have the row. */
	.keys {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		margin-left: auto;
		color: var(--faint);
		font-size: var(--size-xs);
		opacity: 0;
		transition: opacity 200ms var(--ease);
	}
	.demo:hover .keys,
	.demo:focus-within .keys {
		opacity: 1;
	}
	/* Where a picture came from, when it is not the studio. Said once, under
	   the caption, rather than repeated on every beat. */
	.where {
		display: block;
		margin-top: var(--space-2);
		color: var(--rule);
		font-size: var(--size-s);
	}
	/* A page with nothing to show says so, quietly, in the window's place. */
	.nothing {
		margin: 0;
		padding: var(--space-8) var(--space-6);
		border-radius: var(--radius-m);
		background: var(--lifted);
		color: var(--faint);
		font-size: var(--size-m);
		text-align: center;
		text-wrap: pretty;
	}
	.caption {
		max-width: var(--measure);
		color: var(--faint);
		font-size: var(--size-m);
		text-wrap: pretty;
	}
	@media (max-width: 40rem) {
		.keys {
			display: none;
		}
	}
</style>
