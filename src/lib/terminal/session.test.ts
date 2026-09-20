import { describe, expect, it } from 'vitest';
import type { Step } from '$lib/data/projects';
import { bare, complete, css, run, runs, tallest, widest } from './session';

const ESC = '\u001b';

const steps: Step[] = [
	{ cmd: 'quarry', out: 'a listening port' },
	{ cmd: 'quarry --json  # every field', out: '{}' },
	{ cmd: 'quarry kill 8080' }
];

describe('bare', () => {
	it('leaves a plain command alone', () => {
		expect(bare('quarry --json')).toBe('quarry --json');
	});

	it('drops the comment a demo hangs off the end', () => {
		expect(bare('quarry --json  # every field')).toBe('quarry --json');
	});

	it('collapses the run of spaces a demo lines things up with', () => {
		expect(bare('quarry   kill    8080')).toBe('quarry kill 8080');
	});

	it('trims the ends', () => {
		expect(bare('  quarry  ')).toBe('quarry');
	});

	it('keeps a hash that is part of the command, not a comment', () => {
		expect(bare('git show HEAD#1')).toBe('git show HEAD#1');
	});
});

describe('complete', () => {
	it('finishes a command from its first letters', () => {
		expect(complete('quarry k', steps)).toBe('quarry kill 8080');
	});

	it('completes to the command as typed, without its comment', () => {
		expect(complete('quarry --', steps)).toBe('quarry --json');
	});

	it('offers nothing for an empty line', () => {
		expect(complete('', steps)).toBeNull();
		expect(complete('   ', steps)).toBeNull();
	});

	it('offers nothing once the command is whole', () => {
		expect(complete('quarry kill 8080', steps)).toBeNull();
	});

	it('offers nothing it does not know', () => {
		expect(complete('vim', steps)).toBeNull();
	});

	it('takes the first of several that fit', () => {
		expect(complete('q', steps)).toBe('quarry');
	});
});

describe('run', () => {
	it('does nothing with an empty line', () => {
		expect(run('   ', steps, 'quarry')).toEqual({ lines: [] });
	});

	it('clears the screen', () => {
		expect(run('clear', steps, 'quarry')).toEqual({ clear: true });
	});

	it('prints what a recorded command really printed', () => {
		expect(run('quarry', steps, 'quarry')).toEqual({
			lines: [{ kind: 'out', text: 'a listening port' }]
		});
	});

	it('matches a command through its comment and spacing', () => {
		expect(run('quarry    --json', steps, 'quarry')).toEqual({
			lines: [{ kind: 'out', text: '{}' }]
		});
	});

	it('prints nothing for a recorded command that printed nothing', () => {
		expect(run('quarry kill 8080', steps, 'quarry')).toEqual({ lines: [] });
	});

	it('lists what it knows, on help and on ls', () => {
		for (const word of ['help', 'ls']) {
			const out = run(word, steps, 'quarry');
			expect(out).not.toHaveProperty('clear', true);
			const text = (out as { lines: { text: string }[] }).lines.map((l) => l.text).join('\n');
			expect(text).toContain('quarry --json');
			expect(text).not.toContain('# every field');
		}
	});

	it('admits it has no recording, rather than inventing one', () => {
		const out = run('quarry --watch', steps, 'quarry') as { lines: { kind: string }[] };
		expect(out.lines[0].kind).toBe('note');
		expect(out.lines[0]).toHaveProperty(
			'text',
			expect.stringContaining('No recording of that one')
		);
	});

	it('answers for anything else the way the shell would', () => {
		expect(run('vim', steps, 'quarry')).toEqual({
			lines: [{ kind: 'out', text: 'fish: Unknown command: vim' }]
		});
	});
});

describe('runs, on a command', () => {
	it('is one run when there is no comment', () => {
		expect(runs('quarry --json', true)).toEqual([{ text: 'quarry --json' }]);
	});

	it('sets the comment apart so it can be said quietly', () => {
		// The split is at the last space before the hash, so the comment run
		// carries the space that sets it off.
		expect(runs('quarry  # every field', true)).toEqual([
			{ text: 'quarry ' },
			{ text: ' # every field', tone: 'comment' }
		]);
	});
});

