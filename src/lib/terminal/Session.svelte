<!--
	A live session, set in the Ghostty config on the desk: its face, size,
	padding and sixteen colours, fish with the starship prompt collapsing to a
	bare ❯ once a command has run. It types the first command itself; after
	that ↵ runs the next, or you type your own.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Step } from '$lib/data/projects';
	import { ADVANCE } from './theme';
	import { bare, complete, css, run, runs, tallest, widest, type Line } from './session';

	type Props = { tool: string; steps: Step[]; autoplay?: boolean; focus?: boolean };
	let { tool, steps, autoplay = true, focus = false }: Props = $props();

	let lines = $state<Line[]>([]);
	let input = $state('');
	let caret = $state(0);
	let next = $state(0);
	let typing = $state(false);
	let focused = $state(false);
	let history: string[] = [];
	let back = 0;

	let field: HTMLInputElement;
	let scroller: HTMLDivElement;

	const cols = $derived(widest(steps));
	const rows = $derived(tallest(steps));
	const done = $derived(next >= steps.length);

	let token = 0;
	const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

	async function scrollDown() {
		await tick();
		scroller?.scrollTo({ top: scroller.scrollHeight });
	}

	function execute(text: string) {
		const result = run(text, steps, tool);
		const i = steps.findIndex((s) => bare(s.cmd) === bare(text));
		if (i >= 0 && i >= next) next = i + 1;
		if (text.trim()) history.push(text);
		back = history.length;
		if (result.clear) {
			lines = [];
		} else {
			lines = [...lines, { kind: 'cmd', text }, ...result.lines];
		}
		input = '';
		caret = 0;
		scrollDown();
	}

	// Types a step at a person's pace: quick, a little uneven, a beat before ↵.
	async function play(step: Step) {
		const mine = ++token;
		typing = true;
		input = '';
		for (const ch of step.cmd) {
			if (mine !== token) return;
			input += ch;
			caret = input.length;
			await wait(ch === ' ' ? 55 : 18 + Math.random() * 30);
		}
		await wait(320);
		if (mine !== token) return;
		typing = false;
		execute(step.cmd);
	}

	function interrupt() {
		if (!typing) return;
		token++;
		typing = false;
		input = '';
		caret = 0;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (typing) return;
			if (input.trim()) execute(input);
			else if (!done) play(steps[next]);
			else execute('');
			return;
		}
		if (typing) interrupt();
		if (e.key === 'Tab') {
			e.preventDefault();
			const hit = complete(input, steps);
			if (hit) setInput(hit);
		} else if (e.key === 'ArrowUp' && history.length) {
			e.preventDefault();
			back = Math.max(0, back - 1);
			setInput(history[back]);
		} else if (e.key === 'ArrowDown' && history.length) {
			e.preventDefault();
			back = Math.min(history.length, back + 1);
			setInput(history[back] ?? '');
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			lines = [];
		} else if (e.key === 'c' && e.ctrlKey) {
			e.preventDefault();
			lines = [...lines, { kind: 'cmd', text: input + '^C' }];
			input = '';
			scrollDown();
		}
		// After the browser has moved the selection, not before.
		setTimeout(syncCaret);
	}

	function syncCaret() {
		caret = field?.selectionStart ?? input.length;
	}

	// Replaces the line and puts the caret at its end, in the field and on screen.
	function setInput(text: string) {
		input = text;
		caret = text.length;
		tick().then(() => field?.setSelectionRange(text.length, text.length));
	}

	onMount(() => {
		if (focus) field.focus({ preventScroll: true });
		if (autoplay && steps.length)
			wait(450).then(() => {
				if (!lines.length) play(steps[0]);
			});
		return () => token++;
	});

	const before = $derived(input.slice(0, caret));
	const under = $derived(input.slice(caret, caret + 1) || ' ');
	const after = $derived(input.slice(caret + 1));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="session"
	style="--cols:{cols};--rows:{rows};--advance:{ADVANCE}"
	onclick={() => field?.focus()}
