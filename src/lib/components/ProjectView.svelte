<script lang="ts">
	import { AppIcon, Badge, Command } from '$lib/design';
	import { owner } from '$lib/data/site';
	import { prerelease, stateLabel, type Project } from '$lib/data/projects';
	import Demo from './Demo.svelte';

	let { project }: { project: Project } = $props();
	const source = $derived(`https://github.com/${owner}/${project.name}`);
</script>

<article class="project">
	<header>
		<div class="title">
			<h1><AppIcon name={project.name} size="l" />{project.name}</h1>
			<p class="meta">
				{#if prerelease(project)}
					<Badge tone="amber">pre-release</Badge>
				{:else}
					<span class="figures" class:released={project.state.kind === 'released'}
						>{stateLabel(project.state)}</span
					>
				{/if}
				<span>{project.lang}</span>
				{#if project.license !== 'none'}<span>{project.license}</span>{/if}
			</p>
		</div>
		<p class="line">{project.line}</p>
		<p class="more">{project.more}</p>
		{#if prerelease(project)}
			<p class="notice">
				<strong>Pre-release.</strong> Designed in the open: the documentation comes first, so the API
				can be argued with before it is built. There is nothing to install yet, and what the demo shows
				is the design, not a program running.
			</p>
		{/if}
		<div class="actions">
			{#if project.install}
				<div class="install"><Command command={project.install} /></div>
			{/if}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
			<a class="out" href={source}>Source<span aria-hidden="true">↗</span></a>
			{#if project.site}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external -->
				<a class="out" href={project.site}>Site<span aria-hidden="true">↗</span></a>
			{/if}
		</div>
	</header>

	<Demo {project} />
</article>

<style>
	.project {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-12);
		max-width: 68rem;
	}
	header {
		max-width: var(--measure);
	}
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-6);
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
	.meta > :global(.badge) + :global(*)::before {
		margin-left: 0.625em;
	}
	.released {
		color: var(--mint);
	}
	.line {
		margin: var(--space-4) 0 0;
		color: var(--ink);
		font-size: var(--size-lead);
		line-height: 1.45;
		text-wrap: balance;
	}
	.more {
		margin: var(--space-3) 0 0;
		color: var(--muted);
		text-wrap: pretty;
	}
	.notice {
		margin: var(--space-4) 0 0;
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
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-6);
		margin-top: var(--space-6);
		font-size: var(--size-m);
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
	.install {
		flex: 1 1 22rem;
		min-width: 0;
	}
</style>
