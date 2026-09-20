// Reads the Ghostty config on this machine (and the theme it names) and
// writes src/lib/terminal/ghostty.json, so a session on the site is set in the
// same face, size, padding and sixteen colours as the terminal on the desk.
//
//   npm run theme
//   GHOSTTY_CONFIG=path/to/config npm run theme

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = process.env.GHOSTTY_CONFIG ?? join(homedir(), '.config/ghostty/config');

// Ghostty's format: `key = value`, repeatable, last one wins; `palette` is
// `N=#hex` and accumulates.
function parse(path) {
	const out = { palette: {} };
	for (const raw of readFileSync(path, 'utf8').split('\n')) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		const eq = line.indexOf('=');
		if (eq < 0) continue;
		const key = line.slice(0, eq).trim();
		const value = line
			.slice(eq + 1)
			.trim()
			.replace(/^"(.*)"$/, '$1');
		if (key === 'palette') {
			const [n, color] = value.split('=');
			out.palette[Number(n)] = color.trim();
		} else {
			out[key] = value;
		}
	}
	return out;
}

const config = parse(configPath);

// A theme is a name looked up in the user's themes, then Ghostty's own.
let theme = { palette: {} };
if (config.theme) {
	const candidates = [
		join(dirname(configPath), 'themes', config.theme),
		join('/Applications/Ghostty.app/Contents/Resources/ghostty/themes', config.theme)
	];
	const found = candidates.find(existsSync);
	if (!found) throw new Error(`theme not found: ${config.theme}`);
	theme = parse(found);
}
const pick = (key, fallback) => config[key] ?? theme[key] ?? fallback;
const palette = Array.from({ length: 16 }, (_, i) => config.palette[i] ?? theme.palette[i]);
if (palette.some((c) => !c)) throw new Error('theme is missing some of the sixteen colours');

const cellHeight = pick('adjust-cell-height', '0%');

const out = {
	theme: config.theme ?? null,
	font: {
		family: pick('font-family', 'JetBrains Mono').replace(/ Nerd Font( Mono)?$/, ''),
		size: Number(pick('font-size', '13')),
		// Ghostty adds this to the font's own line height (~1.32 for JetBrains Mono).
		lineHeight: +(1.32 * (1 + parseFloat(cellHeight) / 100)).toFixed(3),
		thicken: pick('font-thicken', 'false') === 'true'
	},
	padding: { x: Number(pick('window-padding-x', '2')), y: Number(pick('window-padding-y', '2')) },
	background: pick('background', '#000000'),
	foreground: pick('foreground', '#ffffff'),
	cursor: pick('cursor-color', pick('foreground', '#ffffff')),
	cursorText: pick('cursor-text', pick('background', '#000000')),
	selection: pick('selection-background', palette[8]),
	selectionText: pick('selection-foreground', pick('foreground', '#ffffff')),
	palette
};

writeFileSync(join(root, 'src/lib/terminal/ghostty.json'), JSON.stringify(out, null, '\t') + '\n');
console.log(`ghostty: ${out.theme ?? 'default colours'}, ${out.font.family} ${out.font.size}`);
