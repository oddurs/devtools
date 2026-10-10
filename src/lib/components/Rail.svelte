<!--
	The rail: every tool, grouped by what it is for. Type on the page, not a
	panel on top of it: no card, no border, no shadow, no highlight box. The
	current tool is told by its ink and its mark taking colour.

	Above the groups, the shelves: terminal, desk, play, look, read, build —
	what a thing is rather than what it is about. Most of this list is a terminal
	program and some of it is not, and a reader deciding whether to open a page
	wants to know which. Picking one narrows the rail; it is a view of the list,
	not a page of its own, so it holds no state anyone can link to and the page
	you are on is always in it.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import Search from '@lucide/svelte/icons/search';
	import { AppIcon, Badge, Kbd } from '$lib/design';
	import { label, prerelease, type Group } from '$lib/data/projects';
	import { shelves, type Shelf } from '$lib/data/tools';

	let { groups, current, onfind }: { groups: Group[]; current: string | null; onfind: () => void } =
		$props();

	let shelf = $state<Shelf | null>(null);

	// Only the shelves that have something on them, so an empty one is never
	// offered — the day the first game lands, Play appears by itself.
	const offered = $derived(shelves.filter((s) => groups.some((g) => g.shelf === s.id)));
	const shown = $derived(shelf ? groups.filter((g) => g.shelf === shelf) : groups);

	// Pressing the shelf you are on puts the whole list back. Narrowing can
	// hide the page you are reading, which is fine: the rail is where you are
	// going, not where you are, and the page itself has not moved.
	function pick(id: Shelf) {
		shelf = shelf === id ? null : id;
	}
</script>

<nav class="rail" aria-label="Tools">
	<a class="mark" href={resolve('/')}>
		<span class="name">devtools</span>
		<span class="by">oddurs</span>
	</a>

	<!-- The way across fifty names without reading them. On a phone this is
	     the rail: a strip of every name is a thing to scroll past, not a way
	     to get anywhere. -->
	<button type="button" class="find" onclick={onfind}>
		<!-- In the marks' column, so the words line up with the names below;
		     and on a phone, where there is no key, it says this is a button. -->
		<span class="glass" aria-hidden="true"><Search size={14} strokeWidth={2} /></span>
		<span class="label">Find a tool</span>
		<span class="hint"><Kbd>/</Kbd></span>
	</button>

	{#if offered.length > 1}
		<div class="shelves" role="group" aria-label="Narrow by what a thing is">
			{#each offered as s (s.id)}
				<button
					type="button"
					class:on={shelf === s.id}
					aria-pressed={shelf === s.id}
					title={s.of}
					onclick={() => pick(s.id)}>{s.label}</button
				>
			{/each}
		</div>
	{/if}

	{#each shown as group (group.label)}
		<div class="group">
			<h2>{group.label}</h2>
			<ul>
				{#each group.projects as p (p.name)}
					<li>
						<a
							href={resolve('/[name]', { name: p.name })}
							aria-current={p.name === current ? 'page' : undefined}
							title={p.line}
						>
							<AppIcon name={p.name} size="s" muted={p.name !== current} />
							{label(p)}
							{#if prerelease(p)}<span class="pre"><Badge tone="amber">pre</Badge></span>{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>

<style>
	.rail {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		height: 100%;
		/* The page's gutter on top and at the side, the same top as the
		   content, so the wordmark and the title start on one line. */
		padding: var(--gutter-top) var(--space-2) var(--space-6) var(--gutter);
		overflow-y: auto;
		scrollbar-width: none;
	}
	.find {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: calc(var(--space-2) * -1);
		padding: 0.3125rem var(--space-2);
		border-radius: var(--radius-s);
		color: var(--faint);
		font-size: var(--size-m);
		text-align: left;
		transition:
			color var(--quick),
			background var(--quick);
	}
	.find:hover {
		background: var(--lifted);
		color: var(--ink);
	}
	/* The same box as a mark in the list, so the glass sits over the icons. */
	.glass {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: 1.375rem;
		height: 1.375rem;
	}
	.hint {
		margin-left: auto;
	}
	.shelves {
		/* Six shelves, three to a row, in columns: two even rows read as a
		   choice, where a row that wraps leaves one name stranded. */
		display: grid;
		grid-template-columns: repeat(3, max-content);
		justify-items: start;
		gap: 0.125rem 0.25rem;
		/* The pills' own padding brings the first label back to the rail's
		   text edge. */
		padding-inline: 0.25rem;
		margin-top: calc(var(--space-2) * -1);
	}
	.shelves button {
		padding: 0.125rem 0.25rem;
		border-radius: 999px;
		color: var(--faint);
		font-size: var(--size-xs);
		transition:
			color var(--quick),
			background var(--quick);
	}
	.shelves button:hover {
		color: var(--ink);
	}
	.shelves button.on {
		background: var(--lifted);
		color: var(--ink);
	}
	.mark {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
		padding-inline: var(--space-2);
		text-decoration: none;
	}
	.name {
		font-weight: 600;
		letter-spacing: -0.016em;
	}
	.by {
		color: var(--faint);
		font-size: var(--size-s);
	}
	h2 {
		margin: 0 0 var(--space-1);
		padding-inline: var(--space-2);
		color: var(--faint);
		font-size: var(--size-xs);
		font-weight: 400;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li a {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.1875rem var(--space-2);
		/* No background ever; the radius is for the focus ring to follow. */
		border-radius: var(--radius-s);
		color: var(--faint);
		font-size: var(--size-m);
		line-height: 1.35;
		text-decoration: none;
		transition: color var(--quick);
	}
	li a:hover {
		color: var(--ink);
	}
	.pre {
		margin-left: auto;
	}
	li a[aria-current='page'] {
		color: var(--ink);
	}

	@media (max-width: 52rem) {
		/* A bar, not a rail. Fifty names in a horizontal strip is a thing to
		   scroll past rather than a way to get anywhere, so the list goes and
		   the two ways through it stay: the index, which the wordmark leads
		   to, and the finder. */
		.rail {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-4);
			height: auto;
			padding: var(--space-3) var(--space-4);
			overflow: visible;
			box-shadow: inset 0 -1px 0 var(--rule);
		}
		.group,
		.shelves {
			display: none;
		}
		.mark {
			flex: none;
			padding-inline: 0;
		}
		.find {
			flex: none;
			margin-top: 0;
		}
		/* A key to press, on a thing with no keys. */
		.hint {
			display: none;
		}
	}
</style>
