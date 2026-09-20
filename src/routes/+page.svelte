<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ProjectView from '$lib/components/ProjectView.svelte';
	import { projects, stills } from '$lib/data/projects';
	import { description } from '$lib/data/site';

	// The home page is the first tool; its card is that tool's opening screen.
	const first = projects[0];
	const hero = stills(first)[0];
</script>

<Meta {description} path="/" image={hero?.src} imageAlt={hero?.caption} />

<ProjectView project={first} />
