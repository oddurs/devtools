<script lang="ts">
	import { resolve } from '$app/paths';
	import { AppIcon, Badge, Command } from '$lib/design';
	import { owner } from '$lib/data/site';
	import { identity } from '$lib/design/identity';
	import {
		label,
		neighbours,
		prerelease,
		stateLabel,
		title,
		type Project
	} from '$lib/data/projects';
	import { page } from '$lib/data/templates';
	import Demo from './Demo.svelte';

	let { project }: { project: Project } = $props();
	const source = $derived(`https://github.com/${owner}/${project.name}`);
	const around = $derived(neighbours(project.name));
	// How this kind of thing is shown: which comes first, and what to press.
	const t = $derived(page(project));
</script>

<article class="project">
	<!--
		What it is, then how to get it, then the tool running. The text is short
		enough to read before the window, and the window has room to be the
		biggest thing on the page once you reach it. A thing judged by looking at
		it — a game, a map — turns that round: the picture comes straight after
		its name, and the words follow.
	-->
	<header>
		<h1><AppIcon name={project.name} size="l" />{title(project)}</h1>
		{#if prerelease(project)}<Badge tone="amber">pre-release</Badge>{/if}
	</header>

	{#if t.lead === 'picture'}
		<div class="demo-slot first"><Demo {project} go={t.go} /></div>
	{/if}

	<div class="about">
		<p class="line">{project.line}</p>
		<!-- A command or a glyph in backticks is set as code, as the captions are. -->
		<p class="more">
			{#each project.more.split('`') as part, i (i)}{#if i % 2}<code>{part}</code
					>{:else}{part}{/if}{/each}
		</p>
	</div>

	{#if prerelease(project)}
		<p class="notice">
			<strong>Pre-release.</strong> Designed in the open: the documentation comes first, so the API can
			be argued with before it is built. There is nothing to install yet, and what you see is the design,
			not a program running.
		</p>
	{/if}

	<div class="facts">
		{#if t.go}
			<!-- The way in, for a thing you go to: in its own colour, the one
			     loud thing on the page. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
			<a class="go" href={t.go.href} style="--h: var(--tint-{identity(project.name).tint})"
				>{t.go.verb}<span aria-hidden="true">↗</span></a
			>
		{:else if project.install}
			<div class="install"><Command command={project.install} /></div>
		{/if}
		<!-- The facts and the ways out wrap as one, so a narrow page never
		     strands the links on a line of their own. -->
		<div class="about-it">
			<p class="meta">
				<!-- A pre-release says so in the badge above; not twice. -->
				{#if !prerelease(project)}
					<span class="figures" class:released={project.state.kind === 'released'}
						>{stateLabel(project.state)}</span
					>
				{/if}
				<span>{project.lang}</span>
				{#if project.license !== 'none'}<span>{project.license}</span>{/if}
			</p>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
			<a class="out" href={source}>Source<span aria-hidden="true">↗</span></a>
			{#if project.site && !t.go}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
				<a class="out" href={project.site}>Site<span aria-hidden="true">↗</span></a>
			{/if}
		</div>
	</div>

	{#if t.lead === 'words'}
		<div class="demo-slot"><Demo {project} go={t.go} /></div>
	{/if}

	<!-- Where to go when this one is read. The rail is across the page and
	     the index is a click away, but the thing nearest to hand should be
	     the next tool along — which is also what j and k do. -->
	<nav class="along" aria-label="The tools either side of this one">
		<a class="back" href={resolve('/[name]', { name: around.prev.name })}>
			<span class="dir"><span aria-hidden="true">←</span> previous</span>
			<span class="who"><AppIcon name={around.prev.name} size="s" />{label(around.prev)}</span>
		</a>
		<a class="on" href={resolve('/[name]', { name: around.next.name })}>
			<span class="dir">next <span aria-hidden="true">→</span></span>
			<span class="who">{label(around.next)}<AppIcon name={around.next.name} size="s" /></span>
		</a>
	</nav>
</article>

<style>
	/* One column, read top to bottom. The gaps are the structure: tight
	   inside a group, wider between groups, widest before the window, which
	   is where the page changes from reading to watching. */
	.project {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		max-width: 68rem;
	}
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-4);
	}
	h1 {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin: 0;
		font-size: var(--size-title);
		font-weight: 600;
		letter-spacing: -0.028em;
		line-height: 1.1;
	}
	.about {
		display: grid;
		gap: var(--space-3);
		max-width: var(--measure);
		margin-top: var(--space-6);
	}
	.line {
		margin: 0;
		color: var(--ink);
		font-size: var(--size-lead);
		line-height: 1.45;
		text-wrap: balance;
	}
	.more {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
		text-wrap: pretty;
	}
	.more code {
		color: var(--ink);
	}
	.notice {
		max-width: var(--measure);
		margin: var(--space-6) 0 0;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-s);
		background: color-mix(in oklab, var(--amber) 6%, transparent);
		box-shadow: inset 2px 0 0 color-mix(in oklab, var(--amber) 55%, transparent);
		color: var(--muted);
		font-size: var(--size-m);
		text-wrap: pretty;
	}
	.notice strong {
		color: var(--amber);
		font-weight: 500;
	}

	/* How to get it and where it lives, one row. */
	.facts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-6);
		max-width: 52rem;
		margin-top: var(--space-8);
		font-size: var(--size-m);
	}
	.install {
		flex: 1 1 22rem;
		min-width: 0;
	}
	.about-it {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-6);
	}
	/* One line of facts, one separator: a dot the page draws, not typed. */
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin: 0;
		color: var(--faint);
		font-size: var(--size-s);
	}
	.meta > :global(*) + :global(*)::before {
		content: '·';
		margin-inline: 0.5em;
		color: var(--rule);
	}
	.released {
		color: var(--mint);
	}
	/* A way out of the page, said quietly: no underline until it is pointed at. */
	.out {
		display: inline-flex;
		gap: 0.25em;
		color: var(--muted);
		text-decoration-color: transparent;
		transition:
			color var(--quick),
			text-decoration-color var(--quick);
	}
	.out span {
		color: var(--faint);
		font-size: 0.85em;
		transition: transform var(--quick) var(--ease);
	}
	.out:hover {
		color: var(--ink);
		text-decoration-color: var(--faint);
	}
	.out:hover span {
		transform: translate(1px, -1px);
	}

	/* Reading stops and watching starts: the widest gap on the page, though
	   less of it on a phone, where every row is already a long way down. */
	.demo-slot {
		min-width: 0;
		margin-top: clamp(var(--space-8), 5vw, var(--space-12));
	}
	/* Straight under the name, when the picture leads; the words then sit a
	   step below it rather than the widest gap on the page. */
	.demo-slot.first {
		margin-top: var(--space-6);
	}
	.demo-slot.first + .about {
		margin-top: var(--space-8);
	}

	/* The main button: the tool's own tint, dark ink on it. */
	.go {
		display: inline-flex;
		align-items: center;
		gap: 0.375em;
		padding: 0.5rem 1.125rem;
		border-radius: 999px;
		background: oklch(var(--tint-l) var(--tint-c) var(--h));
		color: var(--paper);
		font-weight: 600;
		text-decoration: none;
		transition:
			filter var(--quick),
			transform var(--quick) var(--ease);
	}
	.go span {
		font-size: 0.85em;
		font-weight: 400;
	}
	.go:hover {
		filter: brightness(1.08);
	}
	.go:active {
		transform: translateY(1px);
	}

	.along {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		margin-top: var(--space-12);
		padding-top: var(--space-4);
		box-shadow: inset 0 1px 0 var(--rule);
	}
	.along a {
		display: grid;
		gap: 0.25rem;
		padding: var(--space-2);
		border-radius: var(--radius-s);
		color: var(--muted);
		text-decoration: none;
		transition:
			color var(--quick),
			background var(--quick);
	}
	.along a:hover {
		background: var(--lifted);
		color: var(--ink);
	}
	.along .on {
		text-align: right;
	}
	.dir {
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.who {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--ink);
		font-size: var(--size-m);
	}
</style>
