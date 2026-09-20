// OKLCH to sRGB hex, for places that need a concrete colour rather than a CSS
// expression: a terminal theme is handed to xterm.js and to Ghostty as hex.
// Plain JavaScript so the screens runner (Node, in the container) can import
// it as it is; types are JSDoc, checked by svelte-check.
// Out-of-gamut colours keep their lightness and hue and lose chroma until
// they fit, which is what a browser's own gamut mapping aims for.

/** @returns {[number, number, number]} */
function oklchToLinear(/** @type {number} */ l, /** @type {number} */ c, /** @type {number} */ h) {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
	];
}

const inGamut = (/** @type {number[]} */ rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

function encode(/** @type {number} */ v) {
	const x = Math.min(1, Math.max(0, v));
	const s = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
	return Math.round(s * 255);
}

/** @returns {string} */
export function oklch(/** @type {number} */ l, /** @type {number} */ c, /** @type {number} */ h) {
	let lo = 0;
	let hi = c;
	let rgb = oklchToLinear(l, c, h);
	if (!inGamut(rgb)) {
		for (let i = 0; i < 24; i++) {
			const mid = (lo + hi) / 2;
			if (inGamut(oklchToLinear(l, mid, h))) lo = mid;
			else hi = mid;
		}
		rgb = oklchToLinear(l, lo, h);
	}
	return '#' + rgb.map((v) => encode(v).toString(16).padStart(2, '0')).join('');
}

// WCAG contrast between two hex colours.
/** @returns {number} */
export function contrast(/** @type {string} */ a, /** @type {string} */ b) {
	const lum = (/** @type {string} */ hex) => {
		const [r, g, bl] = [1, 3, 5].map((i) => {
			const v = parseInt(hex.slice(i, i + 2), 16) / 255;
			return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
}
