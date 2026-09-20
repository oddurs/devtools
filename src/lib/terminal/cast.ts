// Reading an asciicast v2 recording, and answering "what is true at time t"
// for everything drawn over the terminal: the pointer, the last key, whether
// this stretch is a time-lapse, which chapter we are in. Pure functions; the
// player calls them every frame.

export type Event = [number, 'o' | 'r' | 'm' | 'i', string];
export type PointerEvent = [number, number, number, string]; // t, col, row, action

export type Recording = {
	cols: number;
	rows: number;
	duration: number;
	events: Event[];
	markers: [number, string][];
	pointer: PointerEvent[];
	keys: [number, string][];
	speeds: [number, number][];
};

export function parse(text: string): Recording {
	const [head, ...rest] = text.trim().split('\n');
	const header = JSON.parse(head);
	const events = rest.map((l) => JSON.parse(l) as Event);
	const x = header.x_devtools ?? {};
	const pointer: PointerEvent[] = x.pointer ?? [];
	const keys: [number, string][] = x.keys ?? [];
	const times = [...events.map((e) => e[0]), ...pointer.map((p) => p[0]), ...keys.map((k) => k[0])];
	return {
		cols: header.width,
		rows: header.height,
		// A beat past the last thing that happened, so the end is seen, not cut.
		duration: Math.max(0, ...times) + 1,
		events,
		markers: events.filter((e) => e[1] === 'm').map((e) => [e[0], e[2]]),
		pointer,
		keys,
		speeds: x.speeds ?? []
	};
}

// Index of the chapter playing at t, or -1 before the first.
export function chapterAt(rec: Recording, t: number): number {
	let i = -1;
	rec.markers.forEach(([mt], j) => {
		if (mt <= t + 0.001) i = j;
	});
	return i;
}

// The time-lapse factor in force at t (1 when there is none).
export function speedAt(rec: Recording, t: number): number {
	let f = 1;
	for (const [st, factor] of rec.speeds) if (st <= t) f = factor;
	return f;
}

const KEY_SHOWN = 1.4; // seconds a key stays on screen

export function keyAt(rec: Recording, t: number): { label: string; age: number } | null {
	let hit: [number, string] | null = null;
	for (const k of rec.keys) if (k[0] <= t) hit = k;
	if (!hit || t - hit[0] > KEY_SHOWN) return null;
	return { label: hit[1], age: (t - hit[0]) / KEY_SHOWN };
}

export type Pointer = {
	col: number;
	row: number;
	pressed: boolean;
	ring: number | null;
	fade: number;
};

const POINTER_IDLE = 2.5; // seconds before a still pointer fades
const RING = 0.45; // seconds a click ring lasts

// Where the pointer is at t. Between two recorded points it moves on the
// straight line the runner glided along; a press shows a ring spreading out.
export function pointerAt(rec: Recording, t: number): Pointer | null {
	const p = rec.pointer;
	if (!p.length || t < p[0][0]) return null;
	let i = 0;
	while (i + 1 < p.length && p[i + 1][0] <= t) i++;
	const a = p[i];
	const b = p[i + 1];
	let col = a[1];
	let row = a[2];
	if (b && b[3] === 'move' && b[0] > a[0]) {
		const k = (t - a[0]) / (b[0] - a[0]);
		const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
		col = a[1] + (b[1] - a[1]) * e;
		row = a[2] + (b[2] - a[2]) * e;
	}
	const pressed = a[3] === 'down';
	let ring: number | null = null;
	for (let j = i; j >= 0 && t - p[j][0] < RING; j--) {
		if (p[j][3] === 'down') {
			ring = (t - p[j][0]) / RING;
			break;
		}
	}
	const idle = t - a[0];
	const fade = idle < POINTER_IDLE ? 1 : Math.max(0, 1 - (idle - POINTER_IDLE) / 0.6);
	return { col, row, pressed, ring, fade };
}

export function clock(seconds: number): string {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
