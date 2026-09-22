// The screens runner. Runs inside the devtools-screens container:
//
//   node screens/runner/run.mjs [project…]
//
// For each project with a story in screens/manifest.mjs: fetch the latest
// source, build it, lay out its fixture, take its shots (and, with
// `record: true`, record the session), and write them to
// static/media/screens/<project>/ and static/media/casts/<project>.cast, with
// an index in src/lib/data/screens.json.
//
// Paths inside the container:
//   /work/site   this repository (read-write: static/media, src/lib/data/screens.json)
//   /cache       repos, build targets and lossless PNGs, kept between runs

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Recorder, keyLabel } from './record.mjs';
import { installShellConfig, loadScheme, xtermTheme } from './theme.mjs';

const SITE = '/work/site';
// The rig's own programs, by absolute path: a story's PATH is the story's (a
// user story leaves /usr/local/bin off it on purpose), and must not decide
// whether the rig can start.
const which = (cmd) =>
	execFileSync('bash', ['-c', `command -v ${cmd}`])
		.toString()
		.trim();
const TTYD = which('ttyd');
const RUNUSER = which('runuser');
const CACHE = '/cache';

const OWNER = 'oddurs';
const WEBP_WIDTH = 1600;

// Declared before the run loop below, which uses them at top level.
let nextPort = 1; // numbers each terminal's socket
let browserPromise = null;

const { stories, TERMINAL } = await import(path.join(SITE, 'screens/manifest.mjs'));
const scheme = await loadScheme(SITE);
installShellConfig();
// Fixtures make commits; give them an author and quiet the advice.
execFileSync('bash', [
	'-c',
	[
		'git config --global user.name "devtools screens"',
		'git config --global user.email screens@devtools.invalid',
		'git config --global init.defaultBranch main',
		'git config --global advice.detachedHead false'
	].join(' && ')
]);

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(stories);
const indexFile = path.join(SITE, 'src/lib/data/screens.json');
const index = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : {};
const report = [];

for (const name of names) {
	const story = stories[name];
	if (!story) {
		report.push([name, 'skipped', 'no story in screens/manifest.mjs']);
		continue;
	}
	if (story.runner === 'host') {
		report.push([name, 'skipped', 'needs macOS; keeps its existing screens']);
		continue;
	}
	const started = Date.now();
	try {
		log(name, `── ${name} ──`);
		const shots = story.runner === 'web' ? await web(name, story) : await terminal(name, story);
		index[name] = shots.entry;
		fs.writeFileSync(indexFile, JSON.stringify(sortKeys(index), null, 2) + '\n');
		report.push([name, 'ok', `${shots.entry.shots.length} shots in ${secs(started)}`]);
	} catch (err) {
		report.push([
			name,
			'failed',
			String(err.message ?? err)
				.split('\n')[0]
				.slice(0, 160)
		]);
		log(name, String(err.stack ?? err));
	}
}

if (browserPromise) await (await browserPromise).close();
console.log('\n' + report.map(([n, s, d]) => `${s.padEnd(8)} ${n.padEnd(34)} ${d}`).join('\n'));
process.exit(report.some(([, s]) => s === 'failed') ? 1 : 0);

// ── terminal stories: fetch, build, fixture, then a real terminal ────────
//
// The terminal is ttyd (a pty behind xterm.js) opened in Chromium, driven by
// Playwright: typing is real keystrokes, waits read the screen's own text,
// and a shot is the page at 2× device pixels.

