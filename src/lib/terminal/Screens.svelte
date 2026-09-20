<!--
	Real screens of the tool, stacked in one cell so that stepping between them
	crossfades rather than jumps. Every image is loaded up front; they are
	small, and a step that waits on the network is not a step.
-->
<script lang="ts">
	import { asset } from '$app/paths';
	import type { Shot } from '$lib/data/projects';

	let { shots, index }: { shots: Shot[]; index: number } = $props();
</script>

<div class="screens">
	{#each shots as shot, i (shot.src)}
		<img
			src={asset(shot.src)}
			alt={shot.caption}
			width={shot.width}
			height={shot.height}
			class:on={i === index}
			aria-hidden={i !== index}
			loading={i === 0 ? 'eager' : 'lazy'}
			decoding="async"
		/>
	{/each}
</div>

<style>
	.screens {
		display: grid;
	}
	img {
		grid-area: 1 / 1;
		width: 100%;
		height: auto;
		opacity: 0;
		transition: opacity 260ms var(--ease);
	}
	img.on {
		opacity: 1;
	}
</style>
