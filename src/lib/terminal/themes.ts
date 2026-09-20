// Terminal colour schemes. The face, size, cell height and padding always come
// from the Ghostty config (ghostty.json); a scheme is only colour.
//
// `devtools` (scheme.js) is this site's palette as a terminal, and the one
// the screens runner shoots in. `desk` is the colours Ghostty uses.
import type { Scheme } from './scheme.js';
import ghostty from './ghostty.json';

export type { Scheme } from './scheme.js';
export { devtools } from './scheme.js';

// The terminal on the desk, as `npm run theme` last read it.
export const desk: Scheme = {
	name: ghostty.theme ?? 'ghostty',
	background: ghostty.background,
	foreground: ghostty.foreground,
	bar: under(ghostty.background),
	cursor: ghostty.cursor,
	cursorText: ghostty.cursorText,
	selection: ghostty.selection,
	selectionText: ghostty.selectionText,
	palette: ghostty.palette
};

// Ghostty's own bar is the ground a shade under; expressed as a CSS mix so it
// needs no colour maths here.
function under(hex: string): string {
	return `color-mix(in oklab, ${hex} 82%, black)`;
}

// The scheme a Ghostty user would paste into ~/.config/ghostty/themes/<name>.
export function ghosttyTheme(s: Scheme): string {
	return [
		...s.palette.map((c, i) => `palette = ${i}=${c}`),
		`background = ${s.background}`,
		`foreground = ${s.foreground}`,
		`cursor-color = ${s.cursor}`,
		`cursor-text = ${s.cursorText}`,
		`selection-background = ${s.selection}`,
		`selection-foreground = ${s.selectionText}`
	].join('\n');
}