async function terminal(name, story) {
	const { dir, commit } = fetchRepo(name, story.repo ?? name, story.ref);
	const env = {
		...process.env,
		CARGO_TARGET_DIR: path.join(CACHE, 'target', name),
		HOME: '/root'
	};
	// The GitHub token reaches exactly one story: the one that says it reads
	// GitHub. Every other build, fixture and shell runs without it, so a
	// tool's own build script never sees the desk's credentials.
	if (!story.github) delete env.GH_TOKEN;
	if (story.github && !env.GH_TOKEN) {
		throw new Error('this story reads GitHub, and no GH_TOKEN reached the container');
	}

	if (story.build) {
		log(name, `build: ${story.build}`);
		sh(story.build, { cwd: dir, env, timeout: (story.buildTimeout ?? 900) * 1000, label: 'build' });
	}

	// The stage is the directory the shell starts in: the repo itself, or a
	// fixture laid out fresh for this run. Both live under ~/src, so the prompt
	// reads like a working machine (~/src/cairn), not a container. A story with
	// a `user` runs as that user, in their home, so ~ is theirs.
	const home = story.user ? `/home/${story.user}` : '/root';
	const src = path.join(home, 'src');
	fs.mkdirSync(src, { recursive: true });
	const stage = path.join(src, name);
	if (story.stage === 'repo') {
		fs.rmSync(stage, { recursive: true, force: true });
		fs.symlinkSync(dir, stage);
	}
	if (story.stage !== 'repo') {
		fs.rmSync(stage, { recursive: true, force: true });
		fs.mkdirSync(stage, { recursive: true });
	}
	const binPaths = (story.path ?? ['target/release']).map((p) =>
		p.startsWith('target/')
			? path.join(env.CARGO_TARGET_DIR, p.slice('target/'.length))
			: p.startsWith('/')
				? p
				: path.join(dir, p)
	);
	const shellEnv = {
		...env,
		PATH: `${binPaths.join(':')}:${env.PATH}`,
		REPO: dir,
		STAGE: stage,
		USER_HOME: home
	};
	if (story.fixture) {
		log(name, 'fixture');
		// Run as root, so it can set up anything; what it lays out in the
		// user's home is handed to them after.
		sh(story.fixture, {
			cwd: stage,
			env: shellEnv,
			timeout: (story.fixtureTimeout ?? 300) * 1000,
			label: 'fixture'
		});
	}
	const termEnv = story.user ? userEnv(story, home) : shellEnv;
	if (story.user) {
		installShellConfig(home);
		sh(`chown -R ${story.user}: ${home}/src ${home}/.config ${home}/.cache`, { label: 'chown' });
	}

	const pngDir = freshDir(path.join(CACHE, 'png', name));
	const shots = [];
	// Plates: what the tool made, for a gallery. See the `plate` step below.
	const taken = [];
	// A recording is opt-in per story (`record: true`), one project at a time.
	const rec = story.record ? new Recorder() : null;
	const tty = await openTerminal(stage, termEnv, story, rec);
	// A person types at about this pace; the rig types faster when no one watches.
	// A story can slow it further (`pace: { type, key }`, in ms) to be watched.
	const typeDelay = rec ? (story.pace?.type ?? 45) : 12;
	const keyDelay = rec ? (story.pace?.key ?? 140) : 60;
	// Whatever goes wrong in a step, keep the screen it went wrong on and the
	// session up to it, in screens/failed/ (not published, not tracked).
	const keepFailure = async (page, label) => {
		const failed = path.join(SITE, 'screens/failed');
		fs.mkdirSync(failed, { recursive: true });
		const shot = path.join(failed, `${name}-${label}.png`);
		await page.screenshot({ path: shot });
		rec?.write(path.join(failed, `${name}.cast`), { title: name });
		return path.relative(SITE, shot);
	};

	try {
		const { page } = tty;
		const mouse = pointer(page, tty, rec);
		await waitForScreen(page, /❯/, 20_000);
		if (rec) {
			rec.start();
			// Ctrl+L: fish clears and repaints its prompt, the cast's first frame.
			await page.keyboard.press('Control+l');
			await page.waitForTimeout(300);
		}
		for (const [at, step] of story.steps.entries()) {
			try {
				if ('run' in step) {
					await page.keyboard.type(step.run, { delay: typeDelay });
					await page.keyboard.press('Enter');
				} else if ('hidden' in step) {
					rec?.pause();
					await page.keyboard.type(`${step.hidden}; clear`, { delay: 0 });
					await page.keyboard.press('Enter');
					await page.waitForTimeout(400);
					rec?.resume();
				} else if ('type' in step) {
					rec?.key(step.type);
					await page.keyboard.type(step.type, { delay: typeDelay });
				} else if ('key' in step) {
					rec?.key(keyLabel(step.key, step.times ?? 1));
					for (let i = 0; i < (step.times ?? 1); i++) {
						await page.keyboard.press(keyName(step.key));
						await page.waitForTimeout(keyDelay);
					}
				} else if ('click' in step) await mouse.click(step.click, step.button ?? 'left');
				else if ('hover' in step) await mouse.move(step.hover);
				else if ('scroll' in step) await mouse.scroll(step.scroll, step.at);
				else if ('drag' in step) await mouse.drag(step.drag, step.to);
				else if ('speed' in step) rec?.speed(step.speed);
				else if ('wait' in step)
					await waitForScreen(page, new RegExp(step.wait), seconds(step.timeout ?? '20s') * 1000);
				else if ('sleep' in step) await page.waitForTimeout(seconds(step.sleep) * 1000);
				else if ('shot' in step) {
					await page.waitForTimeout(400);
					// A shot of a shell error is a failed story, never a published screen.
					const screen = await page.evaluate(
						() => document.querySelector('.xterm-rows')?.textContent ?? ''
					);
					const broken =
						/Unknown command|command not found|No such file or directory \(os error|panicked at/.exec(
							screen
						);
					if (broken) throw new Error(`shot ${step.shot} shows "${broken[0]}"`);
					const png = path.join(pngDir, `${step.shot}.png`);
					rec?.marker(step.shot);
					await page.screenshot({ path: png });
					shots.push({ id: step.shot, caption: step.caption, png });
				} else if ('plate' in step) {
					// A plate is one of the things the tool made, for the
					// gallery: the same screenshot as a beat, in the same
					// terminal and the same palette. A tool that exports its
					// own images exports them without either.
					await page.waitForTimeout(400);
					const png = path.join(pngDir, `plate-${step.plate}.png`);
					await page.screenshot({ path: png });
					taken.push({ id: step.plate, caption: step.caption, source: step.source, png });
				} else throw new Error(`${name}: unknown step ${JSON.stringify(step)}`);
			} catch (err) {
				const kept = await keepFailure(page, `step${at + 1}`);
				throw new Error(
					`${err.message} — step ${at + 1}: ${JSON.stringify(step).slice(0, 70)} (${kept})`,
					{ cause: err }
				);
			}
		}
		// Let the last frame sit before the recording ends.
		if (rec) await page.waitForTimeout(1200);
	} finally {
		await tty.close();
	}

	let cast = null;
	if (rec) {
		const file = path.join(SITE, 'static/media/casts', `${name}.cast`);
		const meta = rec.write(file, { title: name });
		cast = { src: `/media/casts/${name}.cast`, ...meta };
		log(
			name,
			`cast: ${meta.cols}×${meta.rows}, ${meta.duration}s, ${Math.round(meta.bytes / 1024)} KB`
		);
	}

	// Some beats are files the program wrote rather than its screen (a render).
	for (const a of story.artifacts ?? []) {
		const png = path.join(pngDir, `${a.shot}.png`);
		sh(
			`ffmpeg -loglevel error -y -i ${JSON.stringify(path.join(stage, a.file))} ${JSON.stringify(png)}`,
			{ label: 'artifact' }
		);
		shots.push({ id: a.shot, caption: a.caption, png });
	}

	// A story may say its material came from the desk rather than the studio.
	// The commit then means nothing — the capture was taken from whatever was
	// on that machine at the time, not from the checkout built here — so it is
	// not claimed. The page discloses the source either way.
	const source = story.source ?? 'terminal';
	const entry = publish(name, story, shots, source === 'desk' ? null : commit, source);
	if (cast) entry.cast = cast;
	// Plates that are files the program wrote (a render), rather than its
	// screen. They go in after the screen's own, and are not trimmed: the
	// frame is the program's, edge to edge.
	for (const r of story.renders ?? []) {
		const png = path.join(pngDir, `plate-${r.plate}.png`);
		sh(
			`ffmpeg -loglevel error -y -i ${JSON.stringify(path.join(stage, r.file))} ${JSON.stringify(png)}`,
			{ label: 'render' }
		);
		taken.push({ id: r.plate, caption: r.caption, source: r.source, png, whole: true });
	}
	const gallery = plates(name, taken);
	if (gallery.length) entry.gallery = gallery;
	const audio = samples(name, stage, story.samples ?? []);
	if (audio.length) entry.audio = audio;
	return { entry };
}

// Samples: a sound the program made, for a tool you hear. Each is a file it
// wrote into the stage (`{ file, id, caption, typed }`), encoded for the page
// and measured for its waveform. The levels are scaled against the loudest
// sample in the set, not each against itself, so two takes drawn side by side
// are as loud as each other as they sound.
function samples(name, stage, list) {
	const PEAKS = 120;
	const outDir = path.join(SITE, 'static/media/audio', name);
	fs.rmSync(outDir, { recursive: true, force: true });
	if (!list.length) return [];
	log(name, `samples: ${list.length}`);
	fs.mkdirSync(outDir, { recursive: true });
	const measured = list.map((a, i) => {
		const input = path.join(stage, a.file);
		const file = `${String(i + 1).padStart(2, '0')}-${a.id}.m4a`;
		sh(
			`ffmpeg -loglevel error -y -i ${JSON.stringify(input)} -c:a aac -b:a 160k -movflags +faststart ${JSON.stringify(path.join(outDir, file))}`,
			{ label: 'sample' }
		);
		// Mono, 8 kHz, signed 16-bit: plenty to find a peak in, and small.
		const pcm = execFileSync(
			'ffmpeg',
			['-loglevel', 'error', '-i', input, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'],
			{ maxBuffer: 256 * 1024 * 1024 }
		);
		const n = Math.floor(pcm.length / 2);
		const levels = [];
		for (let b = 0; b < PEAKS; b++) {
			let top = 0;
			for (let j = Math.floor((b * n) / PEAKS); j < Math.floor(((b + 1) * n) / PEAKS); j++) {
				top = Math.max(top, Math.abs(pcm.readInt16LE(j * 2)));
			}
			levels.push(top / 32768);
		}
		return { a, file, seconds: n / 8000, levels };
	});
	const loudest = Math.max(...measured.flatMap((m) => m.levels)) || 1;
	return measured.map(({ a, file, seconds, levels }) => {
		const sample = {
			src: `/media/audio/${name}/${file}`,
			caption: a.caption,
			seconds: Math.round(seconds * 10) / 10,
			peaks: levels.map((v) => Math.round((v / loudest) * 1000) / 1000)
		};
		if (a.typed) sample.typed = a.typed;
		return sample;
	});
}

// A gallery: what the tool made, rather than one moment of it being made.
// Some tools argue by their output — gummyworm draws images, fontina sets
// type — and four screenshots in a carousel is the wrong shape for judging
// that. Each plate is a `plate` step's screenshot.
function plates(name, taken) {
	const outDir = path.join(SITE, 'static/media/gallery', name);
	fs.rmSync(outDir, { recursive: true, force: true });
	if (!taken.length) return [];
	log(name, `plates: ${taken.length}`);
	fs.mkdirSync(outDir, { recursive: true });
	return taken.map((t, i) => {
		const file = `${String(i + 1).padStart(2, '0')}-${t.id}.webp`;
		const dest = path.join(outDir, file);
		// A plate is read next to a dozen others, not full width, so the empty
		// two-thirds of the terminal is thrown away and a margin put back.
		// Trimmed against the terminal's own ground, so the margin matches it.
		const trimmed = t.png.replace(/\.png$/, '-trim.png');
		if (t.whole) fs.copyFileSync(t.png, trimmed);
		else
			sh(
				`magick ${JSON.stringify(t.png)} -bordercolor ${JSON.stringify(scheme.background)} ` +
					`-border 1 -trim +repage -border 28 ${JSON.stringify(trimmed)}`,
				{ label: 'plate-trim' }
			);
		const [w] = dims(trimmed);
		const resize = w > WEBP_WIDTH ? `-resize ${WEBP_WIDTH} 0` : '';
		sh(`cwebp -quiet -q 84 ${resize} ${JSON.stringify(trimmed)} -o ${JSON.stringify(dest)}`, {
			label: 'plate-webp'
		});
		const [width, height] = dims(dest);
		const plate = { src: `/media/gallery/${name}/${file}`, caption: t.caption, width, height };
		if (t.source) plate.source = t.source;
		return plate;
	});
}

// The environment a user's login shell would have, and nothing of the rig's:
// the story says what is on their PATH and what else they set (`env`).
function userEnv(story, home) {
	return {
		HOME: home,
		USER: story.user,
		LOGNAME: story.user,
		SHELL: '/usr/bin/fish',
		LANG: process.env.LANG ?? 'en_US.UTF-8',
		LC_ALL: process.env.LC_ALL ?? 'en_US.UTF-8',
		PATH: '/usr/local/bin:/usr/bin:/bin',
		...(story.env ?? {})
	};
}

// Starts fish under ttyd in `cwd` and opens it: JetBrains Mono, the site's
// scheme, padding round the cells, sized to TERMINAL.
async function openTerminal(cwd, env, story = {}, rec = null) {
	// A story may ask for a different terminal: a command-line tool that
	// prints forty lines is read in a forty-line terminal, not scrolled past
	// in a twenty-nine-line one.
	const t = { ...TERMINAL, ...(story.terminal ?? {}) };
	const opts = {
		fontFamily: 'JetBrains Mono',
		fontSize: t.fontSize,
		lineHeight: 1.2,
		rendererType: 'dom',
		cursorBlink: false,
		disableLeaveAlert: true,
		disableResizeOverlay: true,
		titleFixed: 'terminal',
		theme: JSON.stringify(xtermTheme(scheme))
	};
	// ttyd listens on a Unix socket, not a port, and the browser reaches it
	// through Playwright's request and WebSocket routing. Nothing the rig runs
	// shows up in tools that list listening sockets (quarry).
	const socket = `/tmp/ttyd-${nextPort++}.sock`;
	fs.rmSync(socket, { force: true });
	const args = ['-W', '-i', socket];
	for (const [k, v] of Object.entries(opts)) args.push('-t', `${k}=${v}`);
	// ttyd itself starts in / and fish cds to the stage, so fish keeps the
	// logical path and a symlinked stage reads ~/src/<name>.
	const init = `cd ${cwd}`;
	if (story.isolate) {
		// Its own process namespace: a tool that lists processes (poptop) sees
		// the shell, itself and the story's background work, not the rig.
		const start = story.background ? `${story.background}\n` : '';
		args.push(
			'unshare',
			'--pid',
			'--fork',
			'--mount-proc',
			'bash',
			'-c',
			`${start}exec fish -l -C '${init}'`
		);
	} else if (story.user) {
		// runuser keeps the environment it is given: the user's, from userEnv.
		args.push(RUNUSER, '-u', story.user, '--', '/usr/bin/fish', '-l', '-C', init);
	} else {
		args.push('fish', '-l', '-C', init);
	}
	const ttyEnv = { ...env, TERM: 'xterm-256color', COLORTERM: 'truecolor' };
	const server = spawn(TTYD, args, { cwd: '/', env: ttyEnv, detached: true, stdio: 'ignore' });
	await waitFor(() => fs.existsSync(socket), 'ttyd socket');

	const require = createRequire('/opt/runner/');
	const WebSocket = require('ws');
	const browser = await getBrowser();
	const context = await browser.newContext({
		viewport: { width: t.width, height: t.height },
		deviceScaleFactor: 2
	});
	const origin = 'http://terminal.invalid';
	await context.route(`${origin}/**`, async (route) => {
		const req = route.request();
		const res = await unixRequest(
			socket,
			new URL(req.url()).pathname + new URL(req.url()).search,
			req.method()
		);
		await route.fulfill({ status: res.status, headers: res.headers, body: res.body });
	});
	// The browser tells ttyd its size: first in the JSON handshake, then as
	// '1'-tagged resize frames. The pointer needs it, and so does the cast.
	const size = { cols: 0, rows: 0 };
	const noteSize = (m) => {
		const text = typeof m === 'string' ? m : Buffer.from(m).toString('utf8');
		const json = text.startsWith('{') ? text : text.startsWith('1{') ? text.slice(1) : null;
		if (!json) return;
		try {
			const { columns, rows } = JSON.parse(json);
			if (columns && rows) {
				size.cols = columns;
				size.rows = rows;
				rec?.size(columns, rows);
			}
		} catch {
			// Not a size message after all: input that happens to start with {.
		}
	};
	await context.routeWebSocket(`ws://terminal.invalid/ws`, (ws) => {
		const upstream = new WebSocket(`ws+unix://${socket}:/ws`, ['tty']);
		const pending = [];
		upstream.on('open', () => pending.splice(0).forEach((m) => upstream.send(m)));
		upstream.on('message', (data, isBinary) => {
			// ttyd tags each frame: '0' is terminal output.
			if (rec && isBinary && data[0] === 0x30) rec.output(data.subarray(1));
			ws.send(isBinary ? data : data.toString());
		});
		upstream.on('close', () => ws.close());
		upstream.on('error', (e) => console.log(`[terminal] socket error: ${e.message}`));
		ws.onMessage((m) => {
			noteSize(m);
			if (upstream.readyState === 1) upstream.send(m);
			else pending.push(m);
		});
		ws.onClose(() => upstream.close());
	});

	const page = await context.newPage();
	await page.goto(`${origin}/`, { waitUntil: 'load' });
	await page.locator('.xterm-rows').waitFor({ timeout: 20_000 });
	const bg = scheme.background;
	await page.addStyleTag({
		content: `html, body { background: ${bg} !important; margin: 0; }
      #terminal-container { position: absolute !important; inset: ${t.padding}px !important; width: auto !important; height: auto !important; }
      .xterm .xterm-viewport { overflow: hidden !important; }`
	});
	// Refit the terminal to its padded box, once the font is in: a fit against
	// the fallback font's metrics gives a different grid (35 rows, not 29), and
	// which one a run got used to be a race. Then wait until the size holds.
	await page.evaluate(() => document.fonts.ready);
	await page.evaluate(() => window.dispatchEvent(new Event('resize')));
	let last = '';
	for (let i = 0; i < 20; i++) {
		await page.waitForTimeout(250);
		const now = `${size.cols}x${size.rows}`;
		if (now === last && size.cols) break;
		last = now;
	}
	await page.locator('.xterm-helper-textarea').focus();

	return {
		page,
		size,
		async close() {
			await context.close();
			try {
				process.kill(-server.pid, 'SIGKILL');
			} catch {
				// Already gone.
			}
			fs.rmSync(socket, { force: true });
		}
	};
}

// The mouse, in cells. A target is text on screen (the centre of the first
// cell showing it) or { row, col }, 0-based. Everything goes through xterm.js,
// so the program gets real mouse reports, and only if it asked for them. When
// recording, the pointer's path goes into the cast so playback can draw it.
function pointer(page, tty, rec) {
	// Positions are in cells, fractional: { col: 21.5, row: 2.5 } is the centre
	// of cell (21, 2). The pointer track stores the same, so playback maps a
	// point to pixels with no rounding of its own.
	let at = null;

	async function geometry() {
		const box = await page.locator('.xterm-screen').boundingBox();
		if (!box || !tty.size.cols) throw new Error('terminal size unknown');
		return { box, cw: box.width / tty.size.cols, ch: box.height / tty.size.rows };
	}

	async function locate(target) {
		if (typeof target === 'object') return { col: target.col + 0.5, row: target.row + 0.5 };
		const rows = await page.evaluate(() =>
			[...document.querySelectorAll('.xterm-rows > div')].map((d) =>
				d.textContent.replace(/\u00a0/g, ' ')
			)
		);
		for (let row = 0; row < rows.length; row++) {
			const col = rows[row].indexOf(target);
			// The centre of its second cell (or its only one): inside the word, and
			// never on a boundary between two cells.
			if (col >= 0) return { col: col + Math.min(target.length - 1, 1) + 0.5, row: row + 0.5 };
		}
		throw new Error(`nothing on screen reads "${target}"`);
	}

	// Glides there, the way a hand would, rather than teleporting.
	async function glide(to) {
		const { box, cw, ch } = await geometry();
		const px = (c) => ({ x: box.x + c.col * cw, y: box.y + c.row * ch });
		const from = at ?? { col: to.col, row: Math.min(tty.size.rows - 0.5, to.row + 4) };
		rec?.point(from.col, from.row, 'move');
		const steps = rec ? 16 : 1;
		for (let i = 1; i <= steps; i++) {
			const k = i / steps;
			const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
			const p = px({
				col: from.col + (to.col - from.col) * e,
				row: from.row + (to.row - from.row) * e
			});
			await page.mouse.move(p.x, p.y);
			if (rec) await page.waitForTimeout(22);
		}
		rec?.point(to.col, to.row, 'move');
		at = to;
	}

	return {
		async move(target) {
			await glide(await locate(target));
		},
		async click(target, button) {
			await glide(await locate(target));
			if (rec) await page.waitForTimeout(120);
			rec?.point(at.col, at.row, 'down');
			await page.mouse.down({ button });
			await page.waitForTimeout(rec ? 90 : 30);
			await page.mouse.up({ button });
			rec?.point(at.col, at.row, 'up');
			await page.waitForTimeout(rec ? 250 : 60);
		},
		async scroll(lines, target) {
			if (target !== undefined) await glide(await locate(target));
			const { ch } = await geometry();
			const dir = Math.sign(lines);
			for (let i = 0; i < Math.abs(lines); i++) {
				rec?.point(at?.col ?? 0, at?.row ?? 0, `scroll:${dir}`);
				await page.mouse.wheel(0, dir * ch);
				await page.waitForTimeout(rec ? 90 : 30);
			}
		},
		async drag(from, to) {
			await glide(await locate(from));
			rec?.point(at.col, at.row, 'down');
			await page.mouse.down();
			await glide(await locate(to));
			await page.mouse.up();
			rec?.point(at.col, at.row, 'up');
		}
	};
}

function unixRequest(socketPath, pathname, method) {
	return new Promise((resolve, reject) => {
		const req = http.request({ socketPath, path: pathname, method }, (res) => {
			const chunks = [];
			res.on('data', (c) => chunks.push(c));
			res.on('end', () => {
				const headers = {};
				for (const [k, v] of Object.entries(res.headers)) if (typeof v === 'string') headers[k] = v;
				resolve({ status: res.statusCode ?? 500, headers, body: Buffer.concat(chunks) });
			});
		});
		req.on('error', reject);
		req.end();
	});
}

async function waitFor(check, what) {
	for (let i = 0; i < 100; i++) {
		if (check()) return;
		await new Promise((r) => setTimeout(r, 100));
	}
	throw new Error(`${what} did not appear`);
}

async function waitForScreen(page, re, timeout) {
	const deadline = Date.now() + timeout;
	while (Date.now() < deadline) {
		const text = await page.evaluate(
			() => document.querySelector('.xterm-rows')?.textContent ?? ''
		);
		if (re.test(text)) return;
		await page.waitForTimeout(250);
	}
	throw new Error(`timed out waiting for ${re} on screen`);
}

// Step key names, in the tape-like spelling the manifest uses.
function keyName(k) {
	const map = {
		Up: 'ArrowUp',
		Down: 'ArrowDown',
		Left: 'ArrowLeft',
		Right: 'ArrowRight',
		Space: ' '
	};
	if (map[k]) return map[k];
	return k
		.replace(/^Ctrl\+(\w)$/, (_, c) => `Control+${c.toLowerCase()}`)
		.replace(/^Alt\+(\w)$/, (_, c) => `Alt+${c.toLowerCase()}`);
}

function seconds(v) {
	const m = /^([\d.]+)(ms|s)?$/.exec(String(v));
	if (!m) throw new Error(`bad duration ${v}`);
	return m[2] === 'ms' ? Number(m[1]) / 1000 : Number(m[1]);
}

function freshDir(dir) {
	fs.rmSync(dir, { recursive: true, force: true });
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}

function getBrowser() {
	if (!browserPromise) {
		const require = createRequire('/opt/runner/');
		const { chromium } = require('playwright-core');
		browserPromise = chromium.launch({
			executablePath: process.env.CHROME_PATH,
			args: [
				'--no-sandbox',
				'--use-angle=swiftshader',
				'--enable-unsafe-swiftshader',
				'--ignore-gpu-blocklist',
				'--autoplay-policy=no-user-gesture-required',
				'--font-render-hinting=none'
			]
		});
	}
	return browserPromise;
}

// ── web stories: Playwright against the deployed build ───────────────────

async function web(name, story) {
	const browser = await getBrowser();
	const pngDir = freshDir(path.join(CACHE, 'png', name));
	const shots = [];
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 2,
		colorScheme: story.colorScheme ?? 'dark',
		reducedMotion: 'no-preference'
	});
	try {
		const page = await context.newPage();
		log(name, `open ${story.url}`);
		await page.goto(story.url, { waitUntil: 'load', timeout: 60_000 });
		for (const step of story.steps) {
			if ('goto' in step)
				await page.goto(new URL(step.goto, story.url).href, { waitUntil: 'load', timeout: 60_000 });
			else if ('wait' in step) await page.waitForTimeout(step.wait);
			else if ('waitFor' in step)
				await page
					.locator(step.waitFor)
					.first()
					.waitFor({ timeout: step.timeout ?? 20_000 });
			else if ('click' in step) {
				const target = page.locator(step.click).first();
				try {
					await target.click({ timeout: step.timeout ?? 8_000 });
				} catch (e) {
					if (!step.optional) throw e;
					log(name, `optional click missed: ${step.click}`);
				}
			} else if ('press' in step) {
				for (let i = 0; i < (step.times ?? 1); i++) await page.keyboard.press(step.press);
			} else if ('hold' in step) {
				await page.keyboard.down(step.hold);
				await page.waitForTimeout(step.ms ?? 1000);
				await page.keyboard.up(step.hold);
			} else if ('scroll' in step) {
				await page.mouse.wheel(0, step.scroll);
				await page.waitForTimeout(600);
			} else if ('shot' in step) {
				const png = path.join(pngDir, `${step.shot}.png`);
				// WebGL under SwiftShader can take a while to hand over a frame.
				await page.screenshot({ path: png, fullPage: false, timeout: 90_000 });
				shots.push({ id: step.shot, caption: step.caption, png });
			} else throw new Error(`${name}: unknown step ${JSON.stringify(step)}`);
		}
	} finally {
		await context.close();
	}
	const commit = remoteHead(story.repo ?? name);
	return { entry: publish(name, story, shots, commit, 'web') };
}

