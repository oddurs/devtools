// The box drawing characters, U+2500–U+257F, drawn to the cell rather than to
// the font's own line box.
//
// This is the thing a terminal does for itself and a font cannot: a vertical
// rule has to reach the top and bottom of its row, or a frame comes apart into
// dashes the moment the row is taller than the type — which it always is. The
// glyphs below are drawn from the cell's edges inward, so `│` meets the `│`
// above it and `├` meets the `─` beside it at every line height and size.
//
// Shapes are described rather than drawn: each character is four arms, each of
// which is absent, light, heavy or double, plus the handful that are arcs,
// diagonals or dashes. Everything else falls out of that.
//
// Used by scripts/glyph-font.mjs; see its header for the cell metrics.

// An arm's weight.
export const NONE = 0;
export const LIGHT = 1;
export const HEAVY = 2;
export const DOUBLE = 3;

// [up, right, down, left], plus options. `dash` is how many dashes the line is
// broken into; `arc` rounds the corner; `diag` is a corner-to-corner stroke.
const A = (u, r, d, l, opt = {}) => ({ u, r, d, l, ...opt });
const L = LIGHT;
const H = HEAVY;
const D = DOUBLE;
const O = NONE;

export const BOX = {
	// Plain lines, and the dashed ones.
	0x2500: A(O, L, O, L),
	0x2501: A(O, H, O, H),
	0x2502: A(L, O, L, O),
	0x2503: A(H, O, H, O),
	0x2504: A(O, L, O, L, { dash: 3 }),
	0x2505: A(O, H, O, H, { dash: 3 }),
	0x2506: A(L, O, L, O, { dash: 3 }),
	0x2507: A(H, O, H, O, { dash: 3 }),
	0x2508: A(O, L, O, L, { dash: 4 }),
	0x2509: A(O, H, O, H, { dash: 4 }),
	0x250a: A(L, O, L, O, { dash: 4 }),
	0x250b: A(H, O, H, O, { dash: 4 }),

	// Corners: down and right, down and left, up and right, up and left, each
	// in the four combinations of light and heavy.
	0x250c: A(O, L, L, O),
	0x250d: A(O, H, L, O),
	0x250e: A(O, L, H, O),
	0x250f: A(O, H, H, O),
	0x2510: A(O, O, L, L),
	0x2511: A(O, O, L, H),
	0x2512: A(O, O, H, L),
	0x2513: A(O, O, H, H),
	0x2514: A(L, L, O, O),
	0x2515: A(L, H, O, O),
	0x2516: A(H, L, O, O),
	0x2517: A(H, H, O, O),
	0x2518: A(L, O, O, L),
	0x2519: A(L, O, O, H),
	0x251a: A(H, O, O, L),
	0x251b: A(H, O, O, H),

	// Tees, the vertical ones first.
	0x251c: A(L, L, L, O),
	0x251d: A(L, H, L, O),
	0x251e: A(H, L, L, O),
	0x251f: A(L, L, H, O),
	0x2520: A(H, L, H, O),
	0x2521: A(H, H, L, O),
	0x2522: A(L, H, H, O),
	0x2523: A(H, H, H, O),
	0x2524: A(L, O, L, L),
	0x2525: A(L, O, L, H),
	0x2526: A(H, O, L, L),
	0x2527: A(L, O, H, L),
	0x2528: A(H, O, H, L),
	0x2529: A(H, O, L, H),
	0x252a: A(L, O, H, H),
	0x252b: A(H, O, H, H),
	0x252c: A(O, L, L, L),
	0x252d: A(O, L, L, H),
	0x252e: A(O, H, L, L),
	0x252f: A(O, H, L, H),
	0x2530: A(O, L, H, L),
	0x2531: A(O, L, H, H),
	0x2532: A(O, H, H, L),
	0x2533: A(O, H, H, H),
	0x2534: A(L, L, O, L),
	0x2535: A(L, L, O, H),
	0x2536: A(L, H, O, L),
	0x2537: A(L, H, O, H),
	0x2538: A(H, L, O, L),
	0x2539: A(H, L, O, H),
	0x253a: A(H, H, O, L),
	0x253b: A(H, H, O, H),

	// Crosses.
	0x253c: A(L, L, L, L),
	0x253d: A(L, L, L, H),
	0x253e: A(L, H, L, L),
	0x253f: A(L, H, L, H),
	0x2540: A(H, L, L, L),
	0x2541: A(L, L, H, L),
	0x2542: A(H, L, H, L),
	0x2543: A(H, L, L, H),
	0x2544: A(H, H, L, L),
	0x2545: A(L, L, H, H),
	0x2546: A(L, H, H, L),
	0x2547: A(H, H, L, H),
	0x2548: A(L, H, H, H),
	0x2549: A(H, L, H, H),
	0x254a: A(H, H, H, L),
	0x254b: A(H, H, H, H),

	// Two-dash lines.
	0x254c: A(O, L, O, L, { dash: 2 }),
	0x254d: A(O, H, O, H, { dash: 2 }),
	0x254e: A(L, O, L, O, { dash: 2 }),
	0x254f: A(H, O, H, O, { dash: 2 }),

	// The double lines, and everywhere a double meets a single.
	0x2550: A(O, D, O, D),
	0x2551: A(D, O, D, O),
	0x2552: A(O, D, L, O),
	0x2553: A(O, L, D, O),
	0x2554: A(O, D, D, O),
	0x2555: A(O, O, L, D),
	0x2556: A(O, O, D, L),
	0x2557: A(O, O, D, D),
	0x2558: A(L, D, O, O),
	0x2559: A(D, L, O, O),
	0x255a: A(D, D, O, O),
	0x255b: A(L, O, O, D),
	0x255c: A(D, O, O, L),
	0x255d: A(D, O, O, D),
	0x255e: A(L, D, L, O),
	0x255f: A(D, L, D, O),
	0x2560: A(D, D, D, O),
	0x2561: A(L, O, L, D),
	0x2562: A(D, O, D, L),
	0x2563: A(D, O, D, D),
	0x2564: A(O, D, L, D),
	0x2565: A(O, L, D, L),
	0x2566: A(O, D, D, D),
	0x2567: A(L, D, O, D),
	0x2568: A(D, L, O, L),
	0x2569: A(D, D, O, D),
	0x256a: A(L, D, L, D),
	0x256b: A(D, L, D, L),
	0x256c: A(D, D, D, D),

	// Arcs, diagonals, and the stubs.
	0x256d: A(O, L, L, O, { arc: true }),
	0x256e: A(O, O, L, L, { arc: true }),
	0x256f: A(L, O, O, L, { arc: true }),
	0x2570: A(L, L, O, O, { arc: true }),
	0x2571: A(O, O, O, O, { diag: 'up' }),
	0x2572: A(O, O, O, O, { diag: 'down' }),
	0x2573: A(O, O, O, O, { diag: 'both' }),
	0x2574: A(O, O, O, L),
	0x2575: A(L, O, O, O),
	0x2576: A(O, L, O, O),
	0x2577: A(O, O, L, O),
	0x2578: A(O, O, O, H),
	0x2579: A(H, O, O, O),
	0x257a: A(O, H, O, O),
	0x257b: A(O, O, H, O),
	0x257c: A(O, H, O, L),
	0x257d: A(L, O, H, O),
	0x257e: A(O, L, O, H),
	0x257f: A(H, O, L, O)
};

