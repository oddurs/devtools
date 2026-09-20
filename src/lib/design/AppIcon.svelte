<!--
	An app's mark: its icon on a tile of its own tint. The tile is the tint
	held very dark and quiet; the icon is the tint at full (still modest)
	strength. Sizes are named, not numbered, so every mark on the site is one
	of three.

	Muted marks (the rail, when not current) are the glyph alone, in grey, with
	no tile: a list of twenty-odd little panels is paneling for its own sake.
	Pointed at, a muted mark takes its tile and tint back.
-->
<script lang="ts">
	import { identity } from './identity';

	type Props = { name: string; size?: 's' | 'm' | 'l'; muted?: boolean };
	let { name, size = 'm', muted = false }: Props = $props();

	const id = $derived(identity(name));
	const Icon = $derived(id.icon);
	const px = { s: 14, m: 18, l: 26 };
</script>

<span class="mark {size}" class:muted style="--h: var(--tint-{id.tint})" aria-hidden="true">
	<Icon size={px[size]} strokeWidth={size === 'l' ? 1.75 : 2} />
</span>

<style>
	.mark {
		--tone: oklch(var(--tint-l) var(--tint-c) var(--h));
		display: inline-grid;
		flex: none;
		place-items: center;
		border-radius: 28%;
		background: oklch(0.29 calc(var(--tint-c) * 0.45) var(--h));
		box-shadow: inset 0 0 0 1px oklch(0.4 calc(var(--tint-c) * 0.5) var(--h) / 0.45);
		color: var(--tone);
		transition:
			color var(--quick),
			background var(--quick),
			box-shadow var(--quick);
	}
	.s {
		width: 1.375rem;
		height: 1.375rem;
	}
	.m {
		width: 2rem;
		height: 2rem;
	}
	.l {
		width: 3rem;
		height: 3rem;
		border-radius: 26%;
	}
	.muted {
		background: transparent;
		box-shadow: none;
		color: var(--faint);
	}
	/* A muted mark takes its tint back when whatever holds it is pointed at. */
	:global(:hover) > .muted,
	:global(:focus-visible) > .muted {
		background: oklch(0.29 calc(var(--tint-c) * 0.45) var(--h));
		box-shadow: inset 0 0 0 1px oklch(0.4 calc(var(--tint-c) * 0.5) var(--h) / 0.45);
		color: var(--tone);
	}
</style>
