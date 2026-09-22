import { describe, expect, it } from 'vitest';
import {
	chapterAt,
	clock,
	keyAt,
	parse,
	pointerAt,
	posterAt,
	speedAt,
	type Recording
} from './cast';

// An asciicast as the screens runner writes one: a header line, then one JSON
// array per line. `x_devtools` is our own addition — the pointer, the keys and
// the time-lapses the player draws over the terminal.
function cast(x: Record<string, unknown> = {}, events: string[] = []): string {
	const header = JSON.stringify({ version: 2, width: 120, height: 30, x_devtools: x });
	return [header, ...events].join('\n');
}

describe('parse', () => {
	it('reads the size off the header', () => {
		const rec = parse(cast());
		expect(rec.cols).toBe(120);
		expect(rec.rows).toBe(30);
	});

	it('keeps the events in order, as written', () => {
		const rec = parse(cast({}, ['[0.5,"o","hi"]', '[1.5,"o"," there"]']));
		expect(rec.events).toEqual([
			[0.5, 'o', 'hi'],
			[1.5, 'o', ' there']
		]);
	});

	it('runs a beat past the last thing that happened, so the end is seen', () => {
		const rec = parse(cast({}, ['[4,"o","x"]']));
		expect(rec.duration).toBe(5);
	});

	it('counts a late pointer or keystroke towards the duration', () => {
		const rec = parse(cast({ pointer: [[9, 1, 1, 'move']], keys: [[12, 'q']] }, ['[1,"o","x"]']));
		expect(rec.duration).toBe(13);
	});

	it('is never negative, even with nothing in it', () => {
		expect(parse(cast()).duration).toBe(1);
	});

	it('pulls the chapters out of the marker events', () => {
		const rec = parse(
			cast({}, ['[0,"o","x"]', '[2,"m","hero"]', '[5,"o","y"]', '[9,"m","depth"]'])
		);
		expect(rec.markers).toEqual([
			[2, 'hero'],
			[9, 'depth']
		]);
	});

	it('tolerates a cast with no x_devtools at all', () => {
		const plain = [JSON.stringify({ version: 2, width: 80, height: 24 }), '[1,"o","x"]'].join('\n');
		const rec = parse(plain);
		expect(rec.pointer).toEqual([]);
		expect(rec.keys).toEqual([]);
		expect(rec.speeds).toEqual([]);
	});

	it('ignores blank lines around the recording', () => {
		expect(parse('\n' + cast({}, ['[1,"o","x"]']) + '\n\n').events).toHaveLength(1);
	});
});

// A recording built by hand, so each function is asked about one thing only.
function rec(over: Partial<Recording> = {}): Recording {
	return {
		cols: 80,
		rows: 24,
		duration: 10,
		events: [],
		markers: [],
		pointer: [],
		keys: [],
		speeds: [],
		...over
	};
}

describe('posterAt', () => {
	it('rests on the hero frame', () => {
		const markers: [number, string][] = [
			[2, 'hero'],
			[5, 'start']
		];
		expect(posterAt(rec({ markers }))).toBe(2);
	});

	it('finds the hero by name when a story shot it after another beat', () => {
		// brainiac shoots 'start' first; the poster is still its hero.
		const markers: [number, string][] = [
			[1, 'start'],
			[4, 'use'],
			[9, 'hero']
		];
		expect(posterAt(rec({ markers }))).toBe(9);
	});

	it('falls back to the first chapter when there is no hero', () => {
		const markers: [number, string][] = [
			[3, 'use'],
			[7, 'depth']
		];
		expect(posterAt(rec({ markers }))).toBe(3);
	});

	it('rests at the start of a recording with no chapters', () => {
		expect(posterAt(rec())).toBe(0);
	});
});

describe('chapterAt', () => {
	const markers: [number, string][] = [
		[2, 'hero'],
		[5, 'use'],
		[8, 'depth']
	];

	it('is -1 before the first chapter starts', () => {
		expect(chapterAt(rec({ markers }), 1.9)).toBe(-1);
	});

	it('enters a chapter on its marker', () => {
		expect(chapterAt(rec({ markers }), 2)).toBe(0);
	});

	it('stays in a chapter until the next one', () => {
		expect(chapterAt(rec({ markers }), 4.9)).toBe(0);
		expect(chapterAt(rec({ markers }), 5)).toBe(1);
	});

	it('holds the last chapter to the end', () => {
		expect(chapterAt(rec({ markers }), 99)).toBe(2);
	});

	it('has no chapter when the recording has no markers', () => {
		expect(chapterAt(rec(), 5)).toBe(-1);
	});
});

describe('speedAt', () => {
	const speeds: [number, number][] = [
		[3, 8],
		[6, 1]
	];

	it('runs at one until a time-lapse begins', () => {
		expect(speedAt(rec({ speeds }), 2.9)).toBe(1);
	});

	it('takes the factor in force', () => {
		expect(speedAt(rec({ speeds }), 3)).toBe(8);
		expect(speedAt(rec({ speeds }), 5.9)).toBe(8);
	});

	it('drops back when the lapse ends', () => {
		expect(speedAt(rec({ speeds }), 6)).toBe(1);
	});
});

