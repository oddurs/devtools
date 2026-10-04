import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LINE } from '../src/lib/terminal/theme';

// The glyph font is drawn for one cell: the font's own line box times this.
// Three places have to agree on it, or box drawing stops reaching the edges of
// its row — the studio terminal where a screenshot is taken, the player that
// replays the recording, and the generator that draws the glyphs. The player's
// copy is the one imported above; the other two are read here as text, because
// one is a container script and the other writes a font.
const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');
const number = (src: string, re: RegExp, what: string) => {
	const m = re.exec(src);
	expect(m, `no line height found in ${what}`).not.toBeNull();
	return Number(m![1]);
};

describe('the cell', () => {
	it('is the same in the studio as in the player', () => {
		expect(number(read('./runner/run.mjs'), /^const LINE = ([\d.]+);/m, 'the runner')).toBe(LINE);
	});

	it('is the same in the font the glyphs are drawn for', () => {
		expect(
			number(read('../scripts/glyph-font.mjs'), /^const LINE = ([\d.]+);/m, 'the generator')
		).toBe(LINE);
	});
});
