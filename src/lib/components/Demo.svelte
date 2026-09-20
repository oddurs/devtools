<!--
	The tool, running. Up to three ways in: a recording of it running, its
	real screens, both told as the screens studio's four-beat story (what is it, how do
	I begin, what is it like, what is it good at), or a session you can type
	into. The recording's chapters are the screens' beats, so the beats and
	their captions mean the same thing in either.
-->
<script lang="ts">
	import { Choice, Kbd } from '$lib/design';
	import Recording from '$lib/terminal/Recording.svelte';
	import Screens from '$lib/terminal/Screens.svelte';
	import Session from '$lib/terminal/Session.svelte';
	import Window from '$lib/terminal/Window.svelte';
	import { prerelease, stills, views, type Project, type View } from '$lib/data/projects';

	let { project }: { project: Project } = $props();

	const shots = $derived(stills(project));
	const available = $derived(views(project));

	let view = $state<View>('screens');
	let index = $state(0);
	let chapter = $state(-1);
	let player = $state<Recording>();
	// Set when a person picks the session, so it takes the keyboard; never on
	// page load, where it would swallow j and k.
	let chosen = $state(false);

	// A new project starts at its first screen, or its session if it has none.
	$effect.pre(() => {
		view = available[0] ?? 'screens';
		index = 0;
		chapter = -1;
		chosen = false;
	});

	const shot = $derived(shots[index]);
	// Real terminal screens sit in a terminal; a poster of a web page does not.
	const isTerminal = $derived(project.screens.length > 0);
	// The row is there when there is something in it to choose: another view,
	// or more than one screen or chapter. Key hints alone are not a reason;
	// a session says its keys in its caption.
	const hasControls = $derived(
		available.length > 1 ||
			(view === 'screens' && shots.length > 1) ||
			(view === 'recording' && (project.cast?.markers.length ?? 0) > 1)
	);
	const viewLabel: Record<View, string> = {
		recording: 'recording',
		screens: 'screens',
		session: 'session'
	};
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
			chosen = true;
		} else return;
		e.preventDefault();
	}
</script>

<svelte:window {onkeydown} />

<section class="demo" aria-label="{project.name}, running">
	{#if hasControls}
		<div class="controls">
			{#if available.length > 1}
				<Choice
					label="Show"
					bind:value={view}
					onchange={() => (chosen = true)}
					options={available.map((v) => ({ value: v, label: viewLabel[v] }))}
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

			<span class="keys">
				{#if view === 'recording'}
					<Kbd>space</Kbd> play <Kbd>←</Kbd><Kbd>→</Kbd> chapters
				{:else if view === 'screens' && shots.length > 1}
					<Kbd>←</Kbd><Kbd>→</Kbd>
				{:else if view === 'session'}
					<Kbd>↵</Kbd> next <Kbd>tab</Kbd> complete
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
		</p>
	{:else if view === 'session'}
		{#key project.name}
			<Window title="~/Code/{project.name} — fish">
				<Session tool={project.name} steps={project.demo} focus={chosen} />
			</Window>
		{/key}
		<p class="caption">
			{#if prerelease(project)}
				The planned API, from the {project.name} design docs: none of it runs yet.
			{:else}
				Commands and output from the {project.name} readme, replayed.
			{/if}
			<span class="how"
				><Kbd>↵</Kbd> runs the next <Kbd>tab</Kbd> completes <code>help</code> lists them</span
			>
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
	.how {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
		margin-left: 0.25rem;
		font-size: var(--size-s);
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
