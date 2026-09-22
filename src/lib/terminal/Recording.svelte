<!--
	A recorded session, played in a real terminal renderer (xterm.js) set in
	the Ghostty config: its face, cell height and sixteen colours. The program's
	own escape codes decide everything else, so what plays is what it printed.

	Over the terminal, what output alone cannot show: the pointer and its clicks
	(for mouse-first programs), the keys as they are pressed, and a badge while
	a stretch is time-lapsed. Chapters are the screenshot beats.

	xterm.js loads only when a recording is on screen.
-->
<script lang="ts">
	import '@xterm/xterm/css/xterm.css';
	import { onMount } from 'svelte';
	import type { Terminal } from '@xterm/xterm';
	import { asset } from '$app/paths';
	import type { Cast } from '$lib/data/projects';
	import { ADVANCE, ROW, font, theme } from './theme';
	import {
		chapterAt,
		clock,
		keyAt,
		parse,
		pointerAt,
		posterAt,
		speedAt,
		type Pointer,
		type Recording
	} from './cast';

	// The beats as the chapter buttons name them.
	const beatName: Record<string, string> = {
		hero: 'at a glance',
		start: 'getting started',
		use: 'in use',
		depth: 'in depth'
	};

	type Props = { cast: Cast; chapter?: number };
	let { cast, chapter = $bindable(-1) }: Props = $props();

	let host: HTMLDivElement;
	let stage: HTMLDivElement;
	let term: Terminal | null = null;
	let rec = $state<Recording | null>(null);
	let failed = $state(false);

	let t = $state(0);
	let playing = $state(false);
	// Set once anyone has played, scrubbed or jumped. Until then the window
	// shows the poster, and play starts from the top.
	let started = false;
	let rate = $state(1);
	let cursor = 0; // next event to write

	// Overlay state, recomputed every frame from t.
	let point = $state<Pointer | null>(null);
	let key = $state<{ label: string; age: number } | null>(null);
	let lapse = $state(1);
	let cell = $state({ w: 0, h: 0, x: 0, y: 0 });

	const duration = $derived(rec?.duration ?? cast.duration);
	// The recording's proportions, known from the index before a byte of it
	// has loaded: columns by the advance, rows by the line xterm draws.
	const reserve = $derived(`${cast.cols * ADVANCE} / ${cast.rows * ROW}`);
	const ended = $derived(t >= duration - 0.001);

	// Writes every event up to `to`. Going back means replaying from the top:
	// xterm has no undo, and replaying a minute of output takes milliseconds.
	function seek(to: number) {
		if (!term || !rec) return;
		to = Math.max(0, Math.min(to, duration));
		if (to < t) {
			term.reset();
			cursor = 0;
		}
		let out = '';
		const ev = rec.events;
		while (cursor < ev.length && ev[cursor][0] <= to) {
			const [, code, data] = ev[cursor];
			if (code === 'o') out += data;
			else if (code === 'r') {
				if (out) term.write(out);
				out = '';
				const [c, r] = data.split('x').map(Number);
				term.resize(c, r);
			}
			cursor++;
		}
		if (out) term.write(out);
		t = to;
		sync();
	}

	function sync() {
		if (!rec) return;
		chapter = chapterAt(rec, t);
		point = pointerAt(rec, t);
		key = keyAt(rec, t);
		lapse = speedAt(rec, t);
	}

	let frame = 0;
	let last = 0;
	function tick(now: number) {
		const dt = last ? (now - last) / 1000 : 0;
		last = now;
		seek(t + dt * rate);
		if (t >= duration) {
			playing = false;
			return;
		}
		frame = requestAnimationFrame(tick);
	}

	export function play() {
		if (!term || playing) return;
		if (!started || ended) seek(0);
		started = true;
		playing = true;
		last = 0;
		frame = requestAnimationFrame(tick);
	}

	export function pause() {
		playing = false;
		cancelAnimationFrame(frame);
	}

	export function toggle() {
		if (playing) pause();
		else play();
	}

	// Jumps to a chapter: the frame its screenshot was taken from.
	export function jump(i: number) {
		if (!rec || !rec.markers[i]) return;
		started = true;
		seek(rec.markers[i][0]);
	}

	export function step(by: number) {
		if (!rec?.markers.length) return;
		const next = Math.max(0, Math.min(rec.markers.length - 1, chapter + by));
		jump(next);
	}

	// The font is sized so the recording's columns fill the window's width,
	// never larger than the configured size, the way a window is sized to what
	// runs in it.
	//
	// Below FLOOR there is no size at which 125 columns both fit and draw
	// cleanly — xterm rounds its cells and the columns drift. So on a narrow
	// screen the terminal is drawn at FLOOR and the whole thing is scaled down
	// as a picture would be: every column visible, the geometry exact, nothing
	// cut off the right-hand side. It used to lose a third of its width on a
	// phone.
	const FLOOR = 8;
	let scale = $state(1);
	let shrink = $state(0);
	let ready = $state(false);

	function fit() {
		if (!term || !rec || !host) return;
		const width = host.clientWidth - theme.padding.x * 2;
		const exact = width / (rec.cols * ADVANCE);
		const size = Math.min(theme.font.size * 1.15, Math.max(FLOOR, exact));
		if (Math.abs((term.options.fontSize ?? 0) - size) > 0.05) term.options.fontSize = size;
		// Measured, not computed: the width xterm actually laid out.
		requestAnimationFrame(() => {
			const screen = host?.querySelector<HTMLElement>('.xterm-screen');
			if (!screen || !host) return;
			const natural = screen.offsetWidth;
			scale = natural > host.clientWidth ? host.clientWidth / natural : 1;
			shrink = screen.offsetHeight * (1 - scale);
			ready = true;
			measure();
		});
	}

	function measure() {
		const screen = host?.querySelector('.xterm-screen');
		if (!screen || !rec || !stage) return;
		const a = screen.getBoundingClientRect();
		const b = stage.getBoundingClientRect();
		cell = { w: a.width / rec.cols, h: a.height / rec.rows, x: a.left - b.left, y: a.top - b.top };
	}

	onMount(() => {
		let disposed = false;
		let observer: ResizeObserver | undefined;
		let seen: IntersectionObserver | undefined;

		(async () => {
			try {
				const [{ Terminal }, text] = await Promise.all([
					import('@xterm/xterm'),
					fetch(asset(cast.src)).then((r) => {
						if (!r.ok) throw new Error(`${r.status}`);
						return r.text();
					})
				]);
				if (disposed) return;
				rec = parse(text);
				const p = theme.palette;
				term = new Terminal({
					cols: rec.cols,
					rows: rec.rows,
					fontFamily: font,
					fontSize: theme.font.size,
					fontWeight: theme.font.thicken ? '500' : '400',
					fontWeightBold: '700',
					lineHeight: 1.12,
					letterSpacing: 0,
					cursorBlink: false,
					cursorInactiveStyle: 'block',
					disableStdin: true,
					scrollback: 0,
					allowProposedApi: false,
					theme: {
						background: theme.background,
						foreground: theme.foreground,
						cursor: theme.cursor,
						cursorAccent: theme.cursorText,
						selectionBackground: theme.selection,
						selectionForeground: theme.selectionText,
						black: p[0],
						red: p[1],
						green: p[2],
						yellow: p[3],
						blue: p[4],
						magenta: p[5],
						cyan: p[6],
						white: p[7],
						brightBlack: p[8],
						brightRed: p[9],
						brightGreen: p[10],
						brightYellow: p[11],
						brightBlue: p[12],
						brightMagenta: p[13],
						brightCyan: p[14],
						brightWhite: p[15]
					}
				});
				// The face has to be in before xterm measures its cell.
				await Promise.all([
					document.fonts.load(`${theme.font.size}px "JetBrains Mono Variable"`),
					document.fonts.load(`${theme.font.size}px "Term Glyphs"`, '⣿█')
				]).catch(() => {});
				term.open(host);
				fit();
				// Rest on the hero frame, not the clean screen every recording opens
				// on: under reduced motion it never plays, and this is all anyone sees.
				seek(posterAt(rec));
				observer = new ResizeObserver(fit);
				observer.observe(host);

				// Plays once when it comes into view; never under reduced motion.
				const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
				seen = new IntersectionObserver(
					([e]) => {
						if (e.isIntersecting && !still && !started) play();
						if (!e.isIntersecting) pause();
					},
					{ threshold: 0.4 }
				);
				seen.observe(host);
			} catch {
				failed = true;
			}
		})();

		return () => {
			disposed = true;
			pause();
			observer?.disconnect();
			seen?.disconnect();
			term?.dispose();
		};
	});

	function scrub(e: PointerEvent) {
		const rail = e.currentTarget as HTMLElement;
		const go = (x: number) => {
			const r = rail.getBoundingClientRect();
			seek(((x - r.left) / r.width) * duration);
		};
		const wasPlaying = playing;
		started = true;
		pause();
		go(e.clientX);
		rail.setPointerCapture(e.pointerId);
		const move = (m: PointerEvent) => go(m.clientX);
		const up = () => {
			rail.removeEventListener('pointermove', move);
			rail.removeEventListener('pointerup', up);
			if (wasPlaying && !ended) play();
		};
		rail.addEventListener('pointermove', move);
		rail.addEventListener('pointerup', up);
	}

	function railKey(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') seek(t + 2);
		else if (e.key === 'ArrowLeft') seek(t - 2);
		else return;
		started = true;
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<div class="recording">
	<div class="stage" bind:this={stage}>
		<!--
			Before xterm arrives the box is held open at the recording's own
			proportions, so the page does not jump when it does. After, it is
			the terminal's natural size, scaled down on a narrow screen with the
			space it no longer needs given back underneath.
		-->
		<div
			class="term"
			bind:this={host}
			style:aspect-ratio={ready ? null : reserve}
			style:transform={scale < 1 ? `scale(${scale})` : null}
			style:margin-bottom={scale < 1 ? `${-shrink}px` : null}
		></div>

		{#if point && point.fade > 0 && cell.w}
			<div
				class="pointer"
				class:pressed={point.pressed}
				style="left:{cell.x + point.col * cell.w}px; top:{cell.y +
					point.row * cell.h}px; opacity:{point.fade}"
			>
				{#if point.ring !== null}
					<span class="ring" style="--k:{point.ring}"></span>
				{/if}
				<svg viewBox="0 0 16 22" width="15" height="21" aria-hidden="true"
					><path d="M1 1v16.5l4.3-4.1 2.9 6.9 2.8-1.2-2.9-6.8h6z" /></svg
				>
			</div>
		{/if}

		<div class="badges" aria-hidden="true">
			{#if lapse > 1}
				<span class="badge lapse">time-lapse ×{lapse}</span>
			{/if}
			{#if key}
				<span class="badge key" style="opacity:{1 - key.age * key.age}">{key.label}</span>
			{/if}
		</div>

		{#if failed}
			<p class="failed">The recording didn’t load.</p>
		{/if}
	</div>

	<div class="transport">
		<button
			type="button"
			class="play"
			onclick={toggle}
			aria-label={playing ? 'Pause' : ended ? 'Replay' : 'Play'}
		>
			{#if playing}
				<svg viewBox="0 0 10 10" width="10" height="10"
					><path d="M1.5 0h2.5v10h-2.5zM6 0h2.5v10h-2.5z" /></svg
				>
			{:else if ended}
				<svg viewBox="0 0 12 12" width="12" height="12"
					><path d="M6 1.5a4.5 4.5 0 1 1-4.3 3.2l1.4.5A3 3 0 1 0 6 3v1.8L3 2.25 6 -0.3z" /></svg
				>
			{:else}
				<svg viewBox="0 0 10 10" width="10" height="10"><path d="M2 0l8 5-8 5z" /></svg>
			{/if}
		</button>

		<div
			class="track"
			role="slider"
			tabindex="0"
			aria-label="Seek"
			aria-valuemin={0}
			aria-valuemax={Math.round(duration)}
			aria-valuenow={Math.round(t)}
			aria-valuetext="{clock(t)} of {clock(duration)}"
			onpointerdown={scrub}
			onkeydown={railKey}
		>
			<div class="rail">
				<div class="run" style="width:{(t / duration) * 100}%"></div>
				{#each rec?.markers ?? cast.markers as [mt, beat], i (beat)}
					<!-- A pointer shortcut: the keyboard has the chapter buttons above. -->
					<span
						role="presentation"
						aria-hidden="true"
						class="tick"
						class:past={mt <= t}
						style="left:{(mt / duration) * 100}%"
						data-label={beatName[beat] ?? beat}
						onpointerdown={(e) => {
							// Exactly the chapter, not wherever near it the pointer landed.
							e.stopPropagation();
							jump(i);
						}}
					></span>
				{/each}
			</div>
		</div>

		<output class="clock">{clock(t)} <i>/ {clock(duration)}</i></output>

		<button
			type="button"
			class="rate"
			onclick={() => (rate = rate === 1 ? 2 : 1)}
			aria-label="Playback speed">{rate}×</button
		>
	</div>
</div>

<style>
	.recording {
		display: grid;
	}
	.stage {
		position: relative;
		overflow: hidden;
		padding: calc(var(--term-pad-y) * 1.6) calc(var(--term-pad-x) * 1.4);
		background: var(--term-bg);
	}
	.term {
		transform-origin: 0 0;
	}
	/* xterm paints its own background; keep it the window's, edge to edge. */
	.term :global(.xterm),
	.term :global(.xterm-viewport) {
		background: transparent !important;
	}
	.term :global(.xterm-viewport) {
		overflow: hidden !important;
	}

	.pointer {
		position: absolute;
		z-index: 2;
		pointer-events: none;
		transition: opacity 200ms;
	}
	.pointer svg {
		display: block;
		fill: var(--term-fg);
		stroke: var(--term-bg);
		stroke-width: 1.2;
		stroke-linejoin: round;
		filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.5));
		transform-origin: 1px 1px;
		transition: transform 90ms;
	}
	.pointer.pressed svg {
		transform: scale(0.86);
	}
	.ring {
		position: absolute;
		left: 1px;
		top: 1px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 2px solid var(--term-cursor);
		opacity: calc(1 - var(--k));
		transform: translate(-50%, -50%) scale(calc(0.25 + var(--k) * 0.9));
	}

	.badges {
		position: absolute;
		right: var(--space-3);
		bottom: var(--space-3);
		z-index: 2;
		display: flex;
		gap: var(--space-2);
		pointer-events: none;
	}
	.badge {
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-s);
		background: color-mix(in oklab, var(--term-bg) 70%, black);
		box-shadow: 0 0 0 1px color-mix(in oklab, var(--term-fg) 12%, transparent);
		color: var(--term-fg);
		font: 500 0.75rem / 1.2 var(--mono);
	}
	.lapse {
		color: var(--term-cursor);
	}
	.failed {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		color: var(--ansi-8);
		font-size: var(--size-s);
	}

	/* The transport sits on the window's bar colour: part of the window,
	   not a second box under it. */
	.transport {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		background: var(--term-bar);
		color: color-mix(in oklab, var(--term-fg) 55%, transparent);
	}
	.play {
		display: grid;
		flex: none;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: var(--term-fg);
		color: var(--term-bg);
		transition: transform var(--quick) ease-out;
	}
	.play:hover {
		transform: scale(1.06);
	}
	.play:active {
		transform: scale(0.96);
	}
	.play svg {
		fill: currentColor;
	}
	/* Engine's rail: one pixel to look at, twenty to hit, thicker under the
	   pointer rather than moving. */
	.track {
		flex: 1;
		padding-block: 0.625rem;
		cursor: pointer;
		touch-action: none;
	}
	.track:focus-visible {
		outline-offset: 0;
	}
	.rail {
		position: relative;
		height: 2px;
		border-radius: 1px;
		background: color-mix(in oklab, var(--term-fg) 16%, transparent);
		transition: height var(--quick) ease-out;
	}
	.track:hover .rail,
	.track:focus-visible .rail {
		height: 4px;
	}
	.run {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: inherit;
		background: var(--term-fg);
	}
	.tick {
		position: absolute;
		top: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: color-mix(in oklab, var(--term-fg) 40%, var(--term-bg));
		box-shadow: 0 0 0 2px var(--term-bar);
		transform: translate(-50%, -50%);
		cursor: pointer;
		transition: transform var(--quick) ease-out;
	}
	/* A dot is the right size to see and the wrong size to hit. */
	.tick::before {
		content: '';
		position: absolute;
		inset: -8px;
	}
	/* Its chapter, named above it while pointed at. */
	.tick::after {
		content: attr(data-label);
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		padding: 0.1875rem 0.4375rem;
		border-radius: 4px;
		background: color-mix(in oklab, var(--term-bg) 70%, black);
		box-shadow: 0 0 0 1px color-mix(in oklab, var(--term-fg) 12%, transparent);
		color: var(--term-fg);
		font: 0.6875rem / 1.3 var(--text);
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, 2px);
		transition:
			opacity var(--quick),
			transform var(--quick);
	}
	.tick:hover {
		transform: translate(-50%, -50%) scale(1.5);
	}
	.tick:hover::after {
		opacity: 1;
		transform: translate(-50%, 0) scale(0.667);
		transform-origin: bottom center;
	}
	.tick.past {
		background: var(--term-fg);
	}
	.clock {
		flex: none;
		font: 0.75rem var(--mono);
		font-variant-numeric: tabular-nums;
	}
	.clock i {
		font-style: normal;
		opacity: 0.6;
	}
	.rate {
		flex: none;
		min-width: 2rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font: 0.75rem var(--mono);
		transition: color var(--quick);
	}
	.rate:hover {
		color: var(--term-fg);
	}
	@media (max-width: 30rem) {
		.clock i,
		.rate {
			display: none;
		}
	}
</style>
