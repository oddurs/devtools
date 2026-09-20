<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<kbd>{@render children()}</kbd>

<style>
	kbd {
		display: inline-block;
		min-width: 1.5em;
		padding: 0.125em 0.375em;
		border-radius: 4px;
		background: var(--raised);
		box-shadow: inset 0 0 0 1px var(--rule);
		color: var(--muted);
		font: 0.75rem / 1.2 var(--mono);
		text-align: center;
	}
</style>
