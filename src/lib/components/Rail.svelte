<!--
	The rail: every tool, grouped by what it is for. Type on the page, not a
	panel on top of it: no card, no border, no shadow, no highlight box. The
	current tool is told by its ink and its mark taking colour.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { AppIcon, Badge, Kbd } from '$lib/design';
	import { prerelease, type Group } from '$lib/data/projects';

	let { groups, current }: { groups: Group[]; current: string | null } = $props();
</script>

<nav class="rail" aria-label="Tools">
	<a class="mark" href={resolve('/')}>
		<span class="name">devtools</span>
		<span class="by">oddurs</span>
	</a>

	{#each groups as group (group.label)}
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
							{p.name}
							{#if prerelease(p)}<span class="pre"><Badge tone="amber">pre</Badge></span>{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<p class="foot">
		<span class="keys"><Kbd>j</Kbd><Kbd>k</Kbd> tools</span>
		<a href={resolve('/system')} aria-current={current === null ? 'page' : undefined}>system</a>
	</p>
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
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: auto 0 0;
		padding-inline: var(--space-2);
		color: var(--faint);
		font-size: var(--size-xs);
	}
	.keys {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	.foot a {
		text-decoration: none;
		transition: color var(--quick);
	}
	.foot a:hover,
	.foot a[aria-current='page'] {
		color: var(--ink);
	}

	@media (max-width: 52rem) {
		.rail {
			flex-direction: row;
			align-items: center;
			gap: var(--space-4);
			height: auto;
			padding: var(--space-3) var(--space-4);
			overflow-x: auto;
			/* More to the right: the strip says so by fading into the edge. */
			mask-image: linear-gradient(to right, black calc(100% - 3rem), transparent);
		}
		.group {
			display: contents;
		}
		h2,
		.foot {
			display: none;
		}
		ul {
			display: flex;
			gap: var(--space-1);
		}
		li a {
			white-space: nowrap;
		}
		.mark {
			flex: none;
		}
	}
</style>
