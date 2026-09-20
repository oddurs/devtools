import { describe, expect, it } from 'vitest';
import { identities } from '$lib/design/identity';
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

	it.each(projects.map((p) => [p.name, p] as const))('%s has something to show', (_name, p) => {
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

	it('falls back again to a poster, captioned with the tool’s own line', () => {
		const p = project({ screens: [], recording: null, poster: 'p.png', line: 'a line' });
		// A poster is wrapped as media first, so it carries an `alt` along with
		// the caption made from it.
		expect(stills(p)).toEqual([
			{ beat: 'hero', caption: 'a line', alt: 'a line', src: 'p.png', width: 1600, height: 1000 }
		]);
	});

	it('shows nothing when there is nothing', () => {
		expect(stills(project({ screens: [], recording: null, poster: null }))).toEqual([]);
	});
});

describe('views', () => {
	const cast = { src: 'c.cast', cols: 80, rows: 24, duration: 1, bytes: 1, markers: [] };
	const shot = { beat: 'hero' as const, caption: 'c', src: 's', width: 2, height: 1 };
	const bare = { screens: [], recording: null, poster: null, cast: null, demo: [] };

	it('prefers the recording, then the screens, then the session', () => {
		const p = project({ ...bare, cast, screens: [shot], demo: [{ cmd: 'x' }] });
		expect(views(p)).toEqual(['recording', 'screens', 'session']);
	});

	it('leaves out what a tool has not got', () => {
		expect(views(project({ ...bare, demo: [{ cmd: 'x' }] }))).toEqual(['session']);
		expect(views(project({ ...bare, screens: [shot] }))).toEqual(['screens']);
	});

	it('is empty when a tool has nothing to show', () => {
		expect(views(project(bare))).toEqual([]);
	});
});
