<!--
	A terminal window, floating. No drawn border: the edge is the shadow and a
	hairline of light, as the rest of the site. The title strip is Ghostty's
	with its tabs folded away: where you are, and nothing to click.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { vars } from './theme';

	type Props = { title: string; background?: string; children: Snippet };
	let { title, background, children }: Props = $props();
</script>

<div
	class="window"
	style="{vars()}{background
		? `;--window-bg:${background};--window-bar:color-mix(in oklab, ${background} 82%, black)`
		: ''}"
>
	<div class="bar">
		<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="title">{title}</span>
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
		box-shadow: var(--float);
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
</style>
