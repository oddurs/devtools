export const owner = 'oddurs';
export const title = 'devtools';
export const description = 'The tools I build for my own terminal, running.';

// Where the built site is served from. Only the absolute links need it —
// canonical, the card a link unfurls into, and the sitemap — because those are
// read off the page by machines that have no page to be relative to.
export const origin = 'https://oddurs.github.io';

// An absolute URL for a path the site serves: a route, or something in
// static/. __BASE_PATH__ is BASE_PATH as the build was given it.
export function url(path = '/'): string {
	return origin + __BASE_PATH__ + path;
}
