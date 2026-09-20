// Screen stories: how each project is fetched, built, set up and photographed.
// See screens/README.md for the four beats (hero, start, use, depth) and how
// a story runs. Projects without a story here keep whatever they had.
//
// Terminal step kinds:
//   { run: 'cmd' }          type a command and press enter
//   { hidden: 'cmd' }       the same, off camera
//   { type: 'text' }        type without pressing enter
//   { key: 'Down', times }  press a key: Enter, Up, Down, Left, Right, Tab,
//                           Escape, Space, Backspace, Ctrl+C, or any single key
//   { wait: 'regex' }       wait until the screen shows it (timeout: '20s')
//   { sleep: '2s' }
//   { shot: beat, caption } take the screenshot for a beat
// Mouse steps, for mouse-first programs (they go through xterm.js, so the
// program gets real mouse reports only if it asked for them):
//   { click: 'text' | { row, col }, button: 'left' | 'right' | 'middle' }
//   { hover: target }   { scroll: lines, at: target }   { drag: target, to: target }
// A target is text on screen (the first cell showing it) or a 0-based cell.
//
// A story may set `ref: 'feat/x'` to build a branch instead of the default.
//
// Recording: `record: true` also writes static/media/casts/<name>.cast (asciicast
// v2) with a chapter marker per shot. `{ speed: 8 }` time-lapses what follows
// until `{ speed: 1 }`; the player says so while it lasts.
// A story may set `terminal: { height }` (or width) for a taller or wider
// terminal than the default 1600×1000: a command-line tool that prints forty
// lines is read in a forty-line terminal, not scrolled past in a 29-line one.
// A story may set `user: 'name'` to run as that user, in their home, with the
// environment it gives in `env` (PATH and the rest) and nothing of root's.
// A terminal story may set `isolate: true` to run its shell in its own process
// namespace, with `background` (a shell script) started inside it first.
// Web step kinds: { wait: ms }, { waitFor: selector }, { click: selector,
// optional }, { press: key, times }, { hold: key, ms }, { scroll: px },
// { goto: relative-path }, { shot: beat, caption }.

// Every terminal shot: 1600×1000 px, JetBrains Mono 20, ~125×38 cells.
export const TERMINAL = { width: 1600, height: 1000, fontSize: 20, padding: 32 };

const cargo = 'cargo build --release --locked 2>/dev/null || cargo build --release';
const cargoAll =
	'cargo build --release --workspace --bins --locked 2>/dev/null || cargo build --release --workspace --bins';

// A small cairn backlog, shared by cairn and harrow.
const cairnBacklog = `
git init -q && git commit -q --allow-empty -m init
cairn init
cairn new "Support OAuth login" --type feature --set priority=p0 --label auth
cairn new "Rate-limit the public API" --type feature --set priority=p1
cairn new "Crash when the config has a BOM" --type bug --set priority=p0
cairn new "Export the roadmap as JSON" --type feature --set priority=p2
cairn new "Document the schema format" --type feature --set priority=p2
cairn new "Sessions expire an hour early" --type bug --set priority=p0 --label auth
cairn new "Retry the webhook, with a ceiling" --type feature --set priority=p1
cairn new "Drop the old migration path" --type chore --set priority=p3
cairn new "Write the upgrade note" --type docs --set priority=p2
# A board with one item in it is not a board: spread them across the columns
# the way a real week leaves them. cairn init seeds 0001-0004, so the items
# written above start at 0005.
cairn set 5 status=doing
cairn set 7 status=doing
cairn set 10 status=blocked
cairn set 6 status=planned
cairn set 11 status=planned
cairn set 12 status=done
cairn set 13 status=done
git add -A && git commit -qm "backlog"
`;