// Every shape is a closed polygon, and the pieces of one character overlap —
// an arc's curve runs into the straight arm it continues. A font fills by
// winding number, so two overlapping contours drawn in opposite directions
// cancel each other and leave a hole exactly where the join should be. So
// nothing emits a contour directly: this does, and it turns every one the
// same way round first.
function polygon(path, points) {
	let area = 0;
	for (let i = 0; i < points.length; i++) {
		const [x0, y0] = points[i];
		const [x1, y1] = points[(i + 1) % points.length];
		area += x0 * y1 - x1 * y0;
	}
	const turned = area < 0 ? [...points].reverse() : points;
	turned.forEach(([x, y], i) => (i === 0 ? path.moveTo(x, y) : path.lineTo(x, y)));
	path.close();
}

// A quarter circle as a closed band: along the outside, back along the inside.
// Flattened to segments rather than drawn as curves, so its winding can be
// normalised like everything else; at these sizes the difference is invisible.
function arcBand(cx, cy, radius, t, from, to, steps = 24) {
	const outer = [];
	const inner = [];
	for (let i = 0; i <= steps; i++) {
		const a = from + ((to - from) * i) / steps;
		outer.push([cx + Math.cos(a) * (radius + t / 2), cy + Math.sin(a) * (radius + t / 2)]);
		inner.push([cx + Math.cos(a) * (radius - t / 2), cy + Math.sin(a) * (radius - t / 2)]);
	}
	return [...outer, ...inner.reverse()];
}

