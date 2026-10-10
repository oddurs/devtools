<!--
	The rail: every tool, grouped by what it is for. Type on the page, not a
	panel on top of it: no card, no border, no shadow, no highlight box. The
	current tool is told by its ink and its mark taking colour.

	Nothing above the groups but the wordmark; finding by name is the / key,
	from anywhere. The groups sit under their shelf's name, small and set in
	capitals, so twenty headings read as six kinds of thing.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { AppIcon, Badge } from '$lib/design';
	import { label, prerelease, type Group } from '$lib/data/projects';
	import { shelves } from '$lib/data/tools';

	let { groups, current }: { groups: Group[]; current: string | null } = $props();

	const byShelf = $derived(
		shelves
			.map((s) => ({ ...s, groups: groups.filter((g) => g.shelf === s.id) }))
			.filter((s) => s.groups.length > 0)
	);
</script>

<nav class="rail" aria-label="Tools">
	<a class="mark" href={resolve('/')}>
		<span class="name">devtools</span>
		<span class="by">oddurs</span>
	</a>

	{#each byShelf as s (s.id)}
		<div class="shelf">
			<p class="shelf-name">{s.label}</p>
			{#each s.groups as group (group.label)}
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
		</div>
	{/each}
</nav>

<style>
	.rail {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		height: 100%;
		/* The page's gutter on top and at the side, the same top as the
		   content, so the wordmark and the title start on one line. */
		padding: var(--gutter-top) var(--space-2) var(--space-6) var(--gutter);
		overflow-y: auto;
		scrollbar-width: none;
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
	.shelf {
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
	}
	.shelf-name {
		margin: 0 0 calc(var(--space-1) * -1);
		padding-inline: var(--space-2);
		color: var(--muted);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
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
		/* A bar, not a rail. Eighty names in a horizontal strip is a thing to
		   scroll past rather than a way to get anywhere, so the list goes and
		   the wordmark stays, leading to the index. */
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
		.shelf {
			display: none;
		}
		.mark {
			flex: none;
			padding-inline: 0;
		}
	}
</style>
