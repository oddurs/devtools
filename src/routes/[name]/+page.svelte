<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ProjectView from '$lib/components/ProjectView.svelte';
	import { stills } from '$lib/data/projects';

	let { data } = $props();

	const hero = $derived(stills(data.project)[0]);
</script>

<Meta
	name={data.project.name}
	description={data.project.line}
	path="/{data.project.name}"
	image={hero?.src}
	imageAlt={hero?.caption}
/>

<ProjectView project={data.project} />
