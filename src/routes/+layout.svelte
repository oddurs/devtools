<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
	import '$lib/design/base.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Find from '$lib/components/Find.svelte';
	import Rail from '$lib/components/Rail.svelte';
	import { groups, neighbours, projects } from '$lib/data/projects';

	let { children } = $props();

	// The index is a page of its own now, so on it no tool is current.
	const current = $derived(page.params.name ?? null);

	let finding = $state(false);

	// The keys, from anywhere a keystroke is not already text: ⌘K or / opens
	// the finder, j and k walk the shelf one at a time.
	function onkeydown(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		const typing = Boolean(t.closest('input, textarea, [contenteditable]'));
		if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			finding = !finding;
			return;
		}
		if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.key === '/') {
			e.preventDefault();
			finding = true;
			return;
		}
		if (e.key !== 'j' && e.key !== 'k') return;
		// From the index, j starts at the top of the shelf rather than
		// nowhere; from a tool, it steps to the next one.
		const { prev, next } = neighbours(current ?? projects[projects.length - 1].name);
		const to = e.key === 'j' ? next : prev;
		e.preventDefault();
		goto(resolve('/[name]', { name: to.name }), { keepFocus: true, noScroll: true });
	}
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Which build this is. scripts/ship reads it back off the published site
	     to tell a fresh deploy from a cached one. -->
	<meta name="commit" content={__COMMIT__} />
</svelte:head>

<div class="page">
	<aside><Rail {groups} {current} /></aside>
	<main>{@render children()}</main>
</div>

<Find bind:open={finding} />

<style>
	.page {
		display: grid;
		grid-template-columns: var(--rail) minmax(0, 1fr);
		min-height: 100dvh;
	}
	aside {
		position: sticky;
		top: 0;
		height: 100dvh;
	}
	main {
		padding: var(--gutter-top) clamp(1.25rem, 5vw, 5rem) var(--space-16);
	}

	@media (max-width: 52rem) {
		/* The rail becomes a strip across the top. Its row is as tall as the
		   strip and no taller: left to itself a grid stretches its rows to fill
		   the page's min-height, and the strip grew a quarter of a phone's
		   height of empty space under it. */
		.page {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto minmax(0, 1fr);
		}
		aside {
			z-index: 1;
			height: auto;
			/* The ground is here, not on the strip: the strip fades out at its
			   edge, and its ground must not fade with it. */
			background: var(--paper);
		}
		/* The page scrolls under the strip; a short fade of the page's own
		   colour keeps the two apart without drawing a line between them. */
		aside::after {
			content: '';
			position: absolute;
			inset: 100% 0 auto;
			height: var(--space-4);
			background: linear-gradient(var(--paper), transparent);
			pointer-events: none;
		}
	}
</style>
