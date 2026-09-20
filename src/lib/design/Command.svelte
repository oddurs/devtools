<!--
	A line to paste into a terminal, and the button that copies it.
-->
<script lang="ts">
	let { command }: { command: string } = $props();
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1400);
		} catch {
			// No clipboard (insecure context, denied): the text is still selectable.
		}
	}
</script>

<div class="command">
	<code><span class="sigil" aria-hidden="true">$</span>{command}</code>
	<button type="button" onclick={copy} aria-live="polite">{copied ? 'copied' : 'copy'}</button>
</div>

<style>
	.command {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		max-width: 100%;
		padding: 0.5rem 0.5rem 0.5rem 0.875rem;
		border-radius: var(--radius-s);
		background: var(--raised);
		box-shadow: inset 0 0 0 1px var(--rule);
	}
	code {
		flex: 1;
		min-width: 0;
		overflow-x: auto;
		white-space: nowrap;
		scrollbar-width: none;
		color: var(--ink);
		font-size: var(--size-s);
		/* A command too long for the box fades out rather than being cut
		   mid-word; it still scrolls, and copy takes all of it. */
		mask-image: linear-gradient(to right, black calc(100% - 2.5rem), transparent);
	}
	.sigil {
		color: var(--faint);
		margin-right: 0.75ch;
		user-select: none;
	}
	button {
		flex: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: var(--faint);
		font-size: var(--size-xs);
		transition:
			color var(--quick),
			background var(--quick);
	}
	button:hover {
		background: var(--lifted);
		color: var(--ink);
	}
</style>
