// A terminal session, recorded as asciicast v2: the bytes the program wrote,
// with timestamps. Fed by the runner's WebSocket bridge between ttyd and the
// browser, so it records exactly what xterm.js was shown.
//
// Time is a story clock, not the wall clock:
//   - it starts at start(); anything earlier is dropped, and the runner has
//     fish repaint so the cast opens on a clean screen
//   - pause()/resume() freeze it (a `hidden` step is off camera)
//   - speed(n) time-lapses what follows until speed(1)
//   - idle gaps are capped when the file is written
//
// Besides output, the header carries what output alone cannot show, under
// `x_devtools`: where the pointer was and what it did, which keys were
// pressed, and where the time-lapses are. Players that do not know the key
// ignore it; asciinema's does.
//
// Chapters are asciicast markers ("m" events), one per screenshot beat.

import fs from 'node:fs';
import path from 'node:path';

const IDLE_LIMIT = 2; // seconds

export class Recorder {
	constructor() {
		this.decoder = new TextDecoder('utf-8');
		this.events = []; // [t, code, data]
		this.pointer = []; // [t, col, row, action]  action: move | down | up | scroll:<n>
		this.keys = []; // [t, label]
		this.speeds = []; // [t, factor]
		this.cols = 0;
		this.rows = 0;
		this.started = false;
		this.paused = false;
		this.factor = 1;
		this.virtual = 0; // story seconds at `lastReal`
		this.lastReal = 0;
	}

	// Story seconds now.
	now() {
		if (!this.started || this.paused) return this.virtual;
		const real = performance.now();
		return this.virtual + (real - this.lastReal) / 1000 / this.factor;
	}

	// Folds the time elapsed so far into `virtual`, before the rate changes.
	settle() {
		this.virtual = this.now();
		this.lastReal = performance.now();
	}

	// Everything before the story (fish starting, the page settling on its
	// size) is dropped: the runner has fish repaint right after, so the first
	// frame is a clean screen at the size the whole cast is played at.
	start() {
		this.events = [];
		this.started = true;
		this.virtual = 0;
		this.lastReal = performance.now();
	}

	pause() {
		this.settle();
		this.paused = true;
	}

	resume() {
		this.lastReal = performance.now();
		this.paused = false;
	}

	speed(factor) {
		this.settle();
		this.factor = factor;
		this.speeds.push([this.virtual, factor]);
	}

	size(cols, rows) {
		if (!cols || !rows || (cols === this.cols && rows === this.rows)) return;
		const first = !this.cols;
		this.cols = cols;
		this.rows = rows;
		if (!first) this.events.push([this.now(), 'r', `${cols}x${rows}`]);
	}

	output(bytes) {
		const text = this.decoder.decode(bytes, { stream: true });
		if (text) this.events.push([this.now(), 'o', text]);
	}

	marker(label) {
		this.events.push([this.now(), 'm', label]);
	}

	point(col, row, action) {
		this.pointer.push([this.now(), round(col), round(row), action]);
	}

	key(label) {
		this.keys.push([this.now(), label]);
	}

	// Writes the cast and returns what the index needs to know about it.
	write(file, { title } = {}) {
		// One clock for every track, so capping an idle gap moves them together.
		const times = [
			...this.events.map((e) => e[0]),
			...this.pointer.map((p) => p[0]),
			...this.keys.map((k) => k[0]),
			...this.speeds.map((s) => s[0])
		];
		const cap = capper(times, IDLE_LIMIT);

		const header = {
			version: 2,
			width: this.cols,
			height: this.rows,
			timestamp: Math.floor(Date.now() / 1000),
			idle_time_limit: IDLE_LIMIT,
			title,
			env: { TERM: 'xterm-256color', SHELL: '/usr/bin/fish' },
			x_devtools: {
				pointer: this.pointer.map(([t, ...rest]) => [cap(t), ...rest]),
				keys: this.keys.map(([t, label]) => [cap(t), label]),
				speeds: this.speeds.map(([t, f]) => [cap(t), f])
			}
		};
		const lines = [JSON.stringify(header)];
		for (const [t, code, data] of this.events) lines.push(JSON.stringify([cap(t), code, data]));
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, lines.join('\n') + '\n');

		const duration = Math.max(0, ...times.map(cap));
		return {
			cols: this.cols,
			rows: this.rows,
			duration: round(duration),
			bytes: fs.statSync(file).size,
			markers: this.events.filter((e) => e[1] === 'm').map((e) => [cap(e[0]), e[2]])
		};
	}
}

// Maps each time to one with every gap longer than `limit` shortened to it.
function capper(times, limit) {
	const sorted = [...new Set(times)].sort((a, b) => a - b);
	const map = new Map();
	let shift = 0;
	let prev = 0;
	for (const t of sorted) {
		const gap = t - prev;
		if (gap > limit) shift += gap - limit;
		map.set(t, t - shift);
		prev = t;
	}
	return (t) => round(map.get(t) ?? t);
}

function round(n) {
	return Math.round(n * 1000) / 1000;
}

// How a step's key reads on screen: ← ×6, ⌃C, esc.
export function keyLabel(key, times = 1) {
	const glyph =
		{
			Left: '←',
			Right: '→',
			Up: '↑',
			Down: '↓',
			Enter: '↵',
			Escape: 'esc',
			Tab: '⇥',
			Space: 'space',
			Backspace: '⌫',
			Home: 'home',
			End: 'end'
		}[key] ??
		key
			.replace(/^Ctrl\+(\w)$/, (_, c) => `⌃${c.toUpperCase()}`)
			.replace(/^Alt\+(\w)$/, (_, c) => `⌥${c.toUpperCase()}`);
	return times > 1 ? `${glyph} ×${times}` : glyph;
}
