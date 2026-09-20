// A tool as the site shows it: its entry (tools.ts) joined to what the
// screens runner shot of it (screens.json, `npm run screens`).
import index from './screens.json';
import { sections, type Media, type State, type Tool } from './tools';

export type { Media, State };

export type Shot = {
	beat: 'hero' | 'start' | 'use' | 'depth';
	caption: string;
	src: string;
	width: number;
	height: number;
};

// One picture a tool made. Some tools argue by their output rather than by
// their interface — gummyworm draws images, fontina sets type — and four
// screenshots in a carousel is the wrong shape for judging that. A plate is
// one of those outputs, shown next to the others.
export type Plate = {
	src: string;
	caption: string;
	width: number;
	height: number;
	// What the tool was given: the source image, the typeface, the input.
	source?: string;
	// Set when `src` moves. The still is what shows until it is asked to play,
	// and all it ever shows under prefers-reduced-motion.
	still?: string;
};

// A sample of a tool you hear rather than see. clackson is a keyboard made
// audible: nothing on a page of screenshots carries it, and a recording of a
// terminal carries it least of all, the terminal being silent.
export type Sample = {
	src: string;
	caption: string;
	seconds: number;
	// The waveform, as levels from 0 to 1, measured off the file by the runner
	// so the page draws the sound rather than showing a picture of it.
	peaks: number[];
	// What was being typed while it was recorded.
	typed?: string;
};

// A recorded session: asciicast v2, from the screens runner. `markers` are its
// chapters, one per screenshot beat, as [seconds, beat].
export type Cast = {
	src: string;
	cols: number;
	rows: number;
	duration: number;
	bytes: number;
	markers: [number, string][];
};

// One project's entry in screens.json.
type Shots = {
	runner: string;
	commit: string | null;
	takenAt: string;
	// The terminal's background when the shots were taken, so the window
	// around them can match it.
	background?: string;
	shots: Shot[];
	cast?: Cast;
	gallery?: Plate[];
	audio?: Sample[];
};

export type Project = Omit<Tool, 'install' | 'site' | 'recording' | 'poster'> & {
	install: string | null;
	site: string | null;
	recording: Media | null;
	poster: string | null;
	screens: Shot[];
	screenBackground: string | null;
	cast: Cast | null;
	gallery: Plate[];
	audio: Sample[];
	commit: string | null;
};

export type Group = { label: string; projects: Project[] };

// Written by the runner in this shape; JSON cannot say [number, string], so
// the shape is asserted here rather than proved. screens.test.ts is the proof:
// it checks every field, and that every picture and recording named is on
// disk, so a bad run of the runner fails the build instead of the page.
const shotsOf = index as unknown as Record<string, Shots>;

function project(t: Tool): Project {
	const s = shotsOf[t.name];
	return {
		...t,
		install: t.install ?? null,
		site: t.site ?? null,
		recording: t.recording ?? null,
		poster: t.poster ?? null,
		screens: s?.shots ?? [],
		screenBackground: s?.background ?? null,
		cast: s?.cast ?? null,
		gallery: s?.gallery ?? [],
		audio: s?.audio ?? [],
		commit: s?.commit ?? null
	};
}

export const groups: Group[] = sections.map((s) => ({
	label: s.label,
	projects: s.tools.map(project)
}));
export const projects: Project[] = groups.flatMap((g) => g.projects);

export function find(name: string): Project | undefined {
	return projects.find((p) => p.name === name);
}

export function neighbours(name: string): { prev: Project; next: Project } {
	const i = projects.findIndex((p) => p.name === name);
	const n = projects.length;
	return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

export function stateLabel(state: State): string {
	switch (state.kind) {
		case 'released':
			return `v${state.version}`;
		case 'source':
			return state.version ? `v${state.version} · from source` : 'from source';
		case 'live':
			return 'live';
		case 'design':
			return 'pre-release';
	}
}

// Not released in any form yet: designed in the open, docs before code.
export function prerelease(p: Project): boolean {
	return p.state.kind === 'design';
}

// What the demo can show, in the order it prefers them: a recording of the
// tool running, then its real screens, then — for the tools those two cannot
// carry — a gallery of what it made, or a sample of what it sounds like.
export type View = 'recording' | 'screens' | 'gallery' | 'audio';

export function stills(p: Project): Shot[] {
	if (p.screens.length) return p.screens;
	const media =
		p.recording ?? (p.poster ? { src: p.poster, alt: p.line, width: 1600, height: 1000 } : null);
	return media ? [{ beat: 'hero', caption: media.alt, ...media }] : [];
}

export function views(p: Project): View[] {
	const out: View[] = [];
	if (p.cast) out.push('recording');
	if (stills(p).length) out.push('screens');
	if (p.gallery.length) out.push('gallery');
	if (p.audio.length) out.push('audio');
	return out;
}
