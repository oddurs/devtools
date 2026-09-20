<!--
	Everything in the head that is not for a reader: the title and description,
	the one canonical address for the page, and the card the page unfurls into
	when its link is pasted somewhere. A tool's card shows the tool running —
	the same hero screen the page opens on.
-->
<script lang="ts">
	import { title as siteTitle, url } from '$lib/data/site';

	type Props = {
		// The page's own name; left out on the home page, which is the site.
		name?: string;
		description: string;
		// The route, as the site serves it: '/' or '/quarry'.
		path: string;
		// A picture of the page, as a site-absolute path.
		image?: string | null;
		imageAlt?: string;
	};
	let { name, description, path, image = null, imageAlt }: Props = $props();

	const heading = $derived(name ? `${name} · ${siteTitle}` : siteTitle);
	const here = $derived(url(path));
	// A card image has to be absolute: the machine reading it is not on the page.
	const card = $derived(image ? url(image) : null);
</script>

<svelte:head>
	<title>{heading}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={here} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={heading} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={here} />
	{#if card}
		<meta property="og:image" content={card} />
		<meta property="og:image:alt" content={imageAlt ?? description} />
	{/if}

	<meta name="twitter:card" content={card ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={heading} />
	<meta name="twitter:description" content={description} />
	{#if card}
		<meta name="twitter:image" content={card} />
		<meta name="twitter:image:alt" content={imageAlt ?? description} />
	{/if}

	<!-- The browser's own chrome, in the site's ground rather than white. -->
	<meta name="theme-color" content="#0d0d0c" />
</svelte:head>

<!--
	Nothing is rendered: the head is the whole point. The site is prerendered,
	so what a crawler is handed is already in the HTML.
-->