// Draws one character into `path`, given the cell.
//
//   cell: { left, right, top, bottom }  the whole row, edge to edge
//   w:    { light, heavy, gap }         stroke weights, and the space between
//                                       the two strokes of a double line
export function drawBox(path, spec, cell, w) {
	const { left, right, top, bottom } = cell;
	const xMid = (left + right) / 2;
	const yMid = (top + bottom) / 2;
	const rect = (x0, y0, x1, y1) => {
		if (x1 - x0 < 1 || y1 - y0 < 1) return;
		polygon(path, [
			[x0, y0],
			[x1, y0],
			[x1, y1],
			[x0, y1]
		]);
	};
	const thick = (weight) => (weight === HEAVY ? w.heavy : w.light);

	if (spec.diag) {
		diagonal(path, spec.diag, cell, w.light);
		return;
	}
	if (spec.arc) {
		arc(path, spec, cell, w.light);
		return;
	}

	const { u, r, d, l } = spec;
	const anyDouble = u === DOUBLE || r === DOUBLE || d === DOUBLE || l === DOUBLE;

	if (!anyDouble) {
		// Light and heavy: every arm is a bar from its edge to the middle, and
		// they simply overlap where they meet. A dash splits the whole line
		// into n pieces with a gap of about a third of a piece between them.
		const horiz = l || r;
		const vert = u || d;
		if (spec.dash && horiz) {
			dashed(rect, spec.dash, left, right, yMid, thick(horiz), true);
			return;
		}
		if (spec.dash && vert) {
			dashed(rect, spec.dash, bottom, top, xMid, thick(vert), false);
			return;
		}
		// A stub (one arm alone) stops at the middle of the cell; a line that
		// continues crosses it, which is the same rectangle either way.
		if (l) rect(left, yMid - thick(l) / 2, xMid + thick(l) / 2, yMid + thick(l) / 2);
		if (r) rect(xMid - thick(r) / 2, yMid - thick(r) / 2, right, yMid + thick(r) / 2);
		if (u) rect(xMid - thick(u) / 2, yMid - thick(u) / 2, xMid + thick(u) / 2, top);
		if (d) rect(xMid - thick(d) / 2, bottom, xMid + thick(d) / 2, yMid + thick(d) / 2);
		return;
	}

	// Doubles. The two strokes of each pair sit either side of the middle, and
	// where pairs meet they close into corners: a stroke is cut away between
	// the perpendicular pair exactly when the arm that pair belongs to carries
	// on past it, which is what leaves the square hole in ╬ and the clean
	// elbow in ╔.
	const t = w.light;
	const off = w.gap;
	const yU = yMid + off;
	const yD = yMid - off;
	const xL = xMid - off;
	const xR = xMid + off;
	const cutL = xL - t / 2;
	const cutR = xR + t / 2;
	const cutB = yD - t / 2;
	const cutT = yU + t / 2;
	const hasH = l === DOUBLE || r === DOUBLE;
	const hasV = u === DOUBLE || d === DOUBLE;

	if (hasH) {
		for (const [y, cutBy] of [
			[yU, u === DOUBLE],
			[yD, d === DOUBLE]
		]) {
			const x0 = l === DOUBLE ? left : hasV ? cutL : xMid;
			const x1 = r === DOUBLE ? right : hasV ? cutR : xMid;
			if (cutBy) {
				if (l === DOUBLE) rect(x0, y - t / 2, cutL, y + t / 2);
				if (r === DOUBLE) rect(cutR, y - t / 2, x1, y + t / 2);
			} else {
				rect(x0, y - t / 2, x1, y + t / 2);
			}
		}
	}
	if (hasV) {
		for (const [x, cutBy] of [
			[xL, l === DOUBLE],
			[xR, r === DOUBLE]
		]) {
			const y0 = d === DOUBLE ? bottom : hasH ? cutB : yMid;
			const y1 = u === DOUBLE ? top : hasH ? cutT : yMid;
			if (cutBy) {
				if (d === DOUBLE) rect(x - t / 2, y0, x + t / 2, cutB);
				if (u === DOUBLE) rect(x - t / 2, cutT, x + t / 2, y1);
			} else {
				rect(x - t / 2, y0, x + t / 2, y1);
			}
		}
	}

	// A single arm against a double pair: it runs from its edge to the far
	// side of the pair when the arm opposite it is single too — so ╫ crosses
	// both lines — and stops at the near one when it is alone, so ╟ starts at
	// the line it hangs off rather than floating in the gap between the two.
	const single = (weight) => weight === LIGHT || weight === HEAVY;
	if (single(l))
		rect(left, yMid - thick(l) / 2, single(r) ? xMid : hasV ? xL : xMid, yMid + thick(l) / 2);
	if (single(r))
		rect(single(l) ? xMid : hasV ? xR : xMid, yMid - thick(r) / 2, right, yMid + thick(r) / 2);
	if (single(u))
		rect(xMid - thick(u) / 2, single(d) ? yMid : hasH ? yU : yMid, xMid + thick(u) / 2, top);
	if (single(d))
		rect(xMid - thick(d) / 2, bottom, xMid + thick(d) / 2, single(u) ? yMid : hasH ? yD : yMid);
}