export const stories = {
	// ── terminal apps ──────────────────────────────────────────────────────

	caligula: {
		build: cargo,
		// A machine's worth of checkouts: repos with linked worktrees, some dirty,
		// some with work that exists nowhere else.
		fixture: `
mkdir -p ~/Code && cd ~/Code
for repo in orchard typeset ledger; do
  mkdir $repo && cd $repo && git init -q
  echo "# $repo" > README.md && git add -A && git commit -qm "start $repo"
  for b in feat/search fix/login refactor/layout; do
    git worktree add -q ../.worktrees/$repo/\${b//\\//-} -b $b
    (cd ../.worktrees/$repo/\${b//\\//-} && echo wip >> notes.md && git add -A && git commit -qm "wip on $b")
  done
  echo "unsaved" > ../.worktrees/$repo/fix-login/scratch.txt
  cd ..
done`,
		record: true,
		steps: [
			{ run: 'caligula --root ~/Code' },
			{ wait: 'worktrees' },
			{ sleep: '1.5s' },
			{
				shot: 'hero',
				caption:
					'Every worktree on the machine, grouped by repository, with what each one would lose.'
			},
			// Getting started is learning the keys, as it is for the other TUIs.
			{ type: '?' },
			{ sleep: '800ms' },
			{
				shot: 'start',
				caption: 'Every action is one key, and the help says which.'
			},
			{ key: 'Escape' },
			{ sleep: '500ms' },
			{ key: 'Down', times: 2 },
			{ sleep: '600ms' },
			{
				shot: 'use',
				caption:
					'Selecting a worktree shows its branch, its head, and the work that exists nowhere else.'
			},
			// What it is for: clearing several at once, without losing the one
			// that still has something in it.
			{ key: 'Space' },
			{ key: 'Down' },
			{ key: 'Space' },
			{ key: 'Down' },
			{ key: 'Space' },
			{ sleep: '800ms' },
			{
				shot: 'depth',
				caption:
					'Marked, several at a time — and the bar counts the commits that exist nowhere else before anything is removed.'
			}
		]
	},

	poptop: {
		build: cargo,
		// Its own process namespace, with a believable machine for the monitor to
		// watch: an API under steady load, a worker leaking memory, a release
		// build every ten seconds, a database-ish fsync, an idle file server.
		// All real programs doing real work, so every figure poptop shows is one
		// it measured.
		isolate: true,
		background: `
# The namespace's mounts are private: keep the binary, then drop the rig's
# volumes from view.
cp "$(command -v poptop)" /usr/local/bin/poptop
umount -l /work/site /cache 2>/dev/null

mkdir -p /srv/api /srv/jobs /srv/www /root/src/shop/src
cat > /srv/api/server.js <<'JS'
const http = require('http');
let served = 0;
http.createServer((req, res) => {
  let x = 0;
  for (let i = 0; i < 300000; i++) x += Math.sqrt(i) * Math.sin(i);
  served++;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ served, x }));
}).listen(3000);
JS
cat > /srv/api/loadgen.js <<'JS'
const http = require('http');
function hit() {
  http.get('http://127.0.0.1:3000/orders', (r) => { r.resume(); r.on('end', () => setTimeout(hit, 20 + Math.random() * 60)); })
    .on('error', () => setTimeout(hit, 500));
}
for (let i = 0; i < 4; i++) hit();
JS
cat > /srv/jobs/worker.js <<'JS'
// A job queue that forgets to let go of finished jobs.
const done = [];
setInterval(() => {
  for (let i = 0; i < 2000; i++) done.push({ id: done.length, result: 'x'.repeat(512) });
  if (done.length > 650000) done.length = 0;
}, 250);
JS

# A crate with enough in it that a release build takes a few seconds.
cd /root/src/shop
printf '[package]\nname = "shop"\nversion = "0.1.0"\nedition = "2021"\n' > Cargo.toml
{
  echo 'use std::hint::black_box;'
  for i in $(seq 1 900); do
    echo "fn f$i(x: u64) -> u64 { (0..x).map(|v| v.wrapping_mul($i) ^ (v >> 3)).filter(|v| v % 7 != 0).sum() }"
  done
  echo 'fn main() { let mut s = 0u64;'
  for i in $(seq 1 900); do echo "  s = s.wrapping_add(f$i(black_box($i)));"; done
  echo '  println!("{s}"); }'
} > src/main.rs

# Each started as a simple command, never 'cd x && prog &': that forks a
# subshell to wait on it, and the subshell's command line is this script.
cd /srv/api
nohup node /srv/api/server.js </dev/null >/dev/null 2>&1 &
sleep 0.3
nohup node /srv/api/loadgen.js </dev/null >/dev/null 2>&1 &
cd /srv/jobs
nohup node /srv/jobs/worker.js </dev/null >/dev/null 2>&1 &
cd /srv/www
nohup python3 -m http.server 8080 </dev/null >/dev/null 2>&1 &
cd /root/src/shop
nohup bash -c 'while :; do touch src/main.rs; CARGO_TARGET_DIR=/tmp/shop-target cargo build --release --offline -q; sleep 4; done' </dev/null >/dev/null 2>&1 &
cd /tmp
nohup bash -c 'while :; do dd if=/dev/urandom of=/tmp/wal bs=1M count=48 conv=fsync 2>/dev/null; sleep 5; done' </dev/null >/dev/null 2>&1 &
cd /`,
		// The newest interface: the menu bar and the tab strip.
		record: true,
		// Slow enough to follow: a person at a keyboard, not a script.
		pace: { type: 110, key: 260 },
		steps: [
			{ run: 'poptop' },
			{ sleep: '2s' },
			// Forty seconds of history to scrub through, played back as a time-lapse.
			{ speed: 8 },
			{ sleep: '34s' },
			{ speed: 1 },
			{ sleep: '1.5s' },
			{
				shot: 'hero',
				caption:
					'Everything the machine is doing, and every sample of it kept: the timeline above, the process table below.'
			},

			// Getting started is the keys, as it is for the other TUIs here.
			{ type: '?' },
			{ sleep: '1.4s' },
			{
				shot: 'start',
				caption: 'Every key it answers to: scrub, jump, zoom, sort, filter, signal, tree, io.'
			},
			{ key: 'Escape' },
			{ sleep: '900ms' },

			// Filtering: just the node processes, and the leaking worker selected.
			{ type: '/' },
			{ sleep: '600ms' },
			{ type: 'node' },
			{ sleep: '900ms' },
			{ key: 'Enter' },
			{ sleep: '1.5s' },
			{ key: 'Down' },
			{ sleep: '1.2s' },
			{
				shot: 'use',
				caption:
					'Filtered to the node processes: the API server under load, the generator hitting it, and the worker whose memory keeps climbing.'
			},
			{ key: 'Escape' },
			{ sleep: '900ms' },

			// As a tree: who started whom.
			{ type: 't' },
			{ sleep: '2.5s' },
			{ type: 't' },
			{ sleep: '900ms' },

			// Sorting: by the next column, and back.
			{ type: 's' },
			{ sleep: '1.6s' },
			{ type: 's' },
			{ sleep: '1.6s' },

			// Rewind: click the graph to jump back to that moment, wheel over it,
			// then step back sample by sample. (On the graph itself: the past/now
			// row under it is a label, not time.)
			{ click: { row: 7, col: 100 } },
			{ sleep: '1.5s' },
			{ scroll: -3, at: { row: 7, col: 100 } },
			{ sleep: '1.2s' },
			{ key: 'Left', times: 8 },
			{ sleep: '1.8s' },
			{
				shot: 'depth',
				caption:
					'Rewound: click the graph, wheel back, step sample by sample. The process table is as it was then.'
			},
			{ sleep: '1s' },
			{ key: 'End' },
			{ sleep: '1.5s' },
			{ type: 'q' },
			{ sleep: '800ms' }
		]
	},

	quarry: {
		build: cargo,
		// The newest line: every feature branch stacks under this one.
		record: true,
		pace: { type: 110, key: 260 },
		// A developer's machine: five repositories, each running what it runs,
		// all of it real. A Vite dev server, a second copy of the app in a linked
		// worktree, Redis and a docs server for the ledger, nginx in front of the
		// app, a service that answers every request with a 500, and one server
		// started from /tmp, belonging to no project at all.
		//
		// Never press `a` in this story: showing system services shows the rig
		// (ttyd's socket, Chromium's). And no bare JSON API: quarry files a Node
		// server answering JSON on :3000 as `system`, hidden (a quarry issue to raise).
		fixture: `
mkdir -p ~/Code && cd ~/Code
repo() { mkdir -p "$1" && (cd "$1" && git init -q && git commit -q --allow-empty -m "start $1"); }

# orchard: the web app, on Vite.
repo orchard
cd orchard
npm init -y >/dev/null
npm install --silent --no-audit --no-fund vite@5 >/dev/null 2>&1
printf '<!doctype html><title>orchard</title><h1>orchard</h1>\\n' > index.html
git add -A >/dev/null && git commit -qm "app"
git worktree add -q ../orchard-billing -b feat/billing
ln -s ~/Code/orchard/node_modules ~/Code/orchard-billing/node_modules
setsid nohup npx vite --port 5173 --strictPort --host 127.0.0.1 </dev/null >/dev/null 2>&1 &
cd ~/Code/orchard-billing
setsid nohup npx vite --port 5174 --strictPort --host 127.0.0.1 </dev/null >/dev/null 2>&1 &

# ledger: the books. Redis for its cache, its docs served locally.
cd ~/Code && repo ledger && cd ledger && mkdir -p docs && printf '<h1>ledger docs</h1>\\n' > docs/index.html
setsid nohup redis-server --port 6379 --bind 127.0.0.1 --save '' </dev/null >/dev/null 2>&1 &
cd docs
setsid nohup python3 -m http.server 8020 --bind 127.0.0.1 </dev/null >/dev/null 2>&1 &

# gateway: nginx in front of the app.
cd ~/Code && repo gateway && cd gateway && mkdir -p logs
cat > nginx.conf <<'CONF'
worker_processes 1;
pid logs/nginx.pid;
error_log logs/error.log;
events { worker_connections 64; }
http {
  access_log off;
  server { listen 127.0.0.1:8080; location / { proxy_pass http://127.0.0.1:5173; } }
}
CONF
setsid nohup nginx -p ~/Code/gateway -c nginx.conf -g 'daemon off;' </dev/null >/dev/null 2>&1 &

# typeset: a service that is up and wrong. Every request, a 500.
cd ~/Code && repo typeset && cd typeset
cat > server.js <<'JS'
require('http').createServer((req, res) => { res.statusCode = 500; res.end('render failed'); }).listen(4321, '127.0.0.1');
JS
setsid nohup node server.js </dev/null >/dev/null 2>&1 &

# Started from /tmp, in no repository.
cd /tmp
setsid nohup python3 -m http.server 9000 --bind 127.0.0.1 </dev/null >/dev/null 2>&1 &
sleep 3`,
		steps: [
			{ run: 'quarry' },
			{ wait: 'listening' },
			{ sleep: '3s' },
			{
				shot: 'hero',
				caption:
					'Every server on this machine, grouped by the repository it was started in, each one probed for health.'
			},

			// Around the list.
			{ key: 'Down', times: 3 },
			{ sleep: '1.4s' },
			{ key: 'Down', times: 2 },
			{ sleep: '1.4s' },

			// The help is generated from the bindings in effect.
			{ type: '?' },
			{ sleep: '2.8s' },
			{
				shot: 'start',
				caption: 'Every key, from the bindings in effect: the help is generated from your config.'
			},
			{ key: 'Escape' },
			{ sleep: '1s' },

			// Trouble first.
			{ type: 'n' },
			{ sleep: '2.4s' },
			{
				shot: 'use',
				caption:
					'`n` jumps to the next service that is not answering, and its detail says what it answered instead.'
			},

			// Filtering: by project.
			{ type: '/' },
			{ sleep: '500ms' },
			{ type: '~orchard' },
			{ sleep: '1.6s' },
			{ key: 'Enter' },
			{ sleep: '1.6s' },
			{ key: 'Escape' },
			{ sleep: '1s' },

			// Grouped by kind, then by nothing, then back to projects.
			{ type: 'b' },
			{ sleep: '2.2s' },
			{ type: 'b' },
			{ sleep: '1.2s' },
			{ type: 'b' },
			{ sleep: '1.2s' },

			// The mouse: click a row, wheel down the list.
			{ click: 'nginx' },
			{ sleep: '1.6s' },
			{ scroll: 3, at: 'nginx' },
			{ sleep: '1.4s' },

			// Stop the stray server in /tmp, from the list.
			{ click: '9000' },
			{ sleep: '1.2s' },
			// K asks first: which process, which signal. y sends it.
			{ type: 'K' },
			{ sleep: '2.2s' },
			{ type: 'y' },
			{ sleep: '3s' },

			// Out, and time for quarry to hand the terminal back before typing:
			// a key sent while it restores the screen is swallowed.
			{ type: 'q' },
			{ sleep: '2s' },
			{ run: 'quarry why 5173' },
			{ sleep: '2.5s' },
			{
				shot: 'depth',
				caption:
					'`quarry why` shows the evidence: what matched, what it scored, and what it lost to.'
			}
		]
	},

	hackney: {
		build: cargo,
		record: true,
		pace: { type: 110, key: 260 },
		// It reads the live public API, so every recording is that day's front
		// page. Nothing is seeded, and nothing can be: that is the point of it.
		// Mouse steps aim at cells, never at a headline that will have scrolled
		// away by the next run.
		steps: [
			{ run: 'hackney' },
			// Its own header, not a word from the stories: those change hourly.
			{ wait: 'Top stories' },
			{ sleep: '3.5s' },
			{
				shot: 'hero',
				caption:
					'The front page on the left, the thread you are on filling the right: moving down the list swaps the comments in.'
			},

			// Down the list; the comments follow the cursor.
			{ key: 'Down', times: 3 },
			{ sleep: '2.5s' },
			{ key: 'Down', times: 2 },
			{ sleep: '2.5s' },

			// Every key, in the app.
			{ type: '?' },
			{ sleep: '2.8s' },
			{
				shot: 'start',
				caption: 'Every key, in the app: the list, the thread, the feeds, and search.'
			},
			{ key: 'Escape' },
			{ sleep: '1.2s' },

			// Reading the thread: down it, then from thread to thread, then fold.
			{ type: 'J' },
			{ sleep: '900ms' },
			{ type: 'J' },
			{ sleep: '900ms' },
			{ type: 'n' },
			{ sleep: '1.6s' },
			{ type: 'x' },
			{ sleep: '1.8s' },

			// The mouse: a story in the list, and the wheel over it.
			{ click: { row: 8, col: 30 } },
			{ sleep: '2.5s' },
			{ scroll: 3, at: { row: 12, col: 30 } },
			{ sleep: '1.6s' },

			// The feeds, by number.
			{ type: '4' },
			{ wait: 'Ask' },
			{ sleep: '2.5s' },
			{
				shot: 'use',
				caption: 'Seven feeds on the number keys: Top, New, Best, Ask, Show, Jobs, and search.'
			},

			// Search all of Hacker News.
			{ type: '/' },
			{ sleep: '600ms' },
			{ type: 'ratatui' },
			{ sleep: '900ms' },
			{ key: 'Enter' },
			{ sleep: '4s' },

			// The thread, given the whole screen.
			{ type: 'z' },
			{ sleep: '3s' },
			{
				shot: 'depth',
				caption:
					'`z` gives the comments the whole width: replies hang from guide rails, the poster is marked, code and quotes drawn as written.'
			},
			{ type: 'z' },
			{ sleep: '1.2s' },
			{ type: 'q' },
			{ sleep: '1.2s' }
		]
	},

	rsst: {
		build: cargo,
		// Live feeds would date the recording the way hackney's is dated, and
		// would need the network from inside the container. Three feeds are
		// written as files and served over the loopback instead, so the story
		// reads the same entries every time it runs.
		fixture: `
mkdir -p ~/feeds ~/.rsst
stamp() { date -u -d "$1 hours ago" +%Y-%m-%dT%H:%M:%SZ; }

cat > ~/feeds/rust.xml <<XML
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Rust Blog</title>
  <link href="http://127.0.0.1:8099/rust.xml" rel="self"/>
  <updated>$(stamp 2)</updated>
  <entry>
    <title>Announcing Rust 1.94.0</title>
    <link href="https://example.invalid/rust-1-94"/>
    <id>tag:example.invalid,2026:rust-1-94</id>
    <updated>$(stamp 2)</updated>
    <content type="html">&lt;p&gt;The Rust team is happy to announce a new version of Rust, 1.94.0. Rust is a programming language empowering everyone to build reliable and efficient software.&lt;/p&gt;&lt;p&gt;This release stabilises &lt;code&gt;let&lt;/code&gt; chains in the 2024 edition, lands the new trait solver behind a flag, and cuts incremental rebuild times for large workspaces by around a fifth.&lt;/p&gt;&lt;h2&gt;What is in 1.94.0 stable&lt;/h2&gt;&lt;p&gt;Two changes are worth reading the release notes for in full. The first is the borrow checker accepting a pattern that has been rejected since 1.0.&lt;/p&gt;</content>
  </entry>
  <entry>
    <title>Const generics: where we are</title>
    <link href="https://example.invalid/const-generics"/>
    <id>tag:example.invalid,2026:const-generics</id>
    <updated>$(stamp 27)</updated>
    <content type="html">&lt;p&gt;Const generics have been stable in their simplest form for some years. This post is about the part that is not stable yet, why it is hard, and what it would take to finish.&lt;/p&gt;</content>
  </entry>
  <entry>
    <title>A new trait solver</title>
    <link href="https://example.invalid/trait-solver"/>
    <id>tag:example.invalid,2026:trait-solver</id>
    <updated>$(stamp 74)</updated>
    <content type="html">&lt;p&gt;Coherence, overlap, and why the old solver could not be fixed in place.&lt;/p&gt;</content>
  </entry>
  <entry>
    <title>Async closures, stabilised</title>
    <link href="https://example.invalid/async-closures"/>
    <id>tag:example.invalid,2026:async-closures</id>
    <updated>$(stamp 120)</updated>
    <content type="html">&lt;p&gt;What they are, what they are not, and the three signatures you will actually write.&lt;/p&gt;</content>
  </entry>
</feed>
XML

cat > ~/feeds/tools.xml <<XML
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <title>This Week in Terminals</title>
  <link>http://127.0.0.1:8099/tools.xml</link>
  <description>Terminal tooling, weekly.</description>
  <item>
    <title>Ghostty 1.3 and the case for a fast terminal</title>
    <link>https://example.invalid/ghostty-1-3</link>
    <guid>https://example.invalid/ghostty-1-3</guid>
    <pubDate>$(date -u -d "5 hours ago" +"%a, %d %b %Y %H:%M:%S GMT")</pubDate>
    <description>Frame pacing, the shaper cache, and why input latency is the number that matters.</description>
  </item>
  <item>
    <title>ratatui 0.30: the widget rewrite</title>
    <link>https://example.invalid/ratatui-030</link>
    <guid>https://example.invalid/ratatui-030</guid>
    <pubDate>$(date -u -d "31 hours ago" +"%a, %d %b %Y %H:%M:%S GMT")</pubDate>
    <description>StatefulWidget goes away, and what replaces it.</description>
  </item>
  <item>
    <title>Reading a terminal's colours without asking it twice</title>
    <link>https://example.invalid/osc-4</link>
    <guid>https://example.invalid/osc-4</guid>
    <pubDate>$(date -u -d "53 hours ago" +"%a, %d %b %Y %H:%M:%S GMT")</pubDate>
    <description>OSC 4, OSC 11, and the timeout you need when nothing answers.</description>
  </item>
</channel></rss>
XML

cat > ~/feeds/writing.xml <<XML
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Notes on writing software</title>
  <link href="http://127.0.0.1:8099/writing.xml" rel="self"/>
  <updated>$(stamp 9)</updated>
  <entry>
    <title>The cost of a demo that lies</title>
    <link href="https://example.invalid/honest-demos"/>
    <id>tag:example.invalid,2026:honest-demos</id>
    <updated>$(stamp 9)</updated>
    <content type="html">&lt;p&gt;A screenshot with invented output is a promise you have not kept yet. Record the real thing or show nothing.&lt;/p&gt;</content>
  </entry>
  <entry>
    <title>Fixtures are the product</title>
    <link href="https://example.invalid/fixtures"/>
    <id>tag:example.invalid,2026:fixtures</id>
    <updated>$(stamp 40)</updated>
    <content type="html">&lt;p&gt;Most of the work in photographing a tool is building a believable machine for it to run on.&lt;/p&gt;</content>
  </entry>
</feed>
XML

# setsid, not just &: the fixture shell waits on its own children, so a
# plain background job holds the whole run open. A new session detaches it.
cd ~/feeds
setsid python3 -m http.server 8099 --bind 127.0.0.1 </dev/null >/dev/null 2>&1 &
disown
sleep 1
# Prove it is answering before the story depends on it.
curl -sf http://127.0.0.1:8099/rust.xml >/dev/null || echo "feed server did not come up"
cd ~

cat > ~/.rsst/config.toml <<'TOML'
[[feeds]]
url = "http://127.0.0.1:8099/rust.xml"
title = "Rust Blog"
tags = ["Rust"]

[[feeds]]
url = "http://127.0.0.1:8099/tools.xml"
title = "This Week in Terminals"
tags = ["Terminals"]

[[feeds]]
url = "http://127.0.0.1:8099/writing.xml"
title = "Notes on writing software"
tags = ["Writing"]
TOML
`,
		record: true,
		steps: [
			{ hidden: 'set -gx RSST_HOME ~/.rsst' },
			{ run: 'rsst' },
			{ wait: 'Rust' },
			{ sleep: '2s' },
			{
				shot: 'hero',
				caption: 'Feeds, their entries, and the selected entry rendered as a document.'
			},
			{ type: '?' },
			{ sleep: '900ms' },
			{
				shot: 'start',
				caption: 'Every key, in the app: move, cycle the panes, jump to the next unread, search.'
			},
			{ key: 'Escape' },
			{ sleep: '400ms' },
			{ key: 'Tab' },
			{ key: 'Down', times: 2 },
			{ sleep: '1s' },
			{
				shot: 'use',
				caption:
					'Moving through a feed swaps the entry below, links numbered against a reference list.'
			},
			// What it is for: reading, rather than skimming a list.
			{ type: 'z' },
			{ sleep: '1.2s' },
			{
				shot: 'depth',
				caption: '`z` gives the article the whole screen, set to a measure you can actually read.'
			}
		]
	},

	trafford: {
		build: cargo,
		// `trafford init` makes a vault of two notes, which is enough to prove
		// it works and not enough to photograph: a tree with nothing in it, an
		// empty outline, one backlink. This is a vault somebody has been using.
		fixture: `
mkdir -p ~/vault/00-inbox ~/vault/01-projects ~/vault/03-resources/ai-ml
cd ~/vault
cat > '01-projects/Vault design.md' <<'MD'
---
title: Vault design
tags: [meta, writing]
---

# Vault design

A vault is a folder of markdown. Everything else — [[Linking]], [[Backlinks]],
tags — is a way of reading that folder.

The parts:

- [[Linking]] resolves names, not paths
- [[Backlinks]] appear without being asked for
- [[Daily notes]] are where things land before they are filed

See also [[Obsidian compatibility]].
MD
cat > '01-projects/Linking.md' <<'MD'
---
title: Linking
tags: [meta]
---

# Linking

Write \`[[Note name]]\` anywhere and it resolves against the vault: exact path
first, then filename. The same rules [[Obsidian compatibility|Obsidian]] uses.

A link to a note that does not exist yet is not an error. It is the vault's
growing edge — see [[Backlinks]].
MD
cat > '01-projects/Backlinks.md' <<'MD'
---
title: Backlinks
tags: [meta]
---

# Backlinks

Every note that points here, with the line it pointed from. Nothing to
maintain: they are derived from [[Linking]], not written down.
MD
cat > '01-projects/Obsidian compatibility.md' <<'MD'
---
title: Obsidian compatibility
tags: [meta, compat]
---

# Obsidian compatibility

Same vault, same links, same frontmatter. See [[Vault design]].
MD
cat > '00-inbox/Daily notes.md' <<'MD'
---
title: Daily notes
tags: [routine]
---

# Daily notes

Where a thought lands before it is filed. Most of them become nothing; the
ones that do not get moved into [[01-projects]] and linked from
[[Vault design]].
MD
cat > '00-inbox/Read later.md' <<'MD'
---
title: Read later
tags: [routine]
---

# Read later

- Ted Nelson on transclusion
- The Zettelkasten papers
MD
cat > '03-resources/ai-ml/Retrieval.md' <<'MD'
---
title: Retrieval
tags: [ai, reading]
---

# Retrieval

Keyword overlap gets you further than it has any right to. Relevant to
[[Vault design]]: the assistant reads the vault before it answers.
MD
cat > '03-resources/ai-ml/Embeddings.md' <<'MD'
---
title: Embeddings
tags: [ai, reading]
---

# Embeddings

Notes on vector search. Compare [[Retrieval]].
MD
cat > 'Welcome.md' <<'MD'
---
title: Welcome
tags: [meta]
---

# Welcome

Start at [[Vault design]].
MD
git init -q
git add -A && git commit -qm "notes"
# A little uncommitted work, so the status bar has something true to say.
printf '\nAnd a line written since the last commit.\n' >> '00-inbox/Daily notes.md'
`,
		record: true,
		steps: [
			{ run: 'trafford init ~/starter' },
			{ sleep: '1s' },
			{
				shot: 'start',
				caption: '`trafford init` lays out a vault with starter notes, a config and a git repo.'
			},
			{ run: 'clear; trafford ~/vault' },
			{ sleep: '3s' },
			{
				shot: 'hero',
				caption:
					'A markdown vault with its tree, the note being edited, and its links and backlinks.'
			},
			// All of it is clickable, and right-click answers with what can be
			// done to whatever is under the pointer.
			{ click: 'Linking' },
			{ sleep: '1.2s' },
			{
				shot: 'use',
				caption:
					'Clicking a link opens that note, and the right-hand pane follows: its outline, what it points at, and what points back.'
			},
			{ key: 'Ctrl+G' },
			{ sleep: '1.2s' },
			{
				shot: 'depth',
				caption:
					'Git is in the status bar and one key away: stage, diff, commit and push, without leaving the vault.'
			}
		]
	},

	harrow: {
		build: cargo,
		path: ['target/release', '/cache/target/cairn/release'],
		fixture: cairnBacklog,
		record: true,
		steps: [
			{ run: 'harrow' },
			{ sleep: '2s' },
			{
				shot: 'hero',
				caption: 'A cairn backlog by milestone, with the selected item’s acceptance and fields.'
			},
			// Getting started is the key row, as it is for the other TUIs.
			{ type: '?' },
			{ sleep: '800ms' },
			{
				shot: 'start',
				caption: 'Read, claim, set a status, close, filter: one key each, and the help lists them.'
			},
			{ key: 'Escape' },
			{ sleep: '400ms' },
			{ key: 'Down', times: 2 },
			{ sleep: '500ms' },
			{
				shot: 'use',
				caption:
					'Moving down the backlog swaps the item beside it: its acceptance criteria, and how many are ticked.'
			},
			// What it is for: forty items are a board, not a list.
			{ key: 'Tab' },
			{ sleep: '900ms' },
			{
				shot: 'depth',
				caption: 'The same backlog as a board: what is waiting, what is moving, what is done.'
			}
		]
	},

	nun: {
		build: cargoAll,
		stage: 'repo',
		record: true,
		steps: [
			{ run: 'nun README.md' },
			{ sleep: '2s' },
			{
				shot: 'hero',
				caption:
					'The editor, in the terminal’s own colours, with one config file you will rarely open.'
			},
			// The point of nun, and the first real exercise of the pointer track:
			// it is driven by the mouse, so the recording has to draw the mouse.
			{ scroll: 4, at: 'terminal' },
			{ sleep: '600ms' },
			{ click: 'status line' },
			{ sleep: '800ms' },
			{
				shot: 'use',
				caption:
					'The mouse does what it does everywhere else: a click puts the caret where you clicked, the wheel scrolls, and the status line follows.'
			},
			{ key: 'Escape' },
			{ key: 'Ctrl+Q' },
			{ sleep: '1s' },
			{ run: 'clear; nun keys' },
			{ sleep: '1.2s' },
			{
				shot: 'start',
				caption: '`nun keys` lists every command and the key bound to it, yours included.'
			},
			{ run: 'clear; nun config' },
			{ sleep: '1s' },
			{
				shot: 'depth',
				caption: '`nun config` prints the effective configuration and where each value came from.'
			}
		]
	},

	// ── command-line tools ─────────────────────────────────────────────────

	cairn: {
		build: cargo,
		fixture: cairnBacklog,
		record: true,
		steps: [
			{ run: 'cairn board' },
			{ sleep: '1s' },
			{ shot: 'hero', caption: 'The board: every item as a Markdown file, laid out by status.' },
			{ run: 'clear; cairn new "Add SSO for enterprise" --type feature --set priority=p1' },
			{ sleep: '800ms' },
			{ shot: 'start', caption: 'A new item is a new file under a schema the project defines.' },
			{ run: 'clear; cairn next' },
			{ sleep: '800ms' },
			{
				shot: 'use',
				caption: '`cairn next` shows what can actually be started, not everything that is open.'
			},
			{ run: 'clear; cairn check' },
			{ sleep: '800ms' },
			{ shot: 'depth', caption: '`cairn check` validates every item against the schema.' }
		]
	},

	brainiac: {
		build: cargo,
		stage: 'repo',
		record: true,
		steps: [
			{ run: 'brainiac index' },
			{ sleep: '4s' },
			{
				shot: 'start',
				caption: 'Indexing a repository: files, symbols and the references between them.'
			},
			{ run: 'clear; brainiac search "how are results ranked"' },
			{ sleep: '2s' },
			{ shot: 'use', caption: 'A question answered with ranked file:line spans.' },
			{ run: 'clear; brainiac map -b 1500' },
			{ sleep: '2s' },
			{
				shot: 'hero',
				caption: 'The repository’s skeleton, ranked by reference and sized to a token budget.'
			},
			// The budget is the whole idea: the same map, told to fit a quarter
			// of the room, and what it keeps when it cannot keep everything.
			{ run: 'clear; brainiac map -b 400' },
			{ sleep: '2s' },
			{
				shot: 'depth',
				caption:
					'The same map at a quarter of the budget: what a smaller context window still gets told.'
			}
		]
	},

	yoghurt: {
		// A machine to take inventory of, as the user who owns it: the image
		// seeds `dev` with Homebrew, rustup and cargo, npm globals, neovim's
		// leftovers, and a binary downloaded by hand (screens/Dockerfile).
		user: 'dev',
		record: true,
		pace: { type: 110, key: 260 },
		// Installed the way its author runs it, from the checkout, so cargo
		// claims it like any other crate.
		fixture: `
install -d -o dev /cache/target/yoghurt-dev
# env -i: dev's own Rust, none of root's CARGO_HOME or RUSTUP_HOME.
runuser -u dev -- env -i HOME=/home/dev PATH=/home/dev/.cargo/bin:/usr/bin:/bin \\
  CARGO_TARGET_DIR=/cache/target/yoghurt-dev cargo install --locked --quiet --path "$REPO"`,
		buildTimeout: 1200,
		// Everything on dev's PATH is something an inventory should see. Not
		// /usr/local/bin: that is where the rig keeps ttyd.
		env: {
			PATH: [
				'/home/dev/.local/bin',
				'/home/dev/.npm-global/bin',
				'/home/dev/.cargo/bin',
				'/home/linuxbrew/.linuxbrew/bin',
				'/home/linuxbrew/.linuxbrew/sbin',
				'/usr/bin',
				'/bin'
			].join(':'),
			HOMEBREW_PREFIX: '/home/linuxbrew/.linuxbrew',
			HOMEBREW_CELLAR: '/home/linuxbrew/.linuxbrew/Cellar',
			HOMEBREW_REPOSITORY: '/home/linuxbrew/.linuxbrew/Homebrew',
			HOMEBREW_NO_AUTO_UPDATE: '1',
			HOMEBREW_NO_ANALYTICS: '1'
		},
		steps: [
			{ run: 'yoghurt' },
			{ wait: 'packages' },
			{ sleep: '3s' },
			{
				shot: 'hero',
				caption:
					'Everything installed on this machine, from every package manager at once, grouped by where it came from.'
			},

			// By why it is here, which no single package manager can say.
			{ type: 'g' },
			{ sleep: '2.8s' },
			{
				shot: 'start',
				caption:
					'Grouped by why it is here: what was asked for, what came with it, and what nothing needs.'
			},

			// Why is this one here? Find it, select it, open it.
			{ type: '/' },
			{ sleep: '500ms' },
			{ type: 'pcre2' },
			{ sleep: '1.2s' },
			{ key: 'Enter' },
			{ sleep: '700ms' },
			{ key: 'Down' },
			{ sleep: '700ms' },
			{ key: 'Enter' },
			{ sleep: '3s' },
			{
				shot: 'use',
				caption:
					'Why is this here: a library nobody asked for, and the thing that was asked for that needs it.'
			},
			{ key: 'Enter' },
			{ sleep: '800ms' },
			{ key: 'Escape' },
			{ sleep: '1.2s' },

			// The counts are filters: click one.
			{ click: 'unexplained' },
			{ sleep: '2.4s' },
			{ key: 'Down' },
			{ sleep: '600ms' },
			{ key: 'Enter' },
			{ sleep: '3s' },
			{
				shot: 'depth',
				caption:
					'What nothing installed needs any more: the residue of an uninstall no package manager finished, and the command that clears it.'
			},
			{ key: 'Enter' },
			{ sleep: '800ms' },
			{ key: 'Escape' },
			{ sleep: '1.2s' },

			// Largest first, then the other count worth reading: what came with things.
			{ type: 's' },
			{ sleep: '1.6s' },
			{ type: 'S' },
			{ sleep: '1.8s' },
			{ click: 'pulled in' },
			{ sleep: '1.6s' },
			{ type: 'q' },
			{ sleep: '1.5s' }
		]
	},

	tsi: {
		build: cargo,
		record: true,
		pace: { type: 110, key: 260 },
		// It prints tall: the staging tables want more than a TUI's 29 rows,
		// and the session is never cleared, so every screen is full.
		terminal: { height: 1500 },
		steps: [
			{ run: 'tsi optimize --payload 5000 --target-dv 9400 --engine raptor-2' },
			{ sleep: '4s' },
			{
				shot: 'hero',
				caption:
					'The staging that reaches a delta-v target: how many stages, which engines, and the propellant split between them.'
			},
			{ run: 'tsi engines' },
			{ sleep: '3.5s' },
			{
				shot: 'start',
				caption: 'Eleven real engines, with the numbers that decide what a stage can do.'
			},
			{ run: 'tsi calculate --engine raptor-2 --propellant-mass 100000' },
			{ sleep: '2.5s' },
			{ run: 'tsi calculate --engine raptor-2 --propellant-mass 100000 -o compact' },
			{ sleep: '3s' },
			{
				shot: 'use',
				caption:
					'One stage, from an engine and a propellant load: delta-v, burn time, thrust to weight — and the same thing on one line, for a script.'
			},
			{ run: 'tsi optimize --payload 5000 --target-dv 9400 --engine raptor-2 --monte-carlo 2000' },
			{ sleep: '5s' },
			{
				shot: 'depth',
				caption:
					'The same design, run two thousand times against uncertain inputs: how often it still makes orbit.'
			}
		]
	},

	starward: {
		// Python, installed into a virtualenv the way pip would, then run from
		// it: the commands are the ones its readme gives.
		build: 'python3 -m venv /cache/venv/starward && /cache/venv/starward/bin/pip install -q .',
		path: ['/cache/venv/starward/bin'],
		record: true,
		pace: { type: 110, key: 260 },
		steps: [
			{ run: 'starward time now' },
			{ sleep: '3s' },
			{
				shot: 'hero',
				caption: 'The astronomical clocks, right now: Julian date, sidereal time, and the rest.'
			},
			{ run: 'starward sun rise --lat 51.5 --lon -0.1' },
			{ sleep: '3s' },
			{
				shot: 'start',
				caption: 'Sunrise and sunset for a place on the Earth, with the twilights either side.'
			},
			{ run: 'starward moon phase' },
			{ sleep: '3s' },
			{
				shot: 'use',
				caption: 'The Moon tonight: its phase, how lit it is, and when the next one falls.'
			},
			{ run: 'clear' },
			// The worked example that fits a terminal: the full angular
			// separation runs to 36 lines, past the top of the screen.
			{ run: 'starward --verbose time convert 2460000.5' },
			{ sleep: '4s' },
			{
				shot: 'depth',
				caption:
					'Every calculation can show its work: each step of it, and the number that comes out.'
			}
		]
	},

	gummyworm: {
		// A real image, and one that survives being drawn in characters:
		// ImageMagick's own `logo:`, the wizard it has shipped for thirty
		// years. (Its `rose:` is a 70×46 thumbnail, and enlarging it gives the
		// ASCII nothing to hold on to.)
		fixture: `magick logo: -resize 600x wizard.png`,
		path: ['bin'],
		record: true,
		steps: [
			{ run: 'gummyworm -w 64 wizard.png' },
			{ sleep: '3.5s' },
			{
				shot: 'hero',
				caption:
					'An image, as characters: every cell takes the glyph whose weight matches the pixels under it.'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -w 64 wizard.png' },
			{ sleep: '3.5s' },
			{
				shot: 'start',
				caption: 'In colour, from the terminal’s own palette.'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p blocks -w 64 wizard.png' },
			{ sleep: '3.5s' },
			{
				shot: 'use',
				caption:
					'A dozen palettes: blocks fill the cell, braille halves it again, standard keeps it to type.'
			},
			{ run: 'clear' },
			{ run: 'gummyworm --list-palettes' },
			{ sleep: '3s' },
			{
				shot: 'depth',
				caption: 'Every palette it knows, and what each is for.'
			},

			// The gallery: the argument for this tool is how the output looks,
			// and one screen at a time cannot make it. The same wizard in every
			// palette, photographed in the same terminal as the beats above —
			// gummyworm can export its own PNGs, but they come out without the
			// site's palette and without its font.
			{ run: 'clear' },
			{ run: 'gummyworm -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'mono',
				caption:
					'Characters alone: each cell takes the glyph whose weight matches the pixels under it.',
				source: 'gummyworm'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'standard',
				caption: 'The same thing in colour, from the terminal’s own palette.',
				source: '-c'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p detailed -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'detailed',
				caption: 'Seventy-one characters, for as much detail as type can hold.',
				source: '-p detailed'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p shades -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'shades',
				caption: 'Symmetric shading: the ramp runs up and back down again.',
				source: '-p shades'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p retro -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'retro',
				caption: 'Dots and blocks mixed, the way a home computer would have drawn it.',
				source: '-p retro'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p blocks -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'blocks',
				caption: 'Four blocks, filling the whole cell rather than sitting inside it.',
				source: '-p blocks'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p dots -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'dots',
				caption: 'Braille, which halves the cell again and doubles the resolution.',
				source: '-p dots'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p binary -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'binary',
				caption: 'Two tones and nothing in between: a silhouette.',
				source: '-p binary'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p matrix -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'matrix',
				caption: 'Ones and zeroes, for the obvious reason.',
				source: '-p matrix'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p simple -w 58 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'simple',
				caption: 'Four characters, for a preview that renders instantly.',
				source: '-p simple'
			},
			{ run: 'clear' },
			{ run: 'gummyworm -c -p emoji -w 42 wizard.png' },
			{ sleep: '3s' },
			{
				plate: 'emoji',
				caption: 'Moon phases, at half the width, because the glyphs are twice as wide.',
				source: '-p emoji'
			}
		]
	},

	jerk: {
		build: cargo,
		// Never ~/Code on a real machine: this is a directory of repositories
		// made for the photograph, with twelve weeks of backdated history so
		// the activity graph has something to draw and the lifecycle mix is a
		// mix — one mature, two moving, one young, one stale, one abandoned.
		fixture: `
mkdir -p ~/Code && cd ~/Code
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.invalid
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.invalid

# repo name, commits, weeks-ago the history starts, weeks-ago it stops
build_repo() {
  name=$1; n=$2; from=$3; to=$4; complete=$5
  mkdir -p "$name" && cd "$name" && git init -q -b main
  printf '# %s\n\nOne of the repositories on this machine.\n' "$name" > README.md
  if [ "$complete" = "yes" ]; then
    printf 'MIT License\n\nCopyright (c) 2026 dev\n' > LICENSE
    printf '# Changelog\n\n## 0.2.0\n- the second thing\n\n## 0.1.0\n- the first thing\n' > CHANGELOG.md
    mkdir -p .github/workflows tests docs
    printf 'name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v5\n' > .github/workflows/ci.yml
    printf 'fn main() {}\n' > tests/smoke.rs
    printf '# Design\n\nHow it fits together.\n' > docs/design.md
  fi
  i=0
  while [ $i -lt $n ]; do
    week=$(( from - ( (from - to) * i / (n > 1 ? n - 1 : 1) ) ))
    when=$(date -u -d "$week weeks ago" +%Y-%m-%dT%H:%M:%SZ)
    printf 'line %s\n' "$i" >> src.txt
    git add -A
    GIT_AUTHOR_DATE="$when" GIT_COMMITTER_DATE="$when" git commit -qm "work $i on $name"
    i=$(( i + 1 ))
  done
  if [ "$complete" = "yes" ]; then
    git tag -a v0.2.0 -m "0.2.0" 2>/dev/null || true
  fi
  cd ..
}

build_repo orchard  28 12 0 yes
build_repo typeset  16 11 0 yes
build_repo ledger    9  5 0 no
build_repo pinboard  6 40 34 no
build_repo almanac  11  9 1 yes
build_repo scratch   1 52 52 no

cd ~/Code`,
		record: true,
		steps: [
			{ run: 'jerk ~/Code' },
			{ wait: 'orchard|typeset|ledger' },
			{ sleep: '3s' },
			{
				shot: 'hero',
				caption:
					'Every repository on the machine, weighed: how much has moved lately, how finished each one is, and what that adds up to.'
			},
			{ type: '?' },
			{ sleep: '1.2s' },
			{
				shot: 'start',
				caption: 'The keys: move, change view, filter, reorder, rescan.'
			},
			{ key: 'Escape' },
			{ sleep: '700ms' },
			{ key: 'Down', times: 2 },
			{ sleep: '1s' },
			{ type: '2' },
			{ sleep: '1.8s' },
			{
				shot: 'use',
				caption:
					'One project’s git: twelve weeks of commits, who made them, and whether the worktree is clean.'
			},
			// What it is for: the directory as a whole, not one repository.
			{ type: '5' },
			{ sleep: '2s' },
			{
				shot: 'depth',
				caption:
					'The portfolio rather than the project: the lifecycle mix, and how many of the six carry a readme, a licence, CI and tests.'
			},
			{ sleep: '800ms' },
			{ type: 'q' },
			{ sleep: '600ms' }
		]
	},

	turborust: {
		build: cargo,
		// A workspace with a real path-dependency closure, because that is the
		// part turborust is about: api and worker both depend on shared, so a
		// change to shared has to restart both, and turborust derives that
		// from cargo metadata rather than from hand-written globs.
		fixture: `
mkdir -p shop/crates/shared/src shop/crates/api/src shop/crates/worker/src
cd shop
cat > Cargo.toml <<'TOML'
[workspace]
members = ["crates/*"]
resolver = "2"
TOML
cat > crates/shared/Cargo.toml <<'TOML'
[package]
name = "shared"
version = "0.1.0"
edition = "2021"
TOML
cat > crates/shared/src/lib.rs <<'RS'
pub fn greeting() -> String {
    "orders".to_string()
}
RS
cat > crates/api/Cargo.toml <<'TOML'
[package]
name = "api"
version = "0.1.0"
edition = "2021"

[dependencies]
shared = { path = "../shared" }
TOML
cat > crates/api/src/main.rs <<'RS'
fn main() {
    println!("api listening on :8788 serving {}", shared::greeting());
    loop {
        std::thread::sleep(std::time::Duration::from_millis(500));
    }
}
RS
cat > crates/worker/Cargo.toml <<'TOML'
[package]
name = "worker"
version = "0.1.0"
edition = "2021"

[dependencies]
shared = { path = "../shared" }
TOML
cat > crates/worker/src/main.rs <<'RS'
fn main() {
    println!("worker draining {}", shared::greeting());
    loop {
        std::thread::sleep(std::time::Duration::from_millis(500));
    }
}
RS
cargo build --offline -q 2>/dev/null || cargo build -q
cd ..`,
		stage: 'fixture',
		record: true,
		steps: [
			{ hidden: 'cd shop' },
			{ run: 'turborust init' },
			{ sleep: '2s' },
			{
				shot: 'start',
				caption:
					'`turborust init` reads the workspace and writes a config: one entry per crate that runs.'
			},
			// No clear: short commands stack up the screen, so no shot is half empty.
			{ run: 'turborust plan' },
			{ sleep: '2.5s' },
			{
				shot: 'use',
				caption:
					'The resolved graph, with the watch globs derived from cargo rather than written by hand: api depends on shared, so shared is watched for api.'
			},
			{ run: 'turborust why api' },
			{ sleep: '2.5s' },
			{
				shot: 'depth',
				caption:
					'`why` answers the question the others do not: would this run right now, and on account of what.'
			},
			{ run: 'clear; turborust up' },
			{ sleep: '6s' },
			{
				shot: 'hero',
				caption: 'Both services supervised, watching the crates they actually depend on.'
			},
			{ key: 'Ctrl+C' },
			{ sleep: '1s' }
		]
	},

	polkadot: {
		// polkadot only runs on a Mac — it installs Homebrew, symlinks a Mac's
		// dotfiles and sets up launch agents — so the Linux container has
		// nothing true to run. What it does have is the real output, captured
		// on the machine polkadot maintains and committed to this repository.
		// The story prints that capture into the site's terminal and
		// photographs it: the bytes are the ones polkadot wrote, and the page
		// says where they were written.
		//
		// `clear` first, in the same command: it wipes the line that was just
		// typed along with the rest of the screen, so the shot is the report
		// and nothing else. (`hidden` is the wrong tool here — it appends its
		// own `clear` *after* the command, which throws the output away.)
		build: null,
		source: 'desk',
		// Fifty lines of report want a terminal that holds fifty lines.
		terminal: { height: 1900 },
		fixture: 'cp /work/site/src/lib/data/captures/polkadot-doctor.ansi report.ansi',
		steps: [
			{ run: 'clear; cat report.ansi' },
			{ sleep: '1.5s' },
			{
				shot: 'hero',
				caption:
					'`polkadot doctor` on the machine it maintains: every symlink, binary, shell and theme it put there, and whether each is still in place.'
			}
		]
	},

	andy: {
		// andy 1.2 works on Linux as well as macOS, so it can be shot here now.
		// It is a Python file at the repository root, not a build.
		path: ['.'],
		// A machine that has been used. Every path below is one andy actually
		// looks for on Linux, and the sizes are allocated for real — du counts
		// allocated blocks, which is what andy measures, so the figures on
		// screen are measurements rather than decoration.
		//
		// Kept to a few gigabytes on purpose. A first version used the sizes
		// from andy's own readme (7.5G of one target directory, 28G of
		// container images) and filled the Docker VM's disk, which takes the
		// daemon down with it. The shape of the accounting is what the shots
		// show; the absolute numbers are not worth a wedged machine.
		fixture: `
set -e
free=$(df -Pm / | awk 'NR==2 {print $4}')
if [ "$free" -lt 6000 ]; then
  echo "only \${free}M free on /; the fixture needs about 3G plus room to work" >&2
  exit 1
fi

big() {
  mkdir -p "$(dirname "$1")"
  # Allocated, not sparse: du has to see the blocks, or andy measures nothing.
  fallocate -l "$2" "$1" 2>/dev/null || dd if=/dev/zero of="$1" bs=1M count="\${2%M}" status=none
}

# project artifacts: the biggest thing on most developers' disks
big ~/Code/parser/target/debug/deps/libparser.rlib 520M
big ~/Code/engine/target/debug/deps/libengine.rlib 310M
big ~/Code/api/target/debug/deps/libapi.rlib 190M
big ~/Code/dashboard/node_modules/.cache/bundle.js 120M
big ~/Code/site/node_modules/.cache/bundle.js 70M
# andy counts a target/ or node_modules as project output when there is a
# manifest beside it saying what kind of project it is. Without these the
# cargo targets are just big directories and go uncounted.
for r in parser engine api; do
  printf '[package]\nname = "%s"\nversion = "0.1.0"\nedition = "2021"\n' "$r" > ~/Code/$r/Cargo.toml
done
for r in dashboard site; do
  printf '{ "name": "%s", "version": "0.1.0" }\n' "$r" > ~/Code/$r/package.json
done
for r in parser engine api dashboard site; do
  (cd ~/Code/$r && git init -q && git add -A && git commit -q -m init)
done

# package caches
big ~/.cargo/registry/cache/crates.io/bundle.crate 180M
big ~/.npm/_cacache/content-v2/blob 130M
big ~/go/pkg/mod/cache/download/mod.zip 150M
big ~/.m2/repository/org/bundle.jar 90M
big ~/.cache/uv/archive-v0/wheels 60M

# toolchains, containers and model weights
big ~/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/libstd.so 240M
big ~/.local/share/containers/storage/overlay/images.tar 420M
big ~/.cache/huggingface/hub/models/model.safetensors 300M
big ~/.cache/turbo/artifacts.bin 40M`,
		record: true,
		terminal: { height: 1300 },
		steps: [
			{ run: 'andy' },
			{ wait: 'project artifacts|largest', timeout: '60s' },
			{ sleep: '2s' },
			{
				shot: 'hero',
				caption:
					'Where the disk went, ranked: every category of developer leftover, and the largest single things inside them.'
			},
			// The promise the tool is built on: it never deletes anything.
			{ run: 'clear; andy --commands | head -28' },
			{ sleep: '3s' },
			{
				shot: 'start',
				caption:
					'The commands that would reclaim each one, printed as a script it will not run for you. andy never deletes, moves or modifies anything.'
			},
			{ run: 'clear; andy -i' },
			{ wait: 'PROJECT ARTIFACTS|project artifacts', timeout: '60s' },
			{ sleep: '2.5s' },
			{
				shot: 'use',
				caption:
					'The same accounting as a tree you can walk, each bar drawn against the largest item at its own level.'
			},
			{ type: 'm' },
			{ sleep: '2.5s' },
			{
				shot: 'depth',
				caption:
					'The area map: every category a rectangle whose size is its share of the total, so the magnitude is the shape rather than the number.'
			},
			{ type: 'q' },
			{ sleep: '800ms' }
		]
	},

	fontina: {
		build:
			'cargo build --release --locked -p fontina-cli 2>/dev/null || cargo build --release -p fontina-cli',
		// A font manager wants fonts to manage. The image ships three families;
		// a few more packages give it serif, sans, mono and a dozen scripts to
		// index, which is what makes the coverage and freedom questions real.
		fixture: `
set -e
apt-get -qq update >/dev/null 2>&1
DEBIAN_FRONTEND=noninteractive apt-get -qq install -y --no-install-recommends \
  fonts-liberation2 fonts-cantarell fonts-ebgaramond fonts-firacode fonts-noto-core \
  >/dev/null 2>&1 || true
fc-cache -f >/dev/null 2>&1 || true
find /usr/share/fonts -name '*.ttf' -o -name '*.otf' | wc -l`,
		record: true,
		terminal: { height: 1200 },
		steps: [
			{ run: 'fontina scan --system' },
			{ wait: 'indexed|faces|scanned', timeout: '120s' },
			{ sleep: '2s' },
			{
				shot: 'start',
				caption:
					'`fontina scan` walks the font directories the OS already has and builds one searchable index of everything in them.'
			},
			// The question a font manager exists to answer.
			// Four scripts at once, so the answer is a handful rather than most
			// of the library — and the question stays on screen above it.
			{ run: 'clear; fontina covers "Þórður · Ψυχή · Жизнь · Հայերեն"' },
			{ sleep: '2.5s' },
			{
				shot: 'use',
				caption:
					"Which faces can actually set this text — Icelandic, Greek, Russian and Armenian in one line — asked of the glyphs themselves rather than of the font's own claims."
			},
			// What the project is for, in its own words: free, and it says which.
			{ run: 'clear; fontina facets' },
			{ sleep: '2.5s' },
			{
				shot: 'depth',
				caption:
					'The library counted along every axis at once: weights, widths, scripts, vendors, and the licence each face is under.'
			},
			{ run: 'clear; fontina ui' },
			{ wait: 'fontina|families|faces', timeout: '30s' },
			{ sleep: '2.5s' },
			{
				shot: 'hero',
				caption:
					'Every font on the machine in one keyboard-first browser: the families down one side, and everything known about the selected face beside them — its axes, what it covers, its licence, its metrics.'
			},
			{ type: 'q' },
			{ sleep: '1s' },

			// The gallery: a font is its shapes, and no list of names carries
			// that. The same sentence set in each family, shaped by the tool
			// itself and drawn in the terminal.
			{ run: 'clear; fontina preview "family:DejaVu Serif" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'dejavu-serif',
				caption: 'DejaVu Serif, the workhorse on most Linux machines.',
				source: 'family:DejaVu Serif'
			},
			{ run: 'clear; fontina preview "family:EB Garamond" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'eb-garamond',
				caption: 'EB Garamond: a revival of a sixteenth-century face, still under an open licence.',
				source: 'family:EB Garamond'
			},
			{ run: 'clear; fontina preview "family:Cantarell" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'cantarell',
				caption: 'Cantarell, a humanist sans.',
				source: 'family:Cantarell'
			},
			{ run: 'clear; fontina preview "family:DejaVu Sans" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'dejavu-sans',
				caption: 'DejaVu Sans, the same skeleton as the serif with the serifs taken off.',
				source: 'family:DejaVu Sans'
			},
			{ run: 'clear; fontina preview "family:Fira Code" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'fira-code',
				caption: 'Fira Code, a monospace with programming ligatures.',
				source: 'family:Fira Code'
			},
			{ run: 'clear; fontina preview "family:JetBrains Mono" -t "Hamburg"' },
			{ sleep: '2s' },
			{
				plate: 'jetbrains-mono',
				caption: 'JetBrains Mono, which is the face this whole site is set in.',
				source: 'family:JetBrains Mono'
			}
		]
	},

	rigor: {
		build: cargo,
		// The one story that reads GitHub rather than the filesystem. `github`
		// is what lets the token reach it: scripts/screens.sh borrows the
		// desk's own gh auth, and the runner hands it to this story and to no
		// other, so nothing else's build ever sees a credential.
		github: true,
		// rigor runs inside a checkout and reports on that repository's pull
		// requests, so the fixture is a real checkout with real ones. quarry
		// is the busiest of them. Nothing here is staged: these are whatever
		// was actually open on the day it was shot, which is the same bargain
		// hackney's page makes.
		fixture: `
cd ~/src
git clone --quiet https://github.com/oddurs/quarry.git quarry
cd quarry
git config user.name dev
git config user.email dev@example.invalid
# Worktrees for branches that actually have pull requests open, and checked
# out as branches rather than detached — rigor matches a worktree to its pull
# request by branch and commit, and a detached head matches nothing.
for branch in $(gh pr list --limit 4 --json headRefName -q '.[].headRefName'); do
  dir=$(echo "$branch" | tr '/' '-')
  git worktree add -q "../.worktrees/quarry/$dir" -b "$branch" "origin/$branch" 2>/dev/null || true
done
git worktree list`,
		record: true,
		terminal: { height: 1200 },
		steps: [
			{ hidden: 'cd ~/src/quarry' },
			{ run: 'rigor' },
			{ wait: 'Ready|Blocked|Worktrees', timeout: '120s' },
			{ sleep: '3.5s' },
			{
				shot: 'hero',
				caption:
					'Every pull request open on the repository you are standing in, with its checks rolled up into one glyph: what is ready to merge, and what is not.'
			},
			{ type: '?' },
			{ sleep: '1.2s' },
			{
				shot: 'start',
				caption:
					'Open it, open its checks, copy its URL, filter, reorder, show the drafts — one key each.'
			},
			{ key: 'Escape' },
			{ sleep: '600ms' },
			// The other half of the question: not what is ready, but what is
			// not, and which of the several reasons it is.
			{ type: '4' },
			{ sleep: '2.5s' },
			{
				shot: 'use',
				caption:
					'What is not ready, and why: red checks, requested changes, or a conflict — with every check run behind the glyph expanded for the one selected.'
			},
			// The half nobody else does: which checkouts on this machine are
			// finished with, judged by commit rather than by branch name.
			{ type: '6' },
			{ sleep: '2.5s' },
			{
				shot: 'depth',
				caption:
					'The other half: every worktree on the machine against the pull request it belongs to, and which of them are safe to collect.'
			},
			{ type: 'q' },
			{ sleep: '800ms' }
		]
	},

	// ── macOS only: kept as they are until there is a macOS runner ─────────

	clackson: { runner: 'host' }
};

// Not yet storied, and why:
//   rigor, brevity    need a GitHub token / an LLM key and a clipboard
//   jerk              needs a directory of fixture repositories (never ~/Code)
//   turborust         needs a multi-service workspace fixture
//   triblenka         pre-release: nothing to run
//   polkadot, knit, gummyworm   Go and shell; stories to write
