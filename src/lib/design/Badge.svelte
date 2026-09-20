<!--
	A state, stated: a word in a quiet pill. Hues are rationed to state, so a
	badge takes one; `amber` is for "not ready yet".
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { tone?: 'amber' | 'mint' | 'faint'; children: Snippet };
	let { tone = 'faint', children }: Props = $props();
</script>

<span class="badge {tone}">{@render children()}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		flex: none;
		padding: 0.0625rem 0.4375rem;
		border-radius: 999px;
		font-size: 0.6875rem;
		font-weight: 500;
		line-height: 1.5;
		letter-spacing: 0.01em;
		white-space: nowrap;
	}
	.faint {
		color: var(--faint);
		box-shadow: inset 0 0 0 1px var(--rule);
	}
	.amber {
		color: var(--amber);
		background: color-mix(in oklab, var(--amber) 9%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amber) 28%, transparent);
	}
	.mint {
		color: var(--mint);
		background: color-mix(in oklab, var(--mint) 9%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--mint) 28%, transparent);
	}
</style>
