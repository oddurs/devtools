<!--
	Find: the fastest way across fifty things.

	A terminal person reaches for a key, not a menu, so this opens on ⌘K or on
	`/` — the key a pager, a browser's quick find and every TUI on this site
	already use — and closes on Escape. It is the one piece of chrome that
	floats above the page, because a thing summoned over what you were reading
	has to look summoned; everything else on this site is type on the page.

	It is not a search engine. It is a list of fifty names with the query
	narrowing it, and under each name the reason it is there — its own line, or
	the tag that matched — so a wrong first result is obvious rather than
	mysterious.
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { AppIcon, Kbd } from '$lib/design';
	import { projects } from '$lib/data/projects';
	import { search } from '$lib/data/search';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let query = $state('');
	let at = $state(0);
	let input = $state<HTMLInputElement | null>(null);

	// Empty query: the whole shelf, in the order the rail has it. Typing
	// narrows; nothing is hidden until something is typed.
	const hits = $derived(
		query.trim()
			? search(projects, query)
			: projects.map((p) => ({
					project: p,
					where: 'line' as const,
					tag: undefined,
					why: p.line,
					score: 0
				}))
	);
	const chosen = $derived(hits[Math.min(at, hits.length - 1)]);

	$effect(() => {
		if (open) {
			query = '';
			at = 0;
			// Focus after the dialog is in the document, or the keystroke that
			// opened it lands nowhere.
			requestAnimationFrame(() => input?.focus());
		}
	});

	// Keep the chosen row in view when the arrows walk past the fold.
	$effect(() => {
		if (!open) return;
		void at;
		document.querySelector('[data-find-at="true"]')?.scrollIntoView({ block: 'nearest' });
	});

	function go(name: string) {
		open = false;
		goto(resolve('/[name]', { name }), { keepFocus: false });
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
			return;
		}
		if (e.key === 'ArrowDown' || (e.key === 'n' && e.ctrlKey)) {
			e.preventDefault();
			at = Math.min(at + 1, hits.length - 1);
		} else if (e.key === 'ArrowUp' || (e.key === 'p' && e.ctrlKey)) {
			e.preventDefault();
			at = Math.max(at - 1, 0);
		} else if (e.key === 'Enter' && chosen) {
			e.preventDefault();
			go(chosen.project.name);
		}
	}
</script>

{#if open}
	<!-- The ground behind it: a click out is a way out, and so is Escape. -->
	<div
		class="over"
		role="button"
		tabindex="-1"
		aria-label="Close"
		onclick={() => (open = false)}
		onkeydown={() => {}}
	></div>

	<div class="find" role="dialog" aria-modal="true" aria-label="Find a tool">
		<div class="box">
			<input
				bind:this={input}
				bind:value={query}
				{onkeydown}
				oninput={() => (at = 0)}
				type="text"
				placeholder="Find a tool"
				aria-label="Find a tool"
				autocomplete="off"
				spellcheck="false"
			/>
			<span class="count">{hits.length}</span>
		</div>

		{#if hits.length}
			<ul>
				{#each hits as hit, i (hit.project.name)}
					<li>
						<button
							type="button"
							class:at={i === at}
							data-find-at={i === at}
							onmouseenter={() => (at = i)}
							onclick={() => go(hit.project.name)}
						>
							<AppIcon name={hit.project.name} size="s" muted={i !== at} />
							<span class="name">{hit.project.name}</span>
							<span class="why">{hit.why}</span>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="none">Nothing here is called that, and nothing says it either.</p>
		{/if}

		<p class="keys">
			<Kbd>↑</Kbd><Kbd>↓</Kbd> choose <Kbd>⏎</Kbd> open <Kbd>esc</Kbd> close
		</p>
	</div>
{/if}

<style>
	.over {
		position: fixed;
		inset: 0;
		z-index: 20;
		background: rgb(0 0 0 / 0.5);
	}
	/* Held a third of the way down rather than centred: a list that grows
	   downwards should not move its own input while you type. */
	.find {
		position: fixed;
		z-index: 21;
		top: clamp(3rem, 12vh, 7rem);
		left: 50%;
		display: flex;
		flex-direction: column;
		width: min(36rem, calc(100vw - 2 * var(--gutter)));
		max-height: min(32rem, 70vh);
		overflow: hidden;
		border-radius: var(--radius-m);
		background: var(--lifted);
		box-shadow: var(--float);
		translate: -50% 0;
	}
	.box {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-4) var(--space-3);
	}
	input {
		flex: 1;
		min-width: 0;
		border: 0;
		background: none;
		color: var(--ink);
		font-family: var(--text);
		font-size: var(--size-lead);
	}
	input:focus {
		outline: none;
	}
	input::placeholder {
		color: var(--faint);
	}
	.count {
		color: var(--faint);
		font-family: var(--mono);
		font-size: var(--size-xs);
		font-variant-numeric: tabular-nums;
	}
	ul {
		margin: 0;
		padding: 0 var(--space-2) var(--space-2);
		overflow-y: auto;
		list-style: none;
		scrollbar-width: thin;
	}
	li button {
		display: flex;
		align-items: baseline;
		gap: 0.625rem;
		width: 100%;
		padding: 0.3125rem var(--space-2);
		border-radius: var(--radius-s);
		color: var(--muted);
		text-align: left;
	}
	li button.at {
		background: var(--raised);
		color: var(--ink);
	}
	.name {
		flex: none;
		font-size: var(--size-m);
	}
	.why {
		overflow: hidden;
		color: var(--faint);
		font-size: var(--size-s);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.none {
		margin: 0;
		padding: 0 var(--space-4) var(--space-4);
		color: var(--faint);
		font-size: var(--size-m);
	}
	.keys {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin: 0;
		padding: var(--space-2) var(--space-4);
		box-shadow: inset 0 1px 0 var(--rule);
		color: var(--faint);
		font-size: var(--size-xs);
	}

	@media (max-width: 40rem) {
		.find {
			top: 0;
			width: 100vw;
			max-height: 100dvh;
			height: 100dvh;
			border-radius: 0;
			padding-top: env(safe-area-inset-top, 0px);
		}
		.keys {
			display: none;
		}
	}
</style>
