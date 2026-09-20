import { error } from '@sveltejs/kit';
import { find, projects } from '$lib/data/projects';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => projects.map((p) => ({ name: p.name }));

export const load: PageLoad = ({ params }) => {
	const project = find(params.name);
	if (!project) error(404, `No tool called ${params.name}`);
	return { project };
};
