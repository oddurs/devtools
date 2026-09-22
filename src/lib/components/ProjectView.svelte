<script lang="ts">
	import { AppIcon, Badge, Command } from '$lib/design';
	import { owner } from '$lib/data/site';
	import { prerelease, stateLabel, type Project } from '$lib/data/projects';
	import Demo from './Demo.svelte';

	let { project }: { project: Project } = $props();
	const source = $derived(`https://github.com/${owner}/${project.name}`);
</script>

<article class="project">
	<!--
		The tool first. The name and the line sit on one row above the window,
		and everything else — what it is written in, what it costs to install,
		where the source is — goes under it, because those are reference rather
		than the argument.
	-->
	<header>
		<h1><AppIcon name={project.name} size="m" />{project.name}</h1>
		<p class="line">{project.line}</p>
		{#if prerelease(project)}<Badge tone="amber">pre-release</Badge>{/if}
	</header>

	{#if prerelease(project)}
		<p class="notice">
			<strong>Pre-release.</strong> Designed in the open: the documentation comes first, so the API can
			be argued with before it is built. There is nothing to install yet, and what you see is the design,
			not a program running.
		</p>
	{/if}

	<Demo {project} />

	<p class="more">{project.more}</p>

	<div class="facts">
		{#if project.install}
			<div class="install"><Command command={project.install} /></div>
		{/if}
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
		{#if project.site}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
			<a class="out" href={project.site}>Site<span aria-hidden="true">↗</span></a>
		{/if}
	</div>
</article>

<style>
	.project {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-6);
		max-width: 68rem;
	}
	/* The name and the line on one row: the line is the argument, so it gets
	   the width, and the name stays small enough not to shout over it. */
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2) var(--space-4);
	}
	h1 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin: 0;
		font-size: 1.75rem;
		font-weight: 600;
		letter-spacing: -0.024em;
		line-height: 1.1;
	}
	.line {
		flex: 1 1 22rem;
		margin: 0;
		color: var(--ink);
		font-size: var(--size-lead);
		line-height: 1.4;
		text-wrap: balance;
	}
	.notice {
		margin: 0;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-s);
		background: color-mix(in oklab, var(--amber) 6%, transparent);
		box-shadow: inset 2px 0 0 color-mix(in oklab, var(--amber) 55%, transparent);
		color: var(--muted);
		font-size: var(--size-m);
		text-wrap: pretty;
	}

	.more {
		margin: 0;
		max-width: var(--measure);
		color: var(--muted);
		text-wrap: pretty;
	}

	/* Under the demo: what it is, what it costs, where it lives. One row. */
	.facts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-6);
		font-size: var(--size-m);
	}
	.install {
		flex: 1 1 22rem;
		min-width: 0;
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
</style>
