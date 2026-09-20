// Writes src/lib/assets/term-glyphs.otf: the characters a terminal draws
// itself rather than taking from the font, drawn here the way Ghostty does.
//
//   U+2800–28FF  braille: the raised dots only. JetBrains Mono rings every
//                unraised dot, so a braille graph (poptop's timeline) turns
//                into a field of circles it never is in a terminal.
//   U+2580–259F  block elements: to the full height of the cell. The font's
//                stop at its own line height, and with Ghostty's taller cell a
//                bar or a half-block cursor (poptop's scrub marker) no longer
//                meets the row above, and reads as a bracket.
//
// The terminal's font stack puts this first with a unicode-range, so it is
// used for these and nothing else.
//
//   npm run glyphs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/lib/assets/term-glyphs.otf');

// JetBrains Mono's metrics, so a braille cell is exactly a text cell.
const UPM = 1000;
const ADVANCE = 600;
const ASCENDER = 1020;
const DESCENDER = -300;

// The cell a block has to fill. xterm's row is the font's height (1.32 em)
// times the Ghostty cell height (lineHeight 1.12), with the extra split above
// and below; a few units of overdraw more, so neighbours overlap rather than
// leave a hairline.
const LINE = 1.12;
const LEAD = ((ASCENDER - DESCENDER) * (LINE - 1)) / 2;
const TOP = ASCENDER + LEAD + 6;
const BOTTOM = DESCENDER - LEAD - 6;

// Two columns by four rows of dots, centred in the cell. The dot is a little
// under a quarter of the column pitch, so neighbours never touch.
const cellHeight = ASCENDER - DESCENDER;
const colX = [ADVANCE * 0.27, ADVANCE * 0.73];
const rowY = [0, 1, 2, 3].map((r) => ASCENDER - cellHeight * (0.14 + r * 0.24));
const R = 62;

// Braille dot numbering to bits: dots 1-3 and 7 run down the left column,
// 4-6 and 8 down the right.
const DOTS = [
	[0, 0], // 0x01 dot 1
	[0, 1], // 0x02 dot 2
	[0, 2], // 0x04 dot 3
	[1, 0], // 0x08 dot 4
	[1, 1], // 0x10 dot 5
	[1, 2], // 0x20 dot 6
	[0, 3], // 0x40 dot 7
	[1, 3] // 0x80 dot 8
];

// A circle from four cubic arcs (k is the usual 0.5523 handle length).
function circle(path, cx, cy, r) {
	const k = 0.5523 * r;
	path.moveTo(cx + r, cy);
	path.curveTo(cx + r, cy + k, cx + k, cy + r, cx, cy + r);
	path.curveTo(cx - k, cy + r, cx - r, cy + k, cx - r, cy);
	path.curveTo(cx - r, cy - k, cx - k, cy - r, cx, cy - r);
	path.curveTo(cx + k, cy - r, cx + r, cy - k, cx + r, cy);
	path.close();
}

const glyphs = [
	new opentype.Glyph({
		name: '.notdef',
		unicode: 0,
		advanceWidth: ADVANCE,
		path: new opentype.Path()
	})
];
for (let bits = 0; bits < 256; bits++) {
	const path = new opentype.Path();
	DOTS.forEach(([c, r], i) => {
		if (bits & (1 << i)) circle(path, colX[c], rowY[r], R);
	});
	const code = 0x2800 + bits;
	glyphs.push(
		new opentype.Glyph({
			name: `uni${code.toString(16).toUpperCase()}`,
			unicode: code,
			advanceWidth: ADVANCE,
			path
		})
	);
}

// Block elements, as rectangles in eighths of the cell.
function rect(path, x0, y0, x1, y1) {
	path.moveTo(x0, y0);
	path.lineTo(x1, y0);
	path.lineTo(x1, y1);
	path.lineTo(x0, y1);
	path.close();
}
const H = TOP - BOTTOM;
const X = (f) => ADVANCE * f; // fraction of the width
const Y = (f) => BOTTOM + H * f; // fraction of the height, from the bottom
const block = (x0, y0, x1, y1) => (p) => rect(p, X(x0), Y(y0), X(x1), Y(y1));
const quad = {
	ul: block(0, 0.5, 0.5, 1),
	ur: block(0.5, 0.5, 1, 1),
	ll: block(0, 0, 0.5, 0.5),
	lr: block(0.5, 0, 1, 0.5)
};
// A shade is a stipple: the fraction of a 2×4 grid of small cells filled.
const shade = (on) => (p) => {
	for (let r = 0; r < 8; r++)
		for (let c = 0; c < 4; c++)
			if (on(r, c)) rect(p, X(c / 4), Y(r / 8), X((c + 1) / 4), Y((r + 1) / 8));
};
const blocks = {
	0x2580: block(0, 0.5, 1, 1),
	...Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [0x2580 + n, block(0, 0, 1, n / 8)])),
	0x2588: block(0, 0, 1, 1),
	...Object.fromEntries([7, 6, 5, 4, 3, 2, 1].map((n, i) => [0x2589 + i, block(0, 0, n / 8, 1)])),
	0x2590: block(0.5, 0, 1, 1),
	0x2591: shade((r, c) => r % 2 === 0 && (c + r / 2) % 2 === 0),
	0x2592: shade((r, c) => (r + c) % 2 === 0),
	0x2593: shade((r, c) => !(r % 2 === 0 && (c + r / 2) % 2 === 0)),
	0x2594: block(0, 7 / 8, 1, 1),
	0x2595: block(7 / 8, 0, 1, 1),
	0x2596: quad.ll,
	0x2597: quad.lr,
	0x2598: quad.ul,
	0x2599: (p) => [quad.ul, quad.ll, quad.lr].forEach((q) => q(p)),
	0x259a: (p) => [quad.ul, quad.lr].forEach((q) => q(p)),
	0x259b: (p) => [quad.ul, quad.ur, quad.ll].forEach((q) => q(p)),
	0x259c: (p) => [quad.ul, quad.ur, quad.lr].forEach((q) => q(p)),
	0x259d: quad.ur,
	0x259e: (p) => [quad.ur, quad.ll].forEach((q) => q(p)),
	0x259f: (p) => [quad.ur, quad.ll, quad.lr].forEach((q) => q(p))
};
for (const [code, draw] of Object.entries(blocks)) {
	const path = new opentype.Path();
	draw(path);
	const c = Number(code);
	glyphs.push(
		new opentype.Glyph({
			name: `uni${c.toString(16).toUpperCase()}`,
			unicode: c,
			advanceWidth: ADVANCE,
			path
		})
	);
}

const font = new opentype.Font({
	familyName: 'Term Glyphs',
	styleName: 'Regular',
	unitsPerEm: UPM,
	ascender: ASCENDER,
	descender: DESCENDER,
	glyphs
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(font.toArrayBuffer()));
console.log(`wrote ${out.replace(root + '/', '')} (${glyphs.length - 1} glyphs)`);
