// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	// The path the site is served under, from BASE_PATH at build time
	// (vite.config.ts). SvelteKit's own `base` is relative once resolved;
	// this is the real one, for absolute URLs. See $lib/data/site.
	const __BASE_PATH__: '' | `/${string}`;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
