<script lang="ts">
	import Index from '$lib/components/Index.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { groups } from '$lib/data/projects';
	import { description } from '$lib/data/site';
</script>

<Meta {description} path="/" />

<Index {groups} />
