// One story reads GitHub, which means a token now enters the container. A
// cast is a recording of a terminal and a screenshot is a picture of one, so
// anything that ever reached the screen is committed for good. This is the
// check that nothing did.
//
// It scans what the runner writes — the index, the casts, and the stories
// themselves — for the shapes credentials come in. It is deliberately broader
// than GitHub: a token pasted into a fixture by a future hand should fail
// here too.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = new URL('../../../', import.meta.url);
const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, root)), 'utf8');

const SECRETS: [string, RegExp][] = [
	// GitHub: personal, OAuth, user-to-server, server-to-server, refresh, and
	// the fine-grained kind.
	['a GitHub token', /\bgh[pousr]_[A-Za-z0-9]{16,}/],
	['a fine-grained GitHub token', /\bgithub_pat_[A-Za-z0-9_]{20,}/],
	// The shapes other providers use, in case a fixture ever reaches for one.
	['an OpenAI key', /\bsk-[A-Za-z0-9]{20,}/],
	['an Anthropic key', /\bsk-ant-[A-Za-z0-9-]{20,}/],
	['an AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
	['a private key block', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/]
];

function scan(label: string, text: string) {
	for (const [what, pattern] of SECRETS) {
		const hit = pattern.exec(text);
		expect(hit === null, `${label} looks like it contains ${what}`).toBe(true);
	}
}

describe('nothing the runner writes carries a credential', () => {
	it('screens.json is clean', () => {
		scan('screens.json', read('src/lib/data/screens.json'));
	});

	const casts = readdirSync(fileURLToPath(new URL('static/media/casts', root)));

	it('there are casts to check', () => {
		expect(casts.length).toBeGreaterThan(0);
	});

	it.each(casts)('%s is clean', (file) => {
		scan(file, read(`static/media/casts/${file}`));
	});

	it('the stories themselves are clean', () => {
		// A token belongs in the environment, never in a fixture.
		scan('screens/manifest.mjs', read('screens/manifest.mjs'));
	});

	it('and the captures committed by hand are too', () => {
		for (const file of readdirSync(fileURLToPath(new URL('src/lib/data/captures', root)))) {
			scan(file, read(`src/lib/data/captures/${file}`));
		}
	});
});

describe('the token never travels in the repository', () => {
	it('the runner hands it only to stories that ask for it', () => {
		const runner = read('screens/runner/run.mjs');
		expect(runner).toContain('if (!story.github) delete env.GH_TOKEN');
	});

	it('the rig borrows it rather than storing it', () => {
		const script = read('scripts/screens.sh');
		expect(script).toContain('gh auth token');
		// Passed by environment, so it never reaches the process list.
		expect(script).toContain('-e GH_TOKEN=');
		expect(script).not.toMatch(/GH_TOKEN=gh[pousr]_/);
	});
});
