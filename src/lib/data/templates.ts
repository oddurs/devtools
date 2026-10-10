// How a page is built for each kind of thing. A terminal tool is read and then
// watched: what it is, the line that installs it, the recording. A game is
// the other way round — you judge it by looking at it, and the thing to do is
// play it, not paste something. One table rather than a branch in every
// component, so a new kind is one row.
import { views, type Project } from './projects';
import type { Tool } from './tools';

export type Kind = Tool['kind'];

export type Template = {
	// What one is called in a sentence: "the game", "the essay".
	noun: string;
	// Which comes first under the title. A picture leads when looking at the
	// thing is how you decide whether it is for you.
	lead: 'words' | 'picture';
	// What the main button says, for a thing you go to rather than install.
	// Null where the way in is a command to paste.
	verb: string | null;
};

export const TEMPLATES: Record<Kind, Template> = {
	tui: { noun: 'tool', lead: 'words', verb: null },
	cli: { noun: 'tool', lead: 'words', verb: null },
	library: { noun: 'library', lead: 'words', verb: null },
	plugin: { noun: 'plugin', lead: 'words', verb: null },
	language: { noun: 'language', lead: 'words', verb: null },
	theme: { noun: 'colour scheme', lead: 'picture', verb: null },
	app: { noun: 'app', lead: 'words', verb: null },
	game: { noun: 'game', lead: 'picture', verb: 'Play' },
	toy: { noun: 'toy', lead: 'picture', verb: 'Try it' },
	map: { noun: 'map', lead: 'picture', verb: 'Explore' },
	simulation: { noun: 'simulation', lead: 'picture', verb: 'Open it' },
	instrument: { noun: 'instrument', lead: 'picture', verb: 'Open it' },
	art: { noun: 'piece', lead: 'picture', verb: 'Watch' },
	explainer: { noun: 'explainer', lead: 'words', verb: 'Read it' },
	essay: { noun: 'essay', lead: 'words', verb: 'Read it' },
	course: { noun: 'course', lead: 'words', verb: 'Start' },
	book: { noun: 'book', lead: 'words', verb: 'Read it' }
};

export type Page = Template & {
	// The button, when there is somewhere to go: the verb and the address.
	go: { verb: string; href: string } | null;
};

// The template, settled against what this one actually has. A game with no
// address (arkonk is a Mac app) has nothing to press, so it falls back to the
// command that builds it; and a picture cannot lead when there is none yet,
// so the words do.
export function page(p: Project): Page {
	const t = TEMPLATES[p.kind];
	const verb = p.verb ?? t.verb;
	const go = verb && p.site ? { verb, href: p.site } : null;
	const lead = t.lead === 'picture' && views(p).length === 0 ? 'words' : t.lead;
	return { ...t, lead, go };
}

// The address as a browser's toolbar would show it: no scheme, no trailing
// slash.
export function address(site: string): string {
	const u = new URL(site);
	return `${u.host}${u.pathname.replace(/\/$/, '')}`;
}
