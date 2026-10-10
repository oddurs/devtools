import { describe, expect, it } from 'vitest';
import { identities } from '$lib/design/identity';
import { shelves } from './tools';
import {
	find,
	groups,
	neighbours,
	prerelease,
	projects,
	stateLabel,
	stills,
	views,
	type Project
} from './projects';

// A project is a big record; a test that cares about two fields says so by
// starting from the first real one and overriding just those.
function project(over: Partial<Project> = {}): Project {
	return { ...projects[0], ...over };
}

describe('the rail', () => {
	it('has every tool in it, once', () => {
		const names = projects.map((p) => p.name);
		expect(names).toHaveLength(new Set(names).size);
		expect(names.length).toBeGreaterThan(0);
	});

	it('is the groups, flattened, in their order', () => {
		expect(projects).toEqual(groups.flatMap((g) => g.projects));
	});

	it('puts no group on the page empty', () => {
		for (const g of groups) expect(g.projects.length).toBeGreaterThan(0);
	});

	it('gives every group a label of its own', () => {
		const labels = groups.map((g) => g.label);
		expect(labels).toHaveLength(new Set(labels).size);
	});
});

describe('every tool', () => {
	it.each(projects.map((p) => [p.name, p] as const))('%s is whole', (name, p) => {
		expect(name).toMatch(/^[a-z0-9-]+$/);
		expect(p.line).not.toBe('');
		expect(p.more).not.toBe('');
		expect(p.lang).not.toBe('');
		expect(p.license).not.toBe('');
	});

	// Not photographed yet, and why. The screens studio is a Linux container,
	// so a tool that only runs on a Mac cannot be shot in it; the rest need
	// something the container cannot provide. Each one has a cairn item.
	// This list should only ever get shorter — a tool that falls out of the
	// studio and is not named here fails instead of quietly emptying its page.
	const unshot: Record<string, string> = {
		clackson: 'macOS only, and the page is a sound rather than a picture',
		knit: 'needs more than one machine to be worth showing',
		brevity: 'has no interface: a clipboard, a key and a chime',
		triblenka: 'design stage: nothing is implemented yet',
		foldr: 'early: the CLI answers --help and little else yet',
		rockaway: 'pre-release: the frame engine that would be shown is next',
		// New to the site in wave 4 (cairn 0039 on). Each has an item.
		humanoid: 'needs a story: a scratch repository and an agent pushing into it',
		'ag-test': 'a framework: shown through a failing suite, in a story not written yet',
		subcell: 'pre-release: the terminal half that would be shown is next',
		tzguard: 'needs a story: two tz releases and a dataset that one of them touches',
		'x-post': 'posts to X, so its story has to stop at --dry-run; not written yet',
		oath: 'design stage: oath run and oath swear arrive with v0.1',
		loadstar: 'needs a story: it installs real things, so the container is the place for it',
		windflow: 'a macOS screensaver: needs a desk capture',
		backpage: 'macOS only, and it draws on the wallpaper: needs a desk capture',
		systema: 'its documentation site is not deployed yet',
		arkonk: 'a native Mac game: needs a desk capture',
		rim: 'a desktop game, early: needs a desk capture once it is playable',
		bushy: 'needs a face in front of a camera; without one it is a permission prompt',
		'portfolio-paycheck-gap': 'its site is built in the repository but not deployed yet',
		'joy-of-randomness': 'a course in notebooks, not published as a site yet'
	};

	it.each(projects.map((p) => [p.name, p] as const))('%s has something to show', (name, p) => {
		if (name in unshot) {
			expect(views(p), `${name} is listed as unshot but has views`).toEqual([]);
			return;
		}
		expect(views(p).length).toBeGreaterThan(0);
	});

	it.each(projects.map((p) => [p.name] as const))('%s has a mark of its own', (name) => {
		// identity() falls back rather than leaving a hole in the rail, so the
		// entry is checked directly: a fallback mark is a mark nobody chose.
		expect(identities[name]).toBeDefined();
	});
});

describe('find', () => {
	it('finds a tool by name', () => {
		expect(find(projects[0].name)?.name).toBe(projects[0].name);
	});

	it('finds nothing for a name no tool has', () => {
		expect(find('no-such-tool')).toBeUndefined();
	});

	it('is not fooled by a name that is only a prefix', () => {
		expect(find(projects[0].name.slice(0, -1))).toBeUndefined();
	});
});

describe('neighbours', () => {
	it('walks forwards and backwards through the rail', () => {
		const { prev, next } = neighbours(projects[1].name);
		expect(prev.name).toBe(projects[0].name);
		expect(next.name).toBe(projects[2].name);
	});

	it('wraps round the end, so j never stops', () => {
		const last = projects[projects.length - 1];
		expect(neighbours(last.name).next.name).toBe(projects[0].name);
	});

	it('wraps round the start, so k never stops', () => {
		const last = projects[projects.length - 1];
		expect(neighbours(projects[0].name).prev.name).toBe(last.name);
	});

	it('walks from the first tool for a name it does not know', () => {
		// findIndex gives -1; the arithmetic must still land on a real tool
		// rather than reading off the end of the array.
		const { prev, next } = neighbours('no-such-tool');
		expect(projects).toContain(prev);
		expect(projects).toContain(next);
	});
});

