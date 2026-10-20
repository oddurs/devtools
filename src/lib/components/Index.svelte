<!--
	The index: everything, on one page, in one order.

	Until now the front page was the first tool, which answered "what is this
	site" with "here is a system monitor" — true of one row of a shelf that is
	now fifty. This is the other answer: every name with the sentence that says
	what it is for, under the heading it belongs to, close enough together to
	read down in one go.

	A list rather than a grid of cards. Cards would need pictures to justify
	themselves, fifty pictures is a slow page nobody scans, and the pictures
	are the point of the page you land on next — not of this one.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { AppIcon } from '$lib/design';
	import { label, type Group } from '$lib/data/projects';
	import { shelves, type Shelf } from '$lib/data/tools';

	let { groups }: { groups: Group[] } = $props();

	let shelf = $state<Shelf | null>(null);

	const offered = $derived(shelves.filter((s) => groups.some((g) => g.shelf === s.id)));
	const total = $derived(groups.reduce((n, g) => n + g.projects.length, 0));
	// Shelf, then section, then row: eighty names read as seven kinds of thing
	// rather than twenty headings in a run.
	const shown = $derived(
		offered
			.filter((s) => !shelf || s.id === shelf)
			.map((s) => ({ ...s, groups: groups.filter((g) => g.shelf === s.id) }))
	);
</script>

<div class="index">
	<header>
		<h1>Built by Oddur</h1>
		<p class="sub">
			Terminal tools, Mac apps, games, maps, simulations, writing, and the libraries underneath.
			Every page shows the thing running, except the last shelf, which is ideas I haven't built yet.
		</p>
	</header>

	<div class="filter" role="group" aria-label="Narrow by what a thing is">
		<button type="button" class:on={shelf === null} onclick={() => (shelf = null)}>
			Everything <span class="n">{total}</span>
		</button>
		{#each offered as s (s.id)}
			{@const n = groups.filter((g) => g.shelf === s.id).reduce((t, g) => t + g.projects.length, 0)}
			<button
				type="button"
				class:on={shelf === s.id}
				title={s.of}
				onclick={() => (shelf = shelf === s.id ? null : s.id)}
			>
				{s.label} <span class="n">{n}</span>
			</button>
		{/each}
	</div>

	{#each shown as s (s.id)}
		<div class="shelf">
			<header class="shelf-head">
				<h2>{s.label}</h2>
				<p>{s.of}</p>
			</header>
			{#each s.groups as group (group.label)}
				<section>
					<h3>{group.label}</h3>
					<ul>
						{#each group.projects as p (p.name)}
							<li>
								<a href={resolve('/[name]', { name: p.name })}>
									<span class="mark"><AppIcon name={p.name} size="s" /></span>
									<span class="name">{label(p)}</span>
									<span class="line">{p.line}</span>
									<span class="lang">{p.lang}</span>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/each}
</div>

<style>
	.index {
		max-width: 68rem;
		/* The rows fold by the list's own width: beside the rail on a tablet,
		   one line per tool left the sentences a couple of words long. */
		container-type: inline-size;
	}
	h1 {
		max-width: 24ch;
		margin: 0;
		font-size: var(--size-title);
		font-weight: 600;
		letter-spacing: -0.028em;
		line-height: 1.1;
		text-wrap: balance;
	}
	.sub {
		max-width: var(--measure);
		margin: var(--space-6) 0 0;
		color: var(--muted);
		font-size: var(--size-body);
		line-height: 1.6;
		text-wrap: pretty;
	}

	.filter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-top: var(--space-8);
	}
	.filter button {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4em;
		padding: 0.25rem 0.6875rem;
		border-radius: 999px;
		color: var(--muted);
		font-size: var(--size-s);
		transition:
			color var(--quick),
			background var(--quick);
	}
	.filter button:hover {
		color: var(--ink);
	}
	.filter button.on {
		background: var(--lifted);
		color: var(--ink);
	}
	.n {
		color: var(--faint);
		font-family: var(--mono);
		font-size: var(--size-xs);
		font-variant-numeric: tabular-nums;
	}

	/* A shelf opens with its name and what is on it, over a hairline; its
	   sections follow at the old, quieter level. */
	.shelf {
		margin-top: var(--space-12);
	}
	.shelf:first-of-type {
		margin-top: var(--space-8);
	}
	.shelf-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-1) var(--space-3);
		padding-bottom: var(--space-3);
		box-shadow: inset 0 -1px 0 var(--rule);
	}
	.shelf-head h2 {
		margin: 0;
		color: var(--ink);
		font-size: var(--size-lead);
		font-weight: 600;
		letter-spacing: -0.012em;
	}
	.shelf-head p {
		margin: 0;
		color: var(--faint);
		font-size: var(--size-s);
	}
	section {
		margin-top: var(--space-6);
	}
	h3 {
		margin: 0 0 var(--space-2);
		color: var(--faint);
		font-size: var(--size-xs);
		font-weight: 400;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	/* One row per tool: mark, name, what it is for, what it is written in.
	   The columns line up down the whole page, which is what makes fifty
	   rows read as a list rather than as fifty paragraphs. */
	li a {
		display: grid;
		grid-template-columns: 1.25rem 11rem minmax(0, 1fr) 5rem;
		align-items: baseline;
		gap: var(--space-4);
		padding: 0.375rem var(--space-2);
		border-radius: var(--radius-s);
		color: var(--muted);
		text-decoration: none;
		transition:
			color var(--quick),
			background var(--quick);
	}
	li a:hover {
		background: var(--lifted);
		color: var(--ink);
	}
	.mark {
		align-self: center;
	}
	.name {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
		color: var(--ink);
		font-size: var(--size-m);
	}
	.line {
		overflow: hidden;
		font-size: var(--size-m);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.lang {
		color: var(--faint);
		font-size: var(--size-xs);
		text-align: right;
	}

	@container (max-width: 48rem) {
		/* Two lines per tool, and the language goes: on a narrow list the
		   sentence is worth more than the column it would cost. */
		li a {
			grid-template-columns: 1.25rem minmax(0, 1fr);
			gap: var(--space-1) var(--space-3);
			padding-block: var(--space-2);
		}
		.name {
			grid-column: 2;
		}
		.line {
			grid-column: 2;
			white-space: normal;
		}
		.lang {
			display: none;
		}
	}
</style>
