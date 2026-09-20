import { describe, expect, it } from 'vitest';
import { contrast, oklch } from './color.js';

const hex = /^#[0-9a-f]{6}$/;

describe('oklch', () => {
	it('is always a six-digit hex colour', () => {
		for (const h of [0, 75, 135, 195, 255, 345]) expect(oklch(0.78, 0.11, h)).toMatch(hex);
	});

	it('takes no chroma as grey: all three channels equal', () => {
		const grey = oklch(0.6, 0, 0);
		expect(grey.slice(1, 3)).toBe(grey.slice(3, 5));
		expect(grey.slice(3, 5)).toBe(grey.slice(5, 7));
	});

	it('bottoms out at black and tops out at white', () => {
		expect(oklch(0, 0, 0)).toBe('#000000');
		expect(oklch(1, 0, 0)).toBe('#ffffff');
	});

	it('is the same colour every time it is asked', () => {
		expect(oklch(0.78, 0.11, 135)).toBe(oklch(0.78, 0.11, 135));
	});

	it('goes lighter as lightness rises', () => {
		const lum = (c: string) => parseInt(c.slice(1, 3), 16) + parseInt(c.slice(5, 7), 16);
		expect(lum(oklch(0.9, 0.02, 255))).toBeGreaterThan(lum(oklch(0.4, 0.02, 255)));
	});

	it('turns the hue angle into a different colour', () => {
		expect(oklch(0.78, 0.11, 15)).not.toBe(oklch(0.78, 0.11, 135));
	});

	it('comes back round: 360 degrees is 0 degrees', () => {
		expect(oklch(0.7, 0.1, 360)).toBe(oklch(0.7, 0.1, 0));
	});

	it('keeps lightness and hue when a colour will not fit in sRGB', () => {
		// Far more chroma than sRGB holds: the answer is the same hue, dulled,
		// not a channel clipped to a different colour.
		const asked = oklch(0.78, 0.4, 135);
		const fits = oklch(0.78, 0.11, 135);
		expect(asked).toMatch(hex);
		const chan = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
		// Green stays the strongest channel either way.
		expect(chan(asked, 1)).toBeGreaterThan(chan(asked, 0));
		expect(chan(fits, 1)).toBeGreaterThan(chan(fits, 0));
	});

	it('never clips a channel out of range', () => {
		for (const c of [0.05, 0.2, 0.5]) {
			for (const h of [0, 90, 180, 270]) {
				const out = oklch(0.78, c, h);
				expect(out).toMatch(hex);
			}
		}
	});
});

describe('contrast', () => {
	it('is 21 to 1 between black and white', () => {
		expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
	});

	it('is 1 to 1 between a colour and itself', () => {
		expect(contrast('#4a4a4a', '#4a4a4a')).toBeCloseTo(1, 10);
	});

	it('does not care which way round the two are given', () => {
		expect(contrast('#0d0d0c', '#ebeae6')).toBeCloseTo(contrast('#ebeae6', '#0d0d0c'), 10);
	});

	it('agrees with the known ratio for mid grey on white', () => {
		// #767676 on white is the canonical 4.54:1 — the grey that just passes AA.
		expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 1);
	});
});

describe('the site’s own text', () => {
	it('reads comfortably against its ground', () => {
		// --ink on --paper, as tokens.css sets them.
		expect(contrast('#ebeae6', '#0d0d0c')).toBeGreaterThan(7);
	});
});
