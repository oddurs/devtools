// Finding a tool by typing at it.
//
// Fifty things is more than a list you read and less than a search engine. The
// query is a few characters, and the answer has to be right by the second or
// third: `po` is poptop, `yog` is yoghurt, `rss` is rsst, `ascii` is gummyworm
// because that is one of its tags, and `rewind` is poptop because that is the
// first thing its line says.
//
// So: match on the name first, then on the sentence under it, then on the
// tags, and say which it was, because the list shows the reason under each
// name. Nothing is ranked by cleverness that cannot be explained in a word.

import type { Project } from './projects';

export type Hit = {
	project: Project;
	// Where the query was found, for the line under the name.
	where: 'name' | 'line' | 'tag' | 'words';
	// What matched, when it is worth repeating: the tag, or nothing.
	tag?: string;
	// What to show under the name. Usually the tool's own line, but when the
	// match was in the paragraph nobody can see, it is the part of that
	// paragraph the query is in — otherwise the row answers with a sentence
	// that does not contain what was typed, and reads as a mistake.
	why: string;
	score: number;
};

// A window of prose around the match, cut at word boundaries.
function around(text: string, q: string, width = 72): string {
	const at = text.toLowerCase().indexOf(q);
	if (at === -1) return text.slice(0, width);
	const from = Math.max(0, at - Math.floor((width - q.length) / 2));
	const to = Math.min(text.length, from + width);
	const cut = text.slice(from, to).trim();
	return `${from > 0 ? '…' : ''}${cut}${to < text.length ? '…' : ''}`;
}

// Characters in order but not necessarily together: 'gwm' finds gummyworm.
// Returns how tight the run was, or null. A tight match (few gaps, early
// start) beats a loose one, which is what makes `nun` beat `turborust` for
// the letters n-u-n.
function subsequence(haystack: string, needle: string): number | null {
	let at = 0;
	let gaps = 0;
	let first = -1;
	for (const ch of needle) {
		const found = haystack.indexOf(ch, at);
		if (found === -1) return null;
		if (first === -1) first = found;
		if (at > 0 && found > at) gaps += found - at;
		at = found + 1;
	}
	return 1 / (1 + gaps + first * 0.5);
}

export function search(projects: Project[], query: string): Hit[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const hits: Hit[] = [];

	for (const p of projects) {
		const name = p.name.toLowerCase();
		const line = p.line.toLowerCase();
		const tags = p.tags.map((t) => t.toLowerCase());

		// The name, best first: the whole of it, then the start of it, then
		// somewhere inside it, then its letters in order.
		if (name === q) hits.push({ project: p, where: 'name', why: p.line, score: 1000 });
		else if (name.startsWith(q))
			hits.push({ project: p, where: 'name', why: p.line, score: 900 - name.length });
		else if (name.includes(q))
			hits.push({ project: p, where: 'name', why: p.line, score: 800 - name.length });
		else {
			const tag = tags.find((t) => t.startsWith(q)) ?? tags.find((t) => t.includes(q));
			if (tag) hits.push({ project: p, where: 'tag', tag, why: tag, score: 700 - tag.indexOf(q) });
			else if (line.includes(q))
				hits.push({ project: p, where: 'line', why: p.line, score: 600 - line.indexOf(q) });
			else if (p.more.toLowerCase().includes(q))
				hits.push({ project: p, where: 'words', why: around(p.more, q), score: 400 });
			else {
				// Last resort, and only for a query short enough to be an
				// abbreviation: a long query matching by scattered letters is
				// a coincidence, not an answer.
				const loose = q.length <= 6 ? subsequence(name, q) : null;
				if (loose !== null)
					hits.push({ project: p, where: 'name', why: p.line, score: 300 + loose * 100 });
			}
		}
	}

	// Ties go to the shorter name, then alphabetically, so the order never
	// depends on where a tool happens to sit in the rail.
	return hits.sort(
		(a, b) =>
			b.score - a.score ||
			a.project.name.length - b.project.name.length ||
			a.project.name.localeCompare(b.project.name)
	);
}
