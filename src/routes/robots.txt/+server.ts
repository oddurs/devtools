// robots.txt as a route rather than a file in static/, so the sitemap it
// points at is the one actually built, base path and all.
import { url } from '$lib/data/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${url('/sitemap.xml')}
`;
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
