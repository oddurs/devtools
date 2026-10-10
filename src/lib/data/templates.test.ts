import { describe, expect, it } from 'vitest';
import { projects, find, type Project } from './projects';
import { TEMPLATES, address, page } from './templates';

const get = (name: string): Project => {
	const p = find(name);
	if (!p) throw new Error(`no ${name}`);
	return p;
};

describe('page', () => {
	it('gives a thing at an address a button that goes there', () => {
		expect(page(get('sharkplane')).go).toEqual({
			verb: 'Play',
			href: 'https://oddurs.github.io/sharkplane/'
		});
	});

	it('leads a game with its picture and a terminal tool with its words', () => {
		expect(page(get('sharkplane')).lead).toBe('picture');
		expect(page(get('poptop')).lead).toBe('words');
	});

	it('has no button for a game with no address: arkonk is built, not visited', () => {
		expect(page(get('arkonk')).go).toBeNull();
	});

	it('lets the words lead when there is no picture to lead with', () => {
		expect(page(get('arkonk')).lead).toBe('words');
	});

	it('lets a tool say its own verb where the kind’s is wrong for it', () => {
		expect(page(get('rover')).go?.verb).toBe('Drive');
	});

	it('never offers a button to something installed from a command', () => {
		for (const p of projects.filter((p) => TEMPLATES[p.kind].verb === null && !p.verb)) {
			expect(page(p).go, p.name).toBeNull();
		}
	});
});

describe('every tool', () => {
	it.each(projects.map((p) => [p.name, p] as const))('%s has a way in', (name, p) => {
		// A page with neither a button nor a command leaves the reader with
		// only the source; that is allowed for a design-stage tool and nothing
		// else.
		const t = page(p);
		if (p.state.kind === 'design') return;
		expect(Boolean(t.go || p.install || p.site), `${name} has no way in`).toBe(true);
	});
});

describe('address', () => {
	it('drops the scheme and the trailing slash', () => {
		expect(address('https://oddurs.github.io/rover/')).toBe('oddurs.github.io/rover');
		expect(address('https://3310.love/')).toBe('3310.love');
	});
});