describe('keyAt', () => {
	const keys: [number, string][] = [
		[1, 'j'],
		[4, 'esc']
	];

	it('shows nothing before the first key', () => {
		expect(keyAt(rec({ keys }), 0.5)).toBeNull();
	});

	it('shows a key as it is pressed, fully fresh', () => {
		expect(keyAt(rec({ keys }), 1)).toEqual({ label: 'j', age: 0 });
	});

	it('ages the key towards the moment it goes', () => {
		expect(keyAt(rec({ keys }), 1.7)?.age).toBeCloseTo(0.5);
	});

	it('takes it off the screen once it has had its time', () => {
		expect(keyAt(rec({ keys }), 2.5)).toBeNull();
	});

	it('shows the latest key, not the first', () => {
		expect(keyAt(rec({ keys }), 4.2)?.label).toBe('esc');
	});
});

describe('pointerAt', () => {
	it('is absent before the pointer has been anywhere', () => {
		expect(pointerAt(rec({ pointer: [[5, 10, 4, 'move']] }), 4.9)).toBeNull();
		expect(pointerAt(rec(), 1)).toBeNull();
	});

	it('sits still where it was left', () => {
		const p = pointerAt(rec({ pointer: [[1, 10, 4, 'move']] }), 1.5);
		expect(p).toMatchObject({ col: 10, row: 4, pressed: false });
	});

	it('glides between two points, arriving on time', () => {
		const pointer: [number, number, number, string][] = [
			[0, 0, 0, 'move'],
			[2, 20, 10, 'move']
		];
		expect(pointerAt(rec({ pointer }), 0)).toMatchObject({ col: 0, row: 0 });
		// Eased, so the halfway point in time is the halfway point in space.
		expect(pointerAt(rec({ pointer }), 1)).toMatchObject({ col: 10, row: 5 });
		expect(pointerAt(rec({ pointer }), 2)).toMatchObject({ col: 20, row: 10 });
	});

	it('eases in and out rather than moving at a constant rate', () => {
		const pointer: [number, number, number, string][] = [
			[0, 0, 0, 'move'],
			[2, 20, 0, 'move']
		];
		// A quarter of the way through the time, less than a quarter of the way
		// across: the glide starts slow.
		expect(pointerAt(rec({ pointer }), 0.5)!.col).toBeLessThan(5);
	});

	it('does not glide towards a click; it is already there', () => {
		const pointer: [number, number, number, string][] = [
			[0, 7, 3, 'move'],
			[2, 7, 3, 'down']
		];
		expect(pointerAt(rec({ pointer }), 1)).toMatchObject({ col: 7, row: 3 });
	});

	it('knows the button is held down', () => {
		const pointer: [number, number, number, string][] = [
			[0, 7, 3, 'down'],
			[1, 7, 3, 'up']
		];
		expect(pointerAt(rec({ pointer }), 0.5)?.pressed).toBe(true);
		expect(pointerAt(rec({ pointer }), 1.5)?.pressed).toBe(false);
	});

	it('spreads a ring out from a click, then lets it go', () => {
		const pointer: [number, number, number, string][] = [[1, 7, 3, 'down']];
		expect(pointerAt(rec({ pointer }), 1)?.ring).toBe(0);
		expect(pointerAt(rec({ pointer }), 1.225)?.ring).toBeCloseTo(0.5);
		expect(pointerAt(rec({ pointer }), 1.5)?.ring).toBeNull();
	});

	it('draws no ring for a move', () => {
		expect(pointerAt(rec({ pointer: [[1, 7, 3, 'move']] }), 1.1)?.ring).toBeNull();
	});

	it('fades a pointer that has been still a long time', () => {
		const pointer: [number, number, number, string][] = [[0, 7, 3, 'move']];
		expect(pointerAt(rec({ pointer }), 2)?.fade).toBe(1);
		expect(pointerAt(rec({ pointer }), 2.8)?.fade).toBeCloseTo(0.5);
		expect(pointerAt(rec({ pointer }), 5)?.fade).toBe(0);
	});
});

describe('clock', () => {
	it('counts seconds', () => {
		expect(clock(0)).toBe('0:00');
		expect(clock(9)).toBe('0:09');
	});

	it('pads the seconds so the width never jumps', () => {
		expect(clock(65)).toBe('1:05');
	});

	it('rolls over into minutes', () => {
		expect(clock(600)).toBe('10:00');
	});

	it('floors a part-second rather than rounding up past it', () => {
		expect(clock(9.9)).toBe('0:09');
	});

	it('never shows a negative time', () => {
		expect(clock(-3)).toBe('0:00');
	});
});