// A broken line: n dashes across the cell, with the gaps a third of a dash.
function dashed(rect, n, from, to, mid, t, horizontal) {
	const span = to - from;
	const piece = span / n;
	const gap = piece / 3;
	for (let i = 0; i < n; i++) {
		const a = from + i * piece + gap / 2;
		const b = a + piece - gap;
		if (horizontal) rect(a, mid - t / 2, b, mid + t / 2);
		else rect(mid - t / 2, a, mid + t / 2, b);
	}
}

// A rounded corner: the two arms, stopped short, and a quarter circle between
// them. The radius is half the narrow side of the cell, so the curve is a
// curve at any line height rather than a kink at a tall one.
function arc(path, spec, cell, t) {
	const { left, right, top, bottom } = cell;
	const xMid = (left + right) / 2;
	const yMid = (top + bottom) / 2;
	const radius = Math.min((right - left) / 2, (top - bottom) / 2);
	const xTo = spec.r ? xMid + radius : xMid - radius;
	const yTo = spec.d ? yMid - radius : yMid + radius;
	const rect = (x0, y0, x1, y1) =>
		polygon(path, [
			[x0, y0],
			[x1, y0],
			[x1, y1],
			[x0, y1]
		]);

	// The straight parts, from the cell's edges to where the curve starts.
	if (spec.r) rect(xTo, yMid - t / 2, right, yMid + t / 2);
	if (spec.l) rect(left, yMid - t / 2, xTo, yMid + t / 2);
	if (spec.u) rect(xMid - t / 2, yTo, xMid + t / 2, top);
	if (spec.d) rect(xMid - t / 2, bottom, xMid + t / 2, yTo);

	// And the curve between them. Its centre is where the two arms would have
	// met if they had carried on — the far corner of the quarter — so the band
	// leaves the vertical arm exactly where that arm stops and arrives at the
	// horizontal one the same way.
	const sx = spec.r ? 1 : -1;
	const sy = spec.u ? 1 : -1;
	const from = sx > 0 ? Math.PI : 0;
	polygon(path, arcBand(xTo, yTo, radius, t, from, from + (sx * sy * Math.PI) / 2));
}

// A corner-to-corner stroke, as a parallelogram: the cell is taller than it is
// wide, so the slope is the cell's own rather than 45°.
function diagonal(path, which, cell, t) {
	const { left, right, top, bottom } = cell;
	const half = t / 2;
	const bar = (x0, y0, x1, y1) => {
		// Thickness measured across the stroke, applied horizontally: for a
		// steep line that is close enough and keeps the ends square to the cell.
		const dx = x1 - x0;
		const dy = y1 - y0;
		const len = Math.hypot(dx, dy);
		const wx = (half * len) / Math.abs(dy || len);
		polygon(path, [
			[x0 - wx, y0],
			[x0 + wx, y0],
			[x1 + wx, y1],
			[x1 - wx, y1]
		]);
	};
	if (which === 'up' || which === 'both') bar(left, bottom, right, top);
	if (which === 'down' || which === 'both') bar(right, bottom, left, top);
}
