<!--
	One of a few, as a pill. The track is only a hairline; the chosen one is
	lifted out of it rather than coloured in.
-->
<script lang="ts" generics="T extends string">
	type Props = {
		options: readonly { value: T; label: string; disabled?: boolean }[];
		value: T;
		label: string;
		onchange?: (value: T) => void;
	};
	let { options, value = $bindable(), label, onchange }: Props = $props();
</script>

<span class="choice" role="group" aria-label={label}>
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={value === option.value}
			disabled={option.disabled}
			onclick={() => {
				value = option.value;
				onchange?.(option.value);
			}}>{option.label}</button
		>
	{/each}
</span>

<style>
	.choice {
		display: inline-flex;
		padding: 3px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 1px var(--rule);
	}
	button {
		padding: 0.4375rem 0.875rem;
		border-radius: 999px;
		color: var(--muted);
		font-size: var(--size-s);
		line-height: 1;
		white-space: nowrap;
		transition: color var(--quick);
	}
	button:hover {
		color: var(--ink);
	}
	button:disabled {
		color: var(--faint);
		opacity: 0.5;
		cursor: default;
	}
	button[aria-pressed='true'] {
		background: var(--rule);
		color: var(--ink);
	}
</style>