// ── shared ───────────────────────────────────────────────────────────────

// Converts every PNG to WebP for the site, and returns the index entry.
function publish(name, story, shots, commit, runner) {
	const outDir = path.join(SITE, 'static/media/screens', name);
	fs.rmSync(outDir, { recursive: true, force: true });
	fs.mkdirSync(outDir, { recursive: true });
	const order = ['hero', 'start', 'use', 'depth'];
	const sorted = [...shots].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
	const out = sorted.map((s, i) => {
		if (!fs.existsSync(s.png)) throw new Error(`shot ${s.id} was not written`);
		const file = `${String(i + 1).padStart(2, '0')}-${s.id}.webp`;
		const dest = path.join(outDir, file);
		const [w] = dims(s.png);
		const resize = w > WEBP_WIDTH ? `-resize ${WEBP_WIDTH} 0` : '';
		sh(`cwebp -quiet -q 84 ${resize} ${JSON.stringify(s.png)} -o ${JSON.stringify(dest)}`, {
			label: 'webp'
		});
		const [width, height] = dims(dest);
		return { beat: s.id, caption: s.caption, src: `/media/screens/${name}/${file}`, width, height };
	});
	// The terminal's background, so the site's window around the shots matches.
	const background = runner === 'terminal' ? scheme.background : undefined;
	return { runner, commit, takenAt: new Date().toISOString(), background, shots: out };
}