describe('runs, on output', () => {
	it('is one plain run when nothing is coloured', () => {
		expect(runs('all quiet')).toEqual([{ text: 'all quiet' }]);
	});

	it('takes the sixteen colours from their codes', () => {
		expect(runs(`${ESC}[31mred${ESC}[0m plain`)).toEqual([
			{ text: 'red', fg: 1 },
			{ text: ' plain' }
		]);
	});

	it('reads a bright colour as its own index', () => {
		expect(runs(`${ESC}[94mblue`)).toEqual([{ text: 'blue', fg: 12 }]);
	});

	it('carries weight and dimness, and lets them go again', () => {
		expect(runs(`${ESC}[1mbold${ESC}[22mplain`)).toEqual([
			{ text: 'bold', bold: true },
			{ text: 'plain', bold: false, dim: false }
		]);
	});

	it('keeps italic and underline apart from one another', () => {
		expect(runs(`${ESC}[3;4mboth${ESC}[23mjust underlined`)).toEqual([
			{ text: 'both', italic: true, underline: true },
			{ text: 'just underlined', italic: false, underline: true }
		]);
	});

	it('takes a colour off again without disturbing the rest', () => {
		expect(runs(`${ESC}[1;31mboth${ESC}[39mstill bold`)).toEqual([
			{ text: 'both', bold: true, fg: 1 },
			{ text: 'still bold', bold: true }
		]);
	});

	it('reads a bare reset as a full reset', () => {
		expect(runs(`${ESC}[1;31mon${ESC}[moff`)).toEqual([
			{ text: 'on', bold: true, fg: 1 },
			{ text: 'off' }
		]);
	});

	it('keeps a 256-colour code inside the palette as a palette index', () => {
		expect(runs(`${ESC}[38;5;9mred`)).toEqual([{ text: 'red', fg: 9 }]);
	});

	it('resolves a 256-colour cube code to its own colour', () => {
		// 16 is the corner of the cube: black.
		expect(runs(`${ESC}[38;5;16mx`)).toEqual([{ text: 'x', fg: 'rgb(0 0 0)' }]);
		// 231 is the opposite corner: white.
		expect(runs(`${ESC}[38;5;231mx`)).toEqual([{ text: 'x', fg: 'rgb(255 255 255)' }]);
	});

	it('resolves the grey ramp at the top of the 256 colours', () => {
		expect(runs(`${ESC}[38;5;232mx`)).toEqual([{ text: 'x', fg: 'rgb(8 8 8)' }]);
	});

	it('takes a true colour as it is given', () => {
		expect(runs(`${ESC}[38;2;12;34;56mx`)).toEqual([{ text: 'x', fg: 'rgb(12 34 56)' }]);
	});

	it('sets uncoloured box drawing back, so the data inside reads first', () => {
		expect(runs('│ 8080 │')).toEqual([
			{ text: '│', tone: 'frame' },
			{ text: ' 8080 ' },
			{ text: '│', tone: 'frame' }
		]);
	});

	it('leaves box drawing alone when the program coloured it itself', () => {
		expect(runs(`${ESC}[32m│ ok │`)).toEqual([{ text: '│ ok │', fg: 2 }]);
	});

	it('throws away escapes that are not about colour', () => {
		expect(runs(`${ESC}[2Jcleared${ESC}[1;1H`)).toEqual([{ text: 'cleared' }]);
		expect(runs(`${ESC}]0;a title\u0007text`)).toEqual([{ text: 'text' }]);
	});

	it('is empty for empty text', () => {
		expect(runs('')).toEqual([]);
	});
});

describe('css', () => {
	it('says nothing about a run with nothing on it', () => {
		expect(css({ text: 'x' })).toBe('');
	});

	it('points a palette index at the scheme, not at a fixed colour', () => {
		expect(css({ text: 'x', fg: 3 })).toBe('color:var(--ansi-3)');
	});

	it('writes a true colour out as it is', () => {
		expect(css({ text: 'x', fg: 'rgb(1 2 3)' })).toBe('color:rgb(1 2 3)');
	});

	it('joins everything a run carries into one declaration', () => {
		expect(css({ text: 'x', fg: 1, bold: true, dim: true, italic: true, underline: true })).toBe(
			'color:var(--ansi-1);font-weight:700;opacity:0.6;font-style:italic;text-decoration:underline'
		);
	});

	it('leaves out what is switched off', () => {
		expect(css({ text: 'x', bold: false, dim: false })).toBe('');
	});
});

describe('tallest', () => {
	it('counts each command, its output, and the prompt after it', () => {
		// 1 command + 3 output lines + the prompt's 3 = 7, under the floor.
		expect(tallest([{ cmd: 'a', out: 'x\ny\nz' }])).toBe(10);
	});

	it('never shrinks below a window worth looking at', () => {
		expect(tallest([])).toBe(10);
	});

	it('never grows past a screen', () => {
		expect(tallest([{ cmd: 'a', out: 'x\n'.repeat(400) }])).toBe(34);
	});

	it('grows with the session in between', () => {
		const rows = tallest([{ cmd: 'a', out: Array(16).fill('x').join('\n') }]);
		expect(rows).toBe(20);
	});
});

describe('widest', () => {
	it('holds a sensible minimum for a short session', () => {
		expect(widest([{ cmd: 'ls' }])).toBe(64);
	});

	it('widens to the longest line there is, prompt included', () => {
		const long = 'x'.repeat(100);
		expect(widest([{ cmd: 'a', out: long }])).toBe(100);
	});

	it('measures the prompt as part of the command line', () => {
		expect(widest([{ cmd: 'x'.repeat(80) }])).toBe(82);
	});

	it('measures what is seen, not the escapes that colour it', () => {
		expect(widest([{ cmd: 'a', out: `${ESC}[31m${'x'.repeat(100)}${ESC}[0m` }])).toBe(100);
	});
});
