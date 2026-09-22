// screens.json is written by a program in a container (`npm run screens`) and
// read by the site through a cast TypeScript cannot check: JSON has no tuples,
// so `markers` arrives as string[][] and is asserted into shape. These tests
// are that assertion, made honest — the shape is checked here, at build time,
// rather than discovered as a blank window in a browser.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import raw from './screens.json';
import { projects } from './projects';
import { sections } from './tools';

const BEATS = ['hero', 'start', 'use', 'depth'];
const index = raw as Record<string, Record<string, unknown>>;
const entries = Object.entries(index);

// A `src` in the data is a site path; on disk it lives under static/.
const inStatic = (src: string) =>
	existsSync(fileURLToPath(new URL(`../../../static${src}`, import.meta.url)));

it('has something in it', () => {
	expect(entries.length).toBeGreaterThan(0);
});

describe.each(entries)('%s', (name, entry) => {
	it('belongs to a tool the site knows', () => {
		expect(projects.map((p) => p.name)).toContain(name);
	});

	it('says who shot it and when', () => {
		// 'desk' is a capture taken by hand on the machine the tool runs on;
		// the page discloses it rather than implying the studio shot it.
		expect(['terminal', 'web', 'desk']).toContain(entry.runner);
		expect(Number.isNaN(Date.parse(entry.takenAt as string))).toBe(false);
	});

	it('names the commit it was shot from, or admits it does not know', () => {
		expect(entry.commit === null || typeof entry.commit === 'string').toBe(true);
		// A desk capture was taken from whatever was on that machine at the
		// time, not from a checkout built here, so it cannot name a commit and
		// must not appear to.
		if (entry.runner === 'desk') expect(entry.commit).toBeNull();
	});

	it('gives the terminal ground as a colour the window can take', () => {
		if (entry.background === undefined) return;
		expect(entry.background).toMatch(/^#[0-9a-f]{6}$/i);
	});

	const shots = (entry.shots ?? []) as Record<string, unknown>[];

	it('has at least one screen', () => {
		expect(shots.length).toBeGreaterThan(0);
	});

	it('tells its story in known beats, each one once, in order', () => {
		const beats = shots.map((s) => s.beat as string);
		for (const b of beats) expect(BEATS).toContain(b);
		expect(beats).toHaveLength(new Set(beats).size);
		const order = beats.map((b) => BEATS.indexOf(b));
		expect(order).toEqual([...order].sort((a, b) => a - b));
	});

	it('starts at a glance', () => {
		expect(shots[0].beat).toBe('hero');
	});

	it.each(shots.map((s, i) => [String(s.beat ?? i), s] as const))(
		'%s is a real picture, with a caption and a size',
		(_beat, s) => {
			expect(s.caption).toEqual(expect.any(String));
			expect(s.caption).not.toBe('');
			expect(s.src).toEqual(expect.stringMatching(/^\/media\/screens\/.+\.(webp|png|gif|svg)$/));
			expect(Number(s.width)).toBeGreaterThan(0);
			expect(Number(s.height)).toBeGreaterThan(0);
			expect(inStatic(s.src as string), `${s.src} is missing from static/`).toBe(true);
		}
	);

	const gallery = (entry.gallery ?? []) as Record<string, unknown>[];

	it.runIf(gallery.length)('has a gallery worth comparing, all of it on disk', () => {
		// One plate is not a comparison; a gallery exists to be read across.
		expect(gallery.length).toBeGreaterThan(2);
		for (const g of gallery) {
			expect(g.caption).toEqual(expect.any(String));
			expect(g.caption).not.toBe('');
			expect(g.src).toEqual(expect.stringMatching(/^\/media\/gallery\/.+\.(webp|png|gif|svg)$/));
			expect(inStatic(g.src as string), `${g.src} is missing from static/`).toBe(true);
			expect(Number(g.width)).toBeGreaterThan(0);
			expect(Number(g.height)).toBeGreaterThan(0);
			// A plate that moves needs a still, or reduced motion has nothing to
			// show and the plate plays whether it was asked to or not.
			if (String(g.src).endsWith('.gif')) expect(g.still).toEqual(expect.any(String));
			if (g.still) expect(inStatic(g.still as string), `${g.still} is missing`).toBe(true);
		}
		const srcs = gallery.map((g) => g.src);
		expect(srcs).toHaveLength(new Set(srcs).size);
	});

	const audio = (entry.audio ?? []) as Record<string, unknown>[];

	it.runIf(audio.length)('has samples on disk, each with a waveform of its own', () => {
		for (const a of audio) {
			expect(a.caption).toEqual(expect.any(String));
			expect(a.caption).not.toBe('');
			expect(a.src).toEqual(expect.stringMatching(/^\/media\/audio\/.+\.(m4a|mp3|ogg|wav)$/));
			expect(inStatic(a.src as string), `${a.src} is missing from static/`).toBe(true);
			// The page says how long a sample is before it starts, so it has to know.
			expect(Number(a.seconds)).toBeGreaterThan(0);
			const peaks = a.peaks as number[];
			expect(Array.isArray(peaks)).toBe(true);
			expect(peaks.length).toBeGreaterThan(8);
			for (const v of peaks) expect(v).toBeGreaterThanOrEqual(0);
			for (const v of peaks) expect(v).toBeLessThanOrEqual(1);
			// A waveform measured off silence would draw a flat line and say
			// nothing; something in the take has to have been loud.
			expect(Math.max(...peaks)).toBeGreaterThan(0.2);
		}
		const srcs = audio.map((a) => a.src);
		expect(srcs).toHaveLength(new Set(srcs).size);
	});

	const cast = entry.cast as Record<string, unknown> | undefined;

	it.runIf(cast)('has a recording that is on disk and makes sense', () => {
		expect(cast!.src).toEqual(expect.stringMatching(/^\/media\/casts\/.+\.cast$/));
		expect(inStatic(cast!.src as string), `${cast!.src} is missing from static/`).toBe(true);
		expect(Number(cast!.cols)).toBeGreaterThan(0);
		expect(Number(cast!.rows)).toBeGreaterThan(0);
		expect(Number(cast!.duration)).toBeGreaterThan(0);
		expect(Number(cast!.bytes)).toBeGreaterThan(0);
	});

	it.runIf(cast)('has chapters that are beats it actually shot, in time order', () => {
		const markers = (cast!.markers ?? []) as [number, string][];
		const beats = shots.map((s) => s.beat);
		for (const m of markers) {
			expect(m).toHaveLength(2);
			expect(typeof m[0]).toBe('number');
			// A chapter is a screenshot beat: the two views name the same things.
			expect(beats).toContain(m[1]);
		}
		const times = markers.map((m) => m[0]);
		expect(times).toEqual([...times].sort((a, b) => a - b));
		expect(Math.max(0, ...times)).toBeLessThanOrEqual(Number(cast!.duration));
	});

	// The poster is the hero frame, so a recording without one opens on
	// whatever happened to be first. And the runner cuts a recording a breath
	// after its last chapter (TAIL in screens/runner/record.mjs): anything past
	// that is someone watching a finished screen, waiting for the loop.
	it.runIf(cast)('opens on its hero and ends soon after its last chapter', () => {
		const markers = (cast!.markers ?? []) as [number, string][];
		expect(markers.map((m) => m[1])).toContain('hero');
		const last = Math.max(...markers.map((m) => m[0]));
		expect(Number(cast!.duration) - last).toBeLessThanOrEqual(2);
	});
});

// The join projects.ts performs, checked from the other side.
describe('what the site makes of it', () => {
	it('gives each tool the screens shot of it, and no others', () => {
		for (const p of projects) {
			const shots = (index[p.name]?.shots ?? []) as unknown[];
			expect(p.screens).toHaveLength(shots.length);
			for (const s of p.screens) expect(s.src).toContain(`/screens/${p.name}/`);
		}
	});

	it('leaves a tool the runner never shot with nothing rather than something wrong', () => {
		for (const p of projects.filter((p) => !index[p.name])) {
			expect(p.screens).toEqual([]);
			expect(p.cast).toBeNull();
			expect(p.screenBackground).toBeNull();
		}
	});
});

// The hand-written side of the data, checked for the mistakes a hand makes.
describe('tools.ts', () => {
	const tools = sections.flatMap((s) => s.tools);

	it('lists every tool under exactly one heading', () => {
		expect(tools).toHaveLength(projects.length);
	});

	it.each(tools.map((t) => [t.name, t] as const))('%s is described sensibly', (_name, t) => {
		// The line is the page's subtitle and the rail's tooltip: one sentence,
		// finished — a few of them ask rather than tell.
		expect(t.line.length).toBeLessThan(120);
		expect(t.line).toMatch(/[.?!]$/);
		expect(t.more.length).toBeGreaterThan(t.line.length);
		expect(t.tags.length).toBeGreaterThan(0);
	});

	it.each(tools.map((t) => [t.name, t] as const))('%s links somewhere real', (name, t) => {
		if (t.site) expect(t.site).toMatch(/^https:\/\//);
		// A site belongs to the tool whose entry it sits in. gummyworm.dev
		// once advertised itself from clackson's page for a day, because an
		// insertion landed one entry out and nothing was watching.
		if (t.site) {
			const host = new URL(t.site).hostname.replace(/^www\./, '');
			const path = new URL(t.site).pathname;
			expect(
				host.startsWith(name) || path.includes(name),
				`${name} links to ${t.site}, which does not name it`
			).toBe(true);
		}
		if (t.install) expect(t.install.trim()).toBe(t.install);
	});
});