// The default branch's latest commit, or a story's `ref` (a branch or tag)
// when it should show work that has not landed yet.
function fetchRepo(name, repo, ref) {
	const dir = path.join(CACHE, 'repos', name);
	const url = `https://github.com/${OWNER}/${repo}.git`;
	if (!fs.existsSync(path.join(dir, '.git'))) {
		log(name, `clone ${url}`);
		sh(`git clone --depth 50 ${url} ${dir}`, { label: 'clone', timeout: 300_000 });
	}
	log(name, `pull latest${ref ? ` ${ref}` : ''}`);
	const target = ref ? `origin ${JSON.stringify(ref)}` : 'origin';
	const head = ref ? 'FETCH_HEAD' : 'origin/HEAD';
	sh(`git fetch --depth 50 ${target} && git reset --hard ${head} && git clean -fdq`, {
		cwd: dir,
		label: 'pull',
		timeout: 300_000
	});
	const commit = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { cwd: dir })
		.toString()
		.trim();
	return { dir, commit };
}

function remoteHead(repo) {
	try {
		return execFileSync('git', ['ls-remote', `https://github.com/${OWNER}/${repo}.git`, 'HEAD'])
			.toString()
			.slice(0, 12);
	} catch {
		return null;
	}
}

function dims(file) {
	const out = execFileSync('ffprobe', [
		'-v',
		'error',
		'-select_streams',
		'v:0',
		'-show_entries',
		'stream=width,height',
		'-of',
		'csv=p=0',
		file
	]);
	return out.toString().trim().split(',').map(Number);
}

function sh(cmd, { cwd, env, timeout = 600_000, label } = {}) {
	const r = spawnSync('bash', ['-c', cmd], {
		cwd,
		env: env ?? process.env,
		timeout,
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024
	});
	if (r.error?.code === 'ETIMEDOUT') throw new Error(`${label} timed out after ${timeout / 1000}s`);
	if (r.status !== 0) {
		const tail = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split('\n').slice(-12).join('\n');
		throw new Error(`${label} failed (exit ${r.status}): ${tail}`);
	}
	return r.stdout;
}

function log(name, msg) {
	console.log(`[${name}] ${msg}`);
}

function secs(since) {
	return `${Math.round((Date.now() - since) / 1000)}s`;
}

function sortKeys(o) {
	return Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
}
