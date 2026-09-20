// What the session does with a line: a small, honest shell. It knows the
// commands in the project's demo and the output each one really printed, and
// says so plainly when asked for anything else. It never makes output up.
import type { Step } from '$lib/data/projects';

export type Line =
	{ kind: 'cmd'; text: string } | { kind: 'out'; text: string } | { kind: 'note'; text: string };

// A demo command without its trailing `# comment`, whitespace collapsed.
export function bare(cmd: string): string {
	return cmd
		.replace(/\s+#.*$/, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function complete(input: string, steps: Step[]): string | null {
	const typed = input.replace(/\s+/g, ' ').trimStart();
	if (!typed) return null;
	const hit = steps.map((s) => bare(s.cmd)).find((c) => c.startsWith(typed) && c !== typed);
	return hit ?? null;
}

export type Result = { clear: true } | { clear?: false; lines: Line[] };

export function run(input: string, steps: Step[], tool: string): Result {
	const typed = bare(input);
	if (!typed) return { lines: [] };
	if (typed === 'clear') return { clear: true };

	const step = steps.find((s) => bare(s.cmd) === typed);
	if (step) return { lines: step.out ? [{ kind: 'out', text: step.out }] : [] };

	if (typed === 'help' || typed === 'ls') {
		return {
			lines: [
				{ kind: 'note', text: 'Recorded here, with their real output:' },
				{ kind: 'out', text: steps.map((s) => '  ' + bare(s.cmd)).join('\n') },
				{ kind: 'note', text: 'Tab completes. ↵ on an empty line runs the next one.' }
			]
		};
	}

	const word = typed.split(' ')[0];
	if (word === tool || word === `./${tool}` || typed.includes(tool)) {
		return {
			lines: [
				{
					kind: 'note',
					text: `No recording of that one. This session only replays what ${tool} really printed; type help for the list.`
				}
			]
		};
	}
	return { lines: [{ kind: 'out', text: `fish: Unknown command: ${word}` }] };
}

// Splits text into runs a terminal would colour differently. Real captures
// carry their own SGR escapes (bold, dim, the sixteen colours, 256 and true
// colour), and those are honoured against the Ghostty palette. Where a
// program left text uncoloured, box drawing sits back in bright black so the
// data inside it reads first; a shell comment is dim.
export type Run = {
	text: string;
	tone?: 'frame' | 'comment';
	// A palette index (0-15) or a CSS colour.
	fg?: number | string;
	bold?: boolean;
	dim?: boolean;
	italic?: boolean;
	underline?: boolean;
};

const FRAME = /[\u2500-\u257f]+/g;
// eslint-disable-next-line no-control-regex
const SGR = /\x1b\[([\d;]*)m/g;
// Any other escape a capture might carry (cursor moves, OSC titles): dropped.
// eslint-disable-next-line no-control-regex
const OTHER = /\x1b(?:\[[\d;?]*[A-Za-ln-z]|\][^\x07\x1b]*(?:\x07|\x1b\\))/g;

type Style = Omit<Run, 'text' | 'tone'>;

function apply(style: Style, params: string): Style {
	const codes = params === '' ? [0] : params.split(';').map(Number);
	const next = { ...style };
	for (let i = 0; i < codes.length; i++) {
		const c = codes[i];
		if (c === 0) Object.keys(next).forEach((k) => delete next[k as keyof Style]);
		else if (c === 1) next.bold = true;
		else if (c === 2) next.dim = true;
		else if (c === 22) next.bold = next.dim = false;
		else if (c === 3) next.italic = true;
		else if (c === 23) next.italic = false;
		else if (c === 4) next.underline = true;
		else if (c === 24) next.underline = false;
		else if (c >= 30 && c <= 37) next.fg = c - 30;
		else if (c >= 90 && c <= 97) next.fg = c - 90 + 8;
		else if (c === 39) delete next.fg;
		else if (c === 38 && codes[i + 1] === 5) {
			const n = codes[i + 2];
			next.fg = n < 16 ? n : xterm256(n);
			i += 2;
		} else if (c === 38 && codes[i + 1] === 2) {
			next.fg = `rgb(${codes[i + 2]} ${codes[i + 3]} ${codes[i + 4]})`;
			i += 4;
		}
	}
	return next;
}

function xterm256(n: number): string {
	if (n >= 232) {
		const v = 8 + (n - 232) * 10;
		return `rgb(${v} ${v} ${v})`;
	}
	const i = n - 16;
	const level = (x: number) => (x === 0 ? 0 : 55 + x * 40);
	return `rgb(${level(Math.floor(i / 36))} ${level(Math.floor(i / 6) % 6)} ${level(i % 6)})`;
}

// Plain text, with box drawing pulled out as frame.
function framed(text: string, style: Style, out: Run[]) {
	if (style.fg !== undefined) {
		out.push({ text, ...style });
		return;
	}
	let last = 0;
	for (const m of text.matchAll(FRAME)) {
		if (m.index > last) out.push({ text: text.slice(last, m.index), ...style });
		out.push({ text: m[0], tone: 'frame', ...style });
		last = m.index + m[0].length;
	}
	if (last < text.length) out.push({ text: text.slice(last), ...style });
}

export function runs(text: string, isCommand = false): Run[] {
	if (isCommand) {
		const at = text.search(/\s#/);
		return at < 0
			? [{ text }]
			: [{ text: text.slice(0, at) }, { text: text.slice(at), tone: 'comment' }];
	}
	const clean = text.replace(OTHER, '');
	const out: Run[] = [];
	let style: Style = {};
	let last = 0;
	for (const m of clean.matchAll(SGR)) {
		if (m.index > last) framed(clean.slice(last, m.index), style, out);
		style = apply(style, m[1]);
		last = m.index + m[0].length;
	}
	if (last < clean.length) framed(clean.slice(last), style, out);
	return out;
}

// Inline style for a run's colour and weight; the tone is a class.
export function css(r: Run): string {
	const decl: string[] = [];
	if (r.fg !== undefined)
		decl.push(`color:${typeof r.fg === 'number' ? `var(--ansi-${r.fg})` : r.fg}`);
	if (r.bold) decl.push('font-weight:700');
	if (r.dim) decl.push('opacity:0.6');
	if (r.italic) decl.push('font-style:italic');
	if (r.underline) decl.push('text-decoration:underline');
	return decl.join(';');
}

// The widest line the session will ever show, in cells, so the type can be
// sized to fit it before the first keystroke.
// How many rows the whole session takes once every step has run: each
// command, its output, and the prompt's two lines after it. The window is
// sized to that (within bounds), not to a full screen it would never fill.
export function tallest(steps: Step[]): number {
	const rows = steps.reduce((n, s) => n + 1 + (s.out ? s.out.split('\n').length : 0), 0) + 3;
	return Math.min(34, Math.max(10, rows));
}

export function widest(steps: Step[]): number {
	const lines = steps.flatMap((s) => ['❯ ' + s.cmd, ...(s.out?.split('\n') ?? [])]);
	return Math.max(64, ...lines.map((l) => [...l.replace(SGR, '').replace(OTHER, '')].length));
}
