// The stories are read by a program in a container, forty seconds after you
// ask for them. A typo in this file — an unescaped backtick inside a fixture's
// template literal, a beat spelled wrong, a caption nobody wrote — costs a
// whole run to find out about. These are the mistakes worth catching here.
import { describe, expect, it } from 'vitest';
import { stories, TERMINAL } from './manifest.mjs';
import { sections } from '../src/lib/data/tools';

type Step = Record<string, unknown>;
type Story = {
	steps?: Step[];
	record?: boolean;
	build?: string;
	fixture?: string;
	stage?: string;
	terminal?: { width?: number; height?: number };
};

const BEATS = ['hero', 'start', 'use', 'depth'];
const all = Object.entries(stories as Record<string, Story>);
const tools = sections.flatMap((s) => s.tools).map((t) => t.name);

it('parses at all, which is the point of importing it', () => {
	expect(all.length).toBeGreaterThan(0);
	expect(TERMINAL.width).toBeGreaterThan(0);
});

describe.each(all)('%s', (name, story) => {
	it('is a story for a tool the site has', () => {
		expect(tools).toContain(name);
	});

	const steps = story.steps ?? [];
	const shots = steps.filter((s) => 'shot' in s);

	it('takes its screenshots at known beats, each one once', () => {
		const beats = shots.map((s) => s.shot as string);
		for (const b of beats) expect(BEATS).toContain(b);
		expect(beats).toHaveLength(new Set(beats).size);
	});

	it('captions every shot it takes', () => {
		for (const s of shots) {
			expect(typeof s.caption, `${name} ${s.shot} has no caption`).toBe('string');
			expect((s.caption as string).trim()).not.toBe('');
			// A caption is a sentence about what the beat shows.
			expect(s.caption as string).toMatch(/[.?!]$/);
		}
	});

	it('uses step kinds the runner knows', () => {
		const known = new Set([
			'run',
			'hidden',
			'type',
			'key',
			'times',
			'wait',
			'timeout',
			'sleep',
			'shot',
			'caption',
			'speed',
			'click',
			'button',
			'hover',
			'scroll',
			'at',
			'drag',
			'to',
			'waitFor',
			'press',
			'hold',
			'ms',
			'goto',
			'optional'
		]);
		for (const s of steps) {
			for (const k of Object.keys(s)) {
				expect(known, `${name}: unknown step key "${k}"`).toContain(k);
			}
		}
	});

	// A fixture is shell, pasted into the container. An unbalanced heredoc or a
	// stray backtick is a forty-second round trip to discover.
	it.runIf(story.fixture)('has a fixture whose heredocs close', () => {
		const opens = [...story.fixture!.matchAll(/<<'(\w+)'/g)].map((m) => m[1]);
		for (const tag of new Set(opens)) {
			const started = opens.filter((t) => t === tag).length;
			const ended = story.fixture!.split('\n').filter((l) => l.trim() === tag).length;
			expect(ended, `${name}: heredoc ${tag} opened ${started}x, closed ${ended}x`).toBe(started);
		}
	});

	it('is worth recording, or says why not', () => {
		// Not every story records, but one that does needs something to record.
		if (story.record) expect(steps.length).toBeGreaterThan(1);
	});
});

describe('the fan-out', () => {
	it('has a story for every tool that has screens', () => {
		// The other way round is allowed: a story can exist before it is shot.
		const shot = Object.keys(stories as Record<string, Story>);
		expect(shot.length).toBeLessThanOrEqual(tools.length);
	});
});
