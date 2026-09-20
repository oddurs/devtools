<!--
	A tool you hear. One row per sample: what it is, how long it is, the keys
	being pressed while it was recorded, and the sound itself drawn as a
	waveform from the levels the runner measured off the file.

	Silent until asked. Nothing on this site makes a noise on its own, so
	there is no autoplay here and no preloading of the audio either — the
	waveform is drawn from numbers, and the file is fetched when a person
	presses play.
-->
<script lang="ts">
	import { asset } from '$app/paths';
	import type { Sample } from '$lib/data/projects';

	let { samples, label }: { samples: Sample[]; label: string } = $props();

	// The one that is sounding, and how far through it is. Only ever one:
	// starting a sample stops whichever was going.
	let sounding = $state<string | null>(null);
	let at = $state(0);
	let players: Record<string, HTMLAudioElement> = {};

	function toggle(s: Sample) {
		const el = players[s.src];
		if (!el) return;
		if (sounding === s.src) {
			el.pause();
			return;
		}
		for (const [src, other] of Object.entries(players)) {
			if (src !== s.src) {
				other.pause();
				other.currentTime = 0;
			}
		}
		at = 0;
		el.play();
	}

	function clock(seconds: number): string {
		const s = Math.max(0, Math.round(seconds));
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	}
</script>

<ul class="samples" aria-label={label}>
	{#each samples as s (s.src)}
		{@const on = sounding === s.src}
		{@const through = on && s.seconds ? at / s.seconds : 0}
		<li>
			<button
				type="button"
				class="play"
				class:on
				onclick={() => toggle(s)}
				aria-label="{on ? 'Pause' : 'Play'} {s.caption}, {clock(s.seconds)}"
			>
				<span aria-hidden="true">{on ? '❙❙' : '▶'}</span>
			</button>

			<div class="body">
				<p class="what">
					{s.caption}
					<span class="time">{clock(on ? at : s.seconds)}</span>
				</p>

				<!-- Drawn from the levels, not an image of a waveform. -->
				<svg
					class="wave"
					viewBox="0 0 {s.peaks.length * 3} 40"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					{#each s.peaks as peak, i (i)}
						<rect
							x={i * 3}
							y={20 - Math.max(1, peak * 19)}
							width="2"
							height={Math.max(2, peak * 38)}
							rx="1"
							class:past={i / s.peaks.length <= through}
						/>
					{/each}
				</svg>

				{#if s.typed}
					<p class="typed"><span class="prompt" aria-hidden="true">❯</span>{s.typed}</p>
				{/if}
			</div>

			<!-- preload=none: the page stays silent and cheap until asked. -->
			<audio
				bind:this={players[s.src]}
				src={asset(s.src)}
				preload="none"
				onplay={() => (sounding = s.src)}
				onpause={() => (sounding = sounding === s.src ? null : sounding)}
				onended={() => {
					sounding = null;
					at = 0;
				}}
				ontimeupdate={(e) => {
					if (sounding === s.src) at = e.currentTarget.currentTime;
				}}
			></audio>
		</li>
	{/each}
</ul>

<style>
	.samples {
		display: grid;
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		border-radius: var(--radius-m);
		background: var(--lifted);
	}
	.play {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: var(--raised);
		color: var(--muted);
		font-size: 0.8rem;
		transition:
			color var(--quick),
			background var(--quick);
	}
	.play:hover {
		color: var(--ink);
	}
	.play.on {
		background: color-mix(in oklab, var(--amber) 22%, var(--raised));
		color: var(--amber);
	}
	.body {
		min-width: 0;
	}
	.what {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-4);
		margin: 0 0 var(--space-2);
		color: var(--muted);
		font-size: var(--size-m);
		text-wrap: pretty;
	}
	.time {
		flex: none;
		color: var(--faint);
		font-family: var(--term-font, monospace);
		font-size: var(--size-s);
		font-variant-numeric: tabular-nums;
	}
	.wave {
		display: block;
		width: 100%;
		height: 2.5rem;
	}
	.wave rect {
		fill: var(--rule);
		transition: fill 90ms linear;
	}
	.wave rect.past {
		fill: var(--amber);
	}
	.typed {
		margin: var(--space-2) 0 0;
		overflow: hidden;
		color: var(--faint);
		font-family: var(--term-font, monospace);
		font-size: var(--size-s);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.prompt {
		margin-right: 0.5em;
		color: var(--mint);
	}

	@media (max-width: 40rem) {
		li {
			gap: var(--space-3);
			padding: var(--space-3);
		}
		.play {
			width: 2.25rem;
			height: 2.25rem;
		}
	}
</style>
