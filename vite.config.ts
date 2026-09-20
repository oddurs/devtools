import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// A port of its own, so it never collides with whatever else is running.
// strictPort: fail loudly rather than quietly drifting to the next one.
const port = 4817;

// Where the site will be served from under its domain. SvelteKit's own `base`
// is resolved per page and comes out relative ('.', '..'), which is right for
// links and wrong for the absolute URLs a crawler is given, so the configured
// path is handed to the app separately. One knob, still: BASE_PATH.
const basePath = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Plain HTML in build/, every route prerendered.
			adapter: adapter({ strict: true }),
			paths: { base: basePath }
		})
	],
	define: { __BASE_PATH__: JSON.stringify(basePath) },
	// Building while the dev server is up otherwise reloads the page once per
	// file written: it watches its own output.
	server: { port, strictPort: true, watch: { ignored: ['**/build/**'] } },
	preview: { port: port + 1, strictPort: true },
	// What the site is built on is pure functions; they are tested as such, in
	// Node, in a file beside the module each one belongs to.
	test: {
		include: ['src/**/*.test.ts', 'screens/*.test.ts'],
		environment: 'node'
	}
});