describe('stateLabel', () => {
	it('gives a released tool its version', () => {
		expect(stateLabel({ kind: 'released', version: '1.2.0' })).toBe('v1.2.0');
	});

	it('says where a source build came from, with its version', () => {
		expect(stateLabel({ kind: 'source', version: '0.1.0' })).toBe('v0.1.0 · from source');
	});

	it('says only that it is from source when there is no version', () => {
		expect(stateLabel({ kind: 'source' })).toBe('from source');
	});

	it('names the other states', () => {
		expect(stateLabel({ kind: 'live' })).toBe('live');
		expect(stateLabel({ kind: 'design' })).toBe('pre-release');
	});
});

describe('prerelease', () => {
	it('is true only for a tool designed in the open', () => {
		expect(prerelease(project({ state: { kind: 'design' } }))).toBe(true);
		expect(prerelease(project({ state: { kind: 'live' } }))).toBe(false);
		expect(prerelease(project({ state: { kind: 'released', version: '1.0.0' } }))).toBe(false);
	});
});

describe('stills', () => {
	const shot = { beat: 'hero' as const, caption: 'c', src: 's', width: 2, height: 1 };
	const media = { src: 'r.gif', alt: 'running', width: 1600, height: 1000 };

	it('shows the runner’s own screens when there are any', () => {
		expect(stills(project({ screens: [shot], recording: media }))).toEqual([shot]);
	});

	it('falls back to a recording made elsewhere', () => {
		expect(stills(project({ screens: [], recording: media, poster: 'p.png' }))).toEqual([
			{ beat: 'hero', caption: 'running', ...media }
		]);
	});

	it('falls back again to a poster, described by the tool’s own line', () => {
		const p = project({ screens: [], recording: null, poster: 'p.png', line: 'a line' });
		// A poster is wrapped as media first, so it carries an `alt` along with
		// the caption.
		expect(stills(p)).toEqual([
			{ beat: 'hero', caption: 'a line', alt: 'a line', src: 'p.png', width: 1600, height: 1000 }
		]);
	});

	it('captions a poster with the address it was taken from', () => {
		const p = project({
			screens: [],
			recording: null,
			poster: 'p.png',
			line: 'a line',
			site: 'https://example.org/rover/'
		});
		expect(stills(p)[0]).toMatchObject({
			alt: 'a line',
			caption: 'Captured from example.org/rover, where it runs.'
		});
	});

	it('shows nothing when there is nothing', () => {
		expect(stills(project({ screens: [], recording: null, poster: null }))).toEqual([]);
	});
});

describe('views', () => {
	const cast = { src: 'c.cast', cols: 80, rows: 24, duration: 1, bytes: 1, markers: [] };
	const shot = { beat: 'hero' as const, caption: 'c', src: 's', width: 2, height: 1 };
	const plate = { src: '/media/gallery/x/01-a.webp', caption: 'c', width: 2, height: 1 };
	const sample = { src: '/media/audio/x/01.m4a', caption: 'c', seconds: 3, peaks: [0, 1] };
	const bare = {
		screens: [],
		recording: null,
		poster: null,
		cast: null,
		gallery: [],
		audio: []
	};

	it('prefers the recording, then the screens, then a gallery, then a sound', () => {
		const p = project({ ...bare, cast, screens: [shot], gallery: [plate], audio: [sample] });
		expect(views(p)).toEqual(['recording', 'screens', 'gallery', 'audio']);
	});

	it('leaves out what a tool has not got', () => {
		expect(views(project({ ...bare, gallery: [plate] }))).toEqual(['gallery']);
		expect(views(project({ ...bare, audio: [sample] }))).toEqual(['audio']);
		expect(views(project({ ...bare, screens: [shot] }))).toEqual(['screens']);
	});

	it('is empty when a tool has nothing to show', () => {
		expect(views(project(bare))).toEqual([]);
	});
});

describe('shelves', () => {
	it('puts every group on a shelf that exists', () => {
		const ids = shelves.map((s) => s.id);
		for (const g of groups) expect(ids).toContain(g.shelf);
	});

	it('offers no shelf with nothing on it', () => {
		// The rail only draws the shelves that have groups, but an unused one
		// in the list is a label nobody wrote a section for — say so here
		// rather than leaving it to be noticed on the page.
		for (const s of shelves) {
			expect(
				groups.some((g) => g.shelf === s.id),
				`the ${s.label} shelf has no sections on it`
			).toBe(true);
		}
	});

	it('describes each shelf by what is on it, not by what it is called', () => {
		for (const s of shelves) {
			expect(s.of).not.toBe('');
			expect(s.of.toLowerCase()).not.toContain(s.label.toLowerCase());
		}
	});
});
