<!--
	A terminal window, set into the page. No drawn border: the edge is a near
	shadow and a hairline of light; the panel sits on the page, not above it.
	The title strip is Ghostty's
	with its tabs folded away: where you are, and nothing to click.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { vars } from './theme';

	// A browser's window carries an address rather than a title: what is in it
	// is a page somewhere, and the address says where.
	type Props = { title: string; background?: string; address?: boolean; children: Snippet };
	let { title, background, address = false, children }: Props = $props();
</script>

<div
	class="window"
	style="{vars()}{background
		? `;--window-bg:${background};--window-bar:color-mix(in oklab, ${background} 82%, black)`
		: ''}"
>
	<div class="bar">
		<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="title" class:address>{title}</span>
	</div>
	<div class="body">
		{@render children()}
	</div>
</div>

<style>
	.window {
		--window-bg: var(--term-bg);
		--window-bar: var(--term-bar);
		overflow: hidden;
		border-radius: var(--radius-m);
		background: var(--window-bg);
		box-shadow: var(--float-near);
		transition: background 240ms var(--ease);
	}
	.bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.125rem;
		padding-inline: var(--space-4);
		color: color-mix(in oklab, var(--term-fg) 45%, transparent);
		font-size: var(--size-xs);
		/* the window's own chrome, set by the scheme, so it reads without a rule */
		background: var(--window-bar);
		transition: background 240ms var(--ease);
	}
	.lights {
		position: absolute;
		left: var(--space-4);
		display: flex;
		gap: 7px;
	}
	.lights i {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: color-mix(in oklab, var(--term-fg) 16%, transparent);
	}
	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* An address field: a pill a little darker than the bar, the way a
	   browser's toolbar holds its URL. */
	.title.address {
		max-width: min(28rem, 60%);
		padding: 0.1875rem 0.875rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--window-bar) 70%, black);
		font-family: var(--mono);
		font-size: 0.6875rem;
	}
</style>
