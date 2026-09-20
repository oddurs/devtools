// The devtools terminal scheme: this site's palette as a terminal. The greys
// from tokens.css for ground and text; for the six ANSI hues, six of the
// twelve tints the app marks use, at one lightness so no colour shouts.
//
// Plain JavaScript because two programs read it: the site (themes.ts), and the
// screens runner in its container (screens/runner/theme.mjs), which themes the
// terminal it photographs and records with it. One scheme, so a screenshot, a
// recording and the page around them are one set of colours.
import { oklch } from '../design/color.js';

/**
 * @typedef {object} Scheme
 * @property {string} name
 * @property {string} background
 * @property {string} foreground
 * @property {string} bar the title strip and transport: the window's own chrome
 * @property {string} cursor
 * @property {string} cursorText
 * @property {string} selection
 * @property {string} selectionText
 * @property {string[]} palette ANSI 0-15: black red green yellow blue magenta cyan white, then brights
 */

// The tints' hue angles, as in tokens.css (--tint-*).
const hue = { rose: 15, amber: 75, green: 135, teal: 195, sky: 255, orchid: 345 };

// Normal colours sit where the app marks do; brights are lighter and a little
// quieter, the way a terminal's brights read as emphasis, not as new hues.
const normal = (/** @type {number} */ h) => oklch(0.78, 0.11, h);
const bright = (/** @type {number} */ h) => oklch(0.87, 0.085, h);
const ansi = [hue.rose, hue.green, hue.amber, hue.sky, hue.orchid, hue.teal];

/** @type {Scheme} */
export const devtools = {
	name: 'devtools',
	background: '#0d0d0c',
	foreground: '#d9d8d3',
	bar: '#181817', // --lifted
	cursor: oklch(0.84, 0.12, hue.amber),
	cursorText: '#0d0d0c',
	selection: '#423715', // --mark
	selectionText: '#ebeae6', // --ink
	palette: [
		'#262523', // black: --rule
		...ansi.map(normal),
		'#bdbcb6', // white
		'#7e7d78', // bright black: --faint, the dim text of every program
		...ansi.map(bright),
		'#ebeae6' // bright white: --ink
	]
};
