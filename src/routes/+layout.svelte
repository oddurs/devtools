<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
	import '$lib/design/base.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Rail from '$lib/components/Rail.svelte';
	import { groups, neighbours, projects } from '$lib/data/projects';

	let { children } = $props();

	// The home page is the first tool, so something is always running.
	const current = $derived(page.params.name ?? (page.route.id === '/' ? projects[0].name : null));

	// j/k walk the tools from anywhere a keystroke is not text.
	function onkeydown(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (t.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey)
			return;
		if (e.key !== 'j' && e.key !== 'k') return;
		const { prev, next } = neighbours(current ?? projects[0].name);
		const to = e.key === 'j' ? next : prev;
		e.preventDefault();
		goto(resolve('/[name]', { name: to.name }), { keepFocus: true, noScroll: true });
	}
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
	<aside><Rail {groups} {current} /></aside>
	<main>{@render children()}</main>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 15rem minmax(0, 1fr);
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
		.page {
			grid-template-columns: minmax(0, 1fr);
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
