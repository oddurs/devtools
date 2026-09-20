// The terminal every window on the site draws: the face, size, cell height and
// padding of the Ghostty config on the desk (ghostty.json, `npm run theme`),
// in the colour scheme chosen here.
import ghostty from './ghostty.json';
import { desk, devtools, type Scheme } from './themes';

// 'devtools': the site's own palette. 'desk': the colours Ghostty uses.
const SCHEME: 'devtools' | 'desk' = 'devtools';

export const scheme: Scheme = SCHEME === 'devtools' ? devtools : desk;

export const theme = {
	...scheme,
	font: ghostty.font,
	padding: ghostty.padding
};

// JetBrains Mono's advance width, as a fraction of the font size. The session
// uses it to shrink the type until its widest line fits, the way a terminal
// window would be sized to the program rather than the program wrapped.
export const ADVANCE = 0.6;

// The terminal's own glyphs first (braille and block elements only: its
// @font-face has a unicode-range), then the configured face.
export const font = `'Term Glyphs', '${ghostty.font.family}', 'JetBrains Mono', 'JetBrains Mono Variable', ui-monospace, monospace`;

export function vars(): string {
	const t = theme;
	const decl: Record<string, string> = {
		'--term-bg': t.background,
		'--term-fg': t.foreground,
		'--term-bar': t.bar,
		'--term-cursor': t.cursor,
		'--term-cursor-text': t.cursorText,
		'--term-selection': t.selection,
		'--term-selection-text': t.selectionText,
		'--term-font': font,
		'--term-size': `${t.font.size}px`,
		'--term-line': String(t.font.lineHeight),
		'--term-weight': t.font.thicken ? '450' : '400',
		'--term-pad-x': `${t.padding.x}px`,
		'--term-pad-y': `${t.padding.y}px`
	};
	t.palette.forEach((c, i) => (decl[`--ansi-${i}`] = c));
	return Object.entries(decl)
		.map(([k, v]) => `${k}:${v}`)
		.join(';');
}
