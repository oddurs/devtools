<!--
	A contact sheet: everything the tool made, at once. Some tools argue by
	their output rather than by their interface, and for those a carousel is
	the wrong shape — the comparison is the point, so they are all on the page
	together and a click enlarges one.

	Not in a window. The other two views are the tool running and belong in
	one; these are the things it produced, and they belong on the page.
-->
<script lang="ts">
	import { asset } from '$app/paths';
	import type { Plate } from '$lib/data/projects';

	let { plates, label }: { plates: Plate[]; label: string } = $props();

	let open = $state<number | null>(null);
	// Animated plates that have been asked to move. Under reduced motion they
	// never start on their own, so asking is the only way in.
	let playing = $state<Record<string, boolean>>({});
	let still = $state(true);

	$effect(() => {
		const q = matchMedia('(prefers-reduced-motion: reduce)');
		const set = () => (still = q.matches);
		set();
		q.addEventListener('change', set);
		return () => q.removeEventListener('change', set);
	});

	// What to draw for a plate: the still until it is playing, unless motion is
	// welcome, in which case an animated plate simply runs.
	function shown(p: Plate): string {
		if (!p.still) return p.src;
		if (playing[p.src]) return p.src;
		return still ? p.still : p.src;
	}

	const moving = (p: Plate) => Boolean(p.still) && still && !playing[p.src];
	const shot = $derived(open === null ? null : plates[open]);

	function step(by: number) {
		if (open === null) return;
		open = (open + by + plates.length) % plates.length;
	}

	function onkeydown(e: KeyboardEvent) {
		if (open === null) return;
		if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
		else if (e.key === 'Escape') open = null;
		else return;
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<svelte:window {onkeydown} />

<ul class="gallery" aria-label={label}>
	{#each plates as p, i (p.src)}
		<li>
			<figure>
				<button
					type="button"
					onclick={() => (moving(p) ? (playing[p.src] = true) : (open = i))}
					aria-label={moving(p) ? `Play ${p.caption}` : `Enlarge ${p.caption}`}
				>
					<img
						src={asset(shown(p))}
						alt={p.caption}
						width={p.width}
						height={p.height}
						loading={i < 4 ? 'eager' : 'lazy'}
						decoding="async"
					/>
					{#if moving(p)}<span class="play" aria-hidden="true">▶</span>{/if}
				</button>
				<figcaption>
					{p.caption}
					{#if p.source}<span class="source">{p.source}</span>{/if}
				</figcaption>
			</figure>
		</li>
	{/each}
</ul>

{#if shot}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lightbox" onclick={() => (open = null)}>
		<figure>
			<img src={asset(shot.src)} alt={shot.caption} width={shot.width} height={shot.height} />
			<figcaption>
				{shot.caption}
				{#if shot.source}<span class="source">{shot.source}</span>{/if}
				<span class="keys">← → esc</span>
			</figcaption>
		</figure>
	</div>
{/if}

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
		gap: var(--space-6) var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	figure {
		margin: 0;
	}
	.gallery button {
		position: relative;
		display: block;
		width: 100%;
		overflow: hidden;
		/* The plate sits on the terminal's own ground: these are pictures of a
		   terminal, and a white mat under them would be a second background. */
		border-radius: var(--radius-s);
		background: var(--term-bg, var(--lifted));
		cursor: zoom-in;
		transition: box-shadow var(--quick) var(--ease);
	}
	.gallery button:hover {
		box-shadow: var(--float);
	}
	.gallery img {
		display: block;
		width: 100%;
		height: auto;
	}
	.play {
		position: absolute;
		right: var(--space-2);
		bottom: var(--space-2);
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: color-mix(in oklab, var(--paper) 72%, transparent);
		color: var(--ink);
		font-size: 0.7rem;
	}
	figcaption {
		margin-top: var(--space-2);
		color: var(--faint);
		font-size: var(--size-s);
		line-height: 1.4;
		text-wrap: pretty;
	}
	.source {
		color: var(--muted);
		font-family: var(--term-font, monospace);
		font-size: 0.9em;
	}
	.source::before {
		content: '·';
		margin-inline: 0.4em;
		color: var(--rule);
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: clamp(1rem, 5vw, 4rem);
		background: color-mix(in oklab, var(--paper) 88%, transparent);
		cursor: zoom-out;
	}
	.lightbox figure {
		max-width: min(72rem, 100%);
	}
	.lightbox img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 78dvh;
		object-fit: contain;
		border-radius: var(--radius-m);
		box-shadow: var(--float);
	}
	.lightbox figcaption {
		margin-top: var(--space-3);
		text-align: center;
	}
	.keys {
		margin-left: 0.75em;
		color: var(--rule);
		font-size: 0.9em;
	}

	@media (max-width: 40rem) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(min(11rem, 100%), 1fr));
		}
		.keys {
			display: none;
		}
	}
</style>
