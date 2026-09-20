// The sitemap, built from the same list the rail is: every tool has a page,
// so every tool is in here, and nothing can be forgotten by hand.
import { projects } from '$lib/data/projects';
import { url } from '$lib/data/site';
import type { RequestHandler } from './$types';

export const prerender = true;

// The home page first, then the tools in the rail's order, then the system.
const paths = ['/', ...projects.map((p) => `/${p.name}`), '/system'];

export const GET: RequestHandler = () => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `\t<url><loc>${url(p)}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
