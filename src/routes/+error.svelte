<!--
	A wrong turn, answered in the site's own voice: what was asked for, that
	it is not here, and the nearest tools by name, so the way on is a click.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { AppIcon } from '$lib/design';
	import { projects } from '$lib/data/projects';
	import { title } from '$lib/data/site';

	const asked = $derived(
		decodeURIComponent(page.url.pathname.split('/').filter(Boolean).pop() ?? '')
	);

	// Tools whose names share the most letters with what was typed, in order:
	// a typo usually lands next to the tool that was meant.
	const near = $derived.by(() => {
		const a = new Set(asked.toLowerCase());
		return [...projects]
			.map((p) => ({ p, score: [...new Set(p.name)].filter((c) => a.has(c)).length }))
			.sort((x, y) => y.score - x.score || x.p.name.localeCompare(y.p.name))
			.slice(0, 4)
			.map(({ p }) => p);
	});
</script>

<svelte:head>
	<title>not found · {title}</title>
	<!-- A wrong turn is not a page; it should not be indexed as one. -->
	<meta name="robots" content="noindex" />
	<meta name="theme-color" content="#0d0d0c" />
</svelte:head>

<article>
	<p class="status">{page.status}</p>
	<h1>
		{#if page.status === 404 && asked}
			There is no tool called <code>{asked}</code>.
		{:else}
			{page.error?.message ?? 'Something went wrong.'}
		{/if}
	</h1>
	{#if page.status === 404}
		<p class="lead">Perhaps one of these:</p>
		<ul>
			{#each near as p (p.name)}
				<li>
					<a href={resolve('/[name]', { name: p.name })}>
						<AppIcon name={p.name} size="m" />
						<span class="name">{p.name}</span>
						<span class="line">{p.line}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	article {
		max-width: var(--measure);
	}
	.status {
		margin: 0;
		color: var(--faint);
		font: var(--size-s) var(--mono);
	}
	h1 {
		margin: var(--space-2) 0 0;
		font-size: 1.75rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
		text-wrap: balance;
	}
	h1 code {
		color: var(--amber);
		font-size: 0.85em;
	}
	.lead {
		margin: var(--space-8) 0 var(--space-3);
		color: var(--muted);
	}
	ul {
		display: grid;
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: var(--space-3);
		align-items: center;
		padding: var(--space-2) var(--space-3);
		margin-inline: calc(-1 * var(--space-3));
		border-radius: var(--radius-s);
		text-decoration: none;
		transition: background var(--quick);
	}
	a:hover {
		background: var(--lifted);
	}
	a :global(.mark) {
		grid-row: span 2;
	}
	.name {
		font-weight: 500;
	}
	.line {
		color: var(--faint);
		font-size: var(--size-s);
	}
</style>
