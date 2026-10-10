import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { search } from './search';

// The real shelf, because the question this has to answer is "does typing
// three letters get me the tool I meant", and that depends on the other
// forty-nine names being there to be wrong.
const find = (q: string) => search(projects, q).map((h) => h.project.name);
const top = (q: string) => find(q)[0];

describe('search', () => {
	it('finds nothing for nothing', () => {
		expect(search(projects, '')).toEqual([]);
		expect(search(projects, '   ')).toEqual([]);
	});

	it('puts an exact name first', () => {
		expect(top('nun')).toBe('nun');
		expect(top('cairn')).toBe('cairn');
	});

	it('answers a prefix with the tool it starts', () => {
		expect(top('po')).toBe('poptop');
		expect(top('yog')).toBe('yoghurt');
		expect(top('rss')).toBe('rsst');
		expect(top('fin')).toBe('findr');
	});

	it('finds a tool by what it is for, not only by its name', () => {
		expect(find('rewind')).toContain('poptop');
		expect(find('worktree')).toContain('caligula');
		expect(find('clipboard')).toContain('brevity');
	});

	it('finds a tool by its tags', () => {
		expect(find('ascii')).toContain('gummyworm');
		expect(find('ratatui')).toContain('poptop');
	});

	it('says where it found each one, so the list can show why', () => {
		const [hit] = search(projects, 'ascii');
		expect(hit.where).toBe('tag');
		expect(hit.tag).toBe('ascii art');
		expect(hit.why).toBe('ascii art');
	});

	it('quotes the paragraph when that is where the match was', () => {
		// Otherwise the row answers a query with a sentence that does not
		// contain it, and reads as a mistake rather than as a deeper match.
		const hit = search(projects, 'javascript').find((h) => h.where === 'words');
		expect(hit).toBeDefined();
		expect(hit!.why.toLowerCase()).toContain('javascript');
		expect(hit!.why.length).toBeLessThan(90);
	});

	it('always has something to show under the name', () => {
		for (const q of ['po', 'ascii', 'rewind', 'gmwm']) {
			for (const hit of search(projects, q)) expect(hit.why).not.toBe('');
		}
	});

	it('takes an abbreviation of a name', () => {
		expect(find('gmwm')).toContain('gummyworm');
		expect(find('trbr')).toContain('turborust');
	});

	it('does not answer a long query with scattered letters', () => {
		// Every letter of this is somewhere in some name, in order; none of
		// them is what was asked for.
		expect(find('aeioustn')).toEqual([]);
	});

	it('is not case sensitive', () => {
		expect(top('CAIRN')).toBe('cairn');
		expect(top('Poptop')).toBe('poptop');
	});

	it('returns each tool at most once', () => {
		for (const q of ['a', 'r', 'ter', 'git']) {
			const names = find(q);
			expect(names).toHaveLength(new Set(names).size);
		}
	});
});