>
	<div class="screen" bind:this={scroller}>
		{#each lines as line, i (i)}
			{#if line.kind === 'cmd'}
				<pre class="line"><span class="ok">❯</span> {#each runs(line.text, true) as r, j (j)}<span
							class={r.tone}>{r.text}</span
						>{/each}</pre>
			{:else if line.kind === 'note'}
				<p class="line note">{line.text}</p>
			{:else}
				<pre class="line">{#each runs(line.text) as r, j (j)}<span class={r.tone} style={css(r)}
							>{r.text}</span
						>{/each}</pre>
			{/if}
		{/each}

		<div class="prompt" class:gap={lines.length > 0}>
			<pre class="line"><span class="dir">~/Code/{tool}</span> on <span class="branch">main</span
				></pre>
			<pre class="line"><span class="ok">❯</span> {before}<span
					class="cursor"
					class:blink={focused && !typing}
					class:hollow={!focused && !typing}>{under}</span
				>{after}</pre>
		</div>
	</div>

	<input
		bind:this={field}
		bind:value={input}
		{onkeydown}
		oninput={syncCaret}
		onclick={syncCaret}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
		aria-label="Type a command for {tool}"
		autocomplete="off"
		autocapitalize="off"
		spellcheck="false"
	/>
</div>

<style>
	.session {
		position: relative;
		container-type: inline-size;
		max-height: 72vh;
		cursor: text;
		color: var(--term-fg);
	}
	.screen {
		/* As tall as the session will be, in lines of its own type (lh), so
		   a few short commands get a short window, not an empty screen. */
		height: calc(var(--rows) * 1lh + var(--term-pad-y) * 3.2);
		max-height: 72vh;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in oklab, var(--term-fg) 18%, transparent) transparent;
		padding: calc(var(--term-pad-y) * 1.6) calc(var(--term-pad-x) * 1.4);
		/* The configured size, unless the widest line would not fit: then as
		   small as it takes, the way a window is sized to what runs in it. */
		font-family: var(--term-font);
		font-size: min(
			var(--term-size),
			(100cqi - var(--term-pad-x) * 2.8) / (var(--cols) * var(--advance))
		);
		font-weight: var(--term-weight);
		font-variant-ligatures: none;
		line-height: var(--term-line);
		-webkit-font-smoothing: antialiased;
	}
	.screen ::selection {
		background: var(--term-selection);
		color: var(--term-selection-text);
	}
	.line {
		margin: 0;
		font: inherit;
		white-space: pre;
	}
	.note {
		color: var(--ansi-8);
		white-space: pre-wrap;
	}
	/* Ghostty draws box glyphs itself, to the full height of the cell. A
	   browser draws the font's, which stop short of a cell made 12% taller,
	   so they are stretched back to meet. */
	.frame {
		display: inline-block;
		color: var(--ansi-8);
		scale: 1 calc(var(--term-line) / 1.2);
	}
	.comment {
		color: var(--ansi-8);
	}
	.ok {
		color: var(--ansi-2);
	}
	.dir {
		color: var(--ansi-6);
		font-weight: 700;
	}
	.branch {
		color: var(--ansi-5);
		font-weight: 700;
	}
	.prompt.gap {
		margin-top: calc(1em * var(--term-line));
	}
	.cursor {
		background: var(--term-cursor);
		color: var(--term-cursor-text);
	}
	.cursor.hollow {
		background: none;
		color: inherit;
		box-shadow: inset 0 0 0 1px var(--term-cursor);
	}
	.cursor.blink {
		animation: blink 1.06s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			background: none;
			color: inherit;
		}
	}
	/* The real input, where the keyboard goes; the screen draws what it holds. */
	input {
		position: absolute;
		inset: auto 0 0 auto;
		width: 1px;
		height: 1px;
		opacity: 0;
		border: 0;
		padding: 0;
		pointer-events: none;
	}
</style>
