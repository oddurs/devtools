// Each app's mark: one Lucide icon and one tint. The tints are the twelve
// named hues in tokens.css, all at one lightness, so the rail reads as a set
// rather than a sweet shop. Within a group no tint repeats.
//
// Adding an app: pick an icon from https://lucide.dev/icons, import it by
// path (one file each, so only what is used ships), and give it a tint.
import Box from '@lucide/svelte/icons/box';
import Brain from '@lucide/svelte/icons/brain';
import Engine from '@lucide/svelte/icons/engine';
import FolderGit from '@lucide/svelte/icons/folder-git';
import GitFork from '@lucide/svelte/icons/git-fork';
import HardDrive from '@lucide/svelte/icons/hard-drive';
import GitPullRequest from '@lucide/svelte/icons/git-pull-request';
import History from '@lucide/svelte/icons/history';
import Keyboard from '@lucide/svelte/icons/keyboard';
import Laptop from '@lucide/svelte/icons/laptop';
import ListChecks from '@lucide/svelte/icons/list-checks';
import Milestone from '@lucide/svelte/icons/milestone';
import Network from '@lucide/svelte/icons/network';
import Newspaper from '@lucide/svelte/icons/newspaper';
import NotebookPen from '@lucide/svelte/icons/notebook-pen';
import PackageSearch from '@lucide/svelte/icons/package-search';
import Plug from '@lucide/svelte/icons/plug';
import Rocket from '@lucide/svelte/icons/rocket';
import Rss from '@lucide/svelte/icons/rss';
import Scissors from '@lucide/svelte/icons/scissors';
import SquarePen from '@lucide/svelte/icons/square-pen';
import Calculator from '@lucide/svelte/icons/calculator';
import Columns3 from '@lucide/svelte/icons/columns-3';
import FolderCog from '@lucide/svelte/icons/folder-cog';
import FolderPlus from '@lucide/svelte/icons/folder-plus';
import Grid3x3 from '@lucide/svelte/icons/grid-3x3';
import MessagesSquare from '@lucide/svelte/icons/messages-square';
import Ruler from '@lucide/svelte/icons/ruler';
import Sprout from '@lucide/svelte/icons/sprout';
import Telescope from '@lucide/svelte/icons/telescope';
import Terminal from '@lucide/svelte/icons/terminal';
import TreePalm from '@lucide/svelte/icons/tree-palm';
import Type from '@lucide/svelte/icons/type';
import Worm from '@lucide/svelte/icons/worm';
import Zap from '@lucide/svelte/icons/zap';
import GitCommitHorizontal from '@lucide/svelte/icons/git-commit-horizontal';
import FlaskConical from '@lucide/svelte/icons/flask-conical';
import Grid2x2 from '@lucide/svelte/icons/grid-2x2';
import ClockAlert from '@lucide/svelte/icons/clock-alert';
import Megaphone from '@lucide/svelte/icons/megaphone';
import Tags from '@lucide/svelte/icons/tags';
import Shovel from '@lucide/svelte/icons/shovel';
import ScrollText from '@lucide/svelte/icons/scroll-text';
import Save from '@lucide/svelte/icons/save';
import Armchair from '@lucide/svelte/icons/armchair';
import SquareTerminal from '@lucide/svelte/icons/square-terminal';
import StickyNote from '@lucide/svelte/icons/sticky-note';
import Wind from '@lucide/svelte/icons/wind';
import Wallpaper from '@lucide/svelte/icons/wallpaper';
import Binary from '@lucide/svelte/icons/binary';
import Component from '@lucide/svelte/icons/component';
import Plane from '@lucide/svelte/icons/plane';
import Smartphone from '@lucide/svelte/icons/smartphone';
import Flame from '@lucide/svelte/icons/flame';
import BrickWall from '@lucide/svelte/icons/brick-wall';
import Sparkles from '@lucide/svelte/icons/sparkles';
import Crown from '@lucide/svelte/icons/crown';
import Tent from '@lucide/svelte/icons/tent';
import Cat from '@lucide/svelte/icons/cat';
import ScanFace from '@lucide/svelte/icons/scan-face';
import Fish from '@lucide/svelte/icons/fish';
import Hand from '@lucide/svelte/icons/hand';
import Orbit from '@lucide/svelte/icons/orbit';
import Microscope from '@lucide/svelte/icons/microscope';
import TrainFront from '@lucide/svelte/icons/train-front';
import Mountain from '@lucide/svelte/icons/mountain';
import TreeDeciduous from '@lucide/svelte/icons/tree-deciduous';
import Landmark from '@lucide/svelte/icons/landmark';
import Globe from '@lucide/svelte/icons/globe';
import Tornado from '@lucide/svelte/icons/tornado';
import ChartSpline from '@lucide/svelte/icons/chart-spline';
import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
import Compass from '@lucide/svelte/icons/compass';
import Layers from '@lucide/svelte/icons/layers';
import Eye from '@lucide/svelte/icons/eye';
import Hexagon from '@lucide/svelte/icons/hexagon';
import Sigma from '@lucide/svelte/icons/sigma';
import AppWindow from '@lucide/svelte/icons/app-window';
import Quote from '@lucide/svelte/icons/quote';
import Bot from '@lucide/svelte/icons/bot';
import TrendingUp from '@lucide/svelte/icons/trending-up';
import Dice5 from '@lucide/svelte/icons/dice-5';
import Clock from '@lucide/svelte/icons/clock';

export const tints = [
	'rose',
	'coral',
	'amber',
	'lime',
	'green',
	'mint',
	'teal',
	'cyan',
	'sky',
	'indigo',
	'violet',
	'orchid'
] as const;

export type Tint = (typeof tints)[number];
// Every Lucide icon shares one component type.
export type Identity = { icon: typeof Terminal; tint: Tint; why: string };

export const identities: Record<string, Identity> = {
	// system
	poptop: { icon: History, tint: 'mint', why: 'a monitor you can rewind' },
	quarry: { icon: Plug, tint: 'amber', why: 'listening ports' },
	yoghurt: { icon: PackageSearch, tint: 'rose', why: 'what is installed, and why' },
	andy: { icon: HardDrive, tint: 'cyan', why: 'where the disk went' },
	findr: { icon: Columns3, tint: 'sky', why: 'three columns' },
	foldr: { icon: FolderCog, tint: 'violet', why: 'a folder, configured' },

	// code
	caligula: { icon: GitFork, tint: 'green', why: 'worktrees branching off' },
	rigor: { icon: GitPullRequest, tint: 'rose', why: 'pull requests' },
	nun: { icon: SquarePen, tint: 'indigo', why: 'an editor' },
	dscheck: { icon: Ruler, tint: 'sky', why: 'measured against the system' },
	tzguard: { icon: ClockAlert, tint: 'coral', why: 'an hour off, caught' },

	// agents
	brainiac: { icon: Brain, tint: 'orchid', why: 'context for an agent' },
	moan: { icon: MessagesSquare, tint: 'teal', why: 'a conversation, read back' },
	humanoid: { icon: GitCommitHorizontal, tint: 'amber', why: 'history, rewritten' },
	'herdr-namesync': { icon: Tags, tint: 'mint', why: 'names that keep up' },
	'ag-test': { icon: FlaskConical, tint: 'lime', why: 'a test, read by a machine' },

	// projects
	cairn: { icon: Milestone, tint: 'teal', why: 'a marker on the road' },
	harrow: { icon: ListChecks, tint: 'lime', why: 'working a backlog' },
	sprig: { icon: Sprout, tint: 'green', why: 'a plan that branches' },
	jerk: { icon: FolderGit, tint: 'violet', why: 'every repository, weighed' },
	'x-post': { icon: Megaphone, tint: 'sky', why: 'an announcement' },

	// machines
	polkadot: { icon: Laptop, tint: 'orchid', why: 'the machine itself' },
	loadstar: { icon: Save, tint: 'green', why: 'load whatever is on the disk' },
	knit: { icon: Network, tint: 'teal', why: 'machines woven together' },
	mcdir: { icon: FolderPlus, tint: 'lime', why: 'a new directory' },

	// news and notes
	hackney: { icon: Newspaper, tint: 'coral', why: 'the front page' },
	rsst: { icon: Rss, tint: 'amber', why: 'feeds' },
	trafford: { icon: NotebookPen, tint: 'violet', why: 'a notebook' },
	brevity: { icon: Scissors, tint: 'cyan', why: 'cut it short' },

	// science
	starward: { icon: Telescope, tint: 'sky', why: 'looking up' },
	tsi: { icon: Rocket, tint: 'coral', why: 'the rocket equation' },
	tungsten: { icon: Calculator, tint: 'violet', why: 'quantities, worked out' },

	// art and life
	windsor: { icon: Engine, tint: 'coral', why: 'the engine' },
	cornell: { icon: Box, tint: 'lime', why: 'the box' },
	biotic: { icon: Microscope, tint: 'green', why: 'a dish under glass' },
	gummyworm: { icon: Worm, tint: 'rose', why: 'it is in the name' },

	// apps
	doot: { icon: SquareTerminal, tint: 'mint', why: 'a terminal' },
	milky: { icon: StickyNote, tint: 'lime', why: 'a note' },
	fontina: { icon: Type, tint: 'amber', why: 'fonts' },

	// look and sound
	'subway-seat': { icon: Armchair, tint: 'coral', why: 'a seat on the train' },
	windflow: { icon: Wind, tint: 'cyan', why: 'the wind' },
	backpage: { icon: Wallpaper, tint: 'violet', why: 'the desktop picture' },
	clackson: { icon: Keyboard, tint: 'indigo', why: 'the keyboard, heard' },

	// games
	sharkplane: { icon: Plane, tint: 'sky', why: 'a plane' },
	'3310': { icon: Smartphone, tint: 'lime', why: 'the phone' },
	'hose-rodeo': { icon: Flame, tint: 'coral', why: 'the fire' },
	'toolbar-season': { icon: AppWindow, tint: 'indigo', why: 'a browser window, crowded' },
	'chess-strat': { icon: Crown, tint: 'amber', why: 'the king' },
	arkonk: { icon: BrickWall, tint: 'rose', why: 'bricks' },
	rim: { icon: Tent, tint: 'green', why: 'a first shelter' },

	// toys
	'piano-cat': { icon: Cat, tint: 'amber', why: 'the cat' },
	airchord: { icon: Hand, tint: 'violet', why: 'played by hand' },
	glitterbug: { icon: Sparkles, tint: 'orchid', why: 'glitter' },
	bushy: { icon: ScanFace, tint: 'rose', why: 'a face, read' },
	snappers: { icon: Fish, tint: 'teal', why: 'fish included' },

	// maps
	traintime: { icon: TrainFront, tint: 'cyan', why: 'a train' },
	yggdrasil: { icon: TreeDeciduous, tint: 'green', why: 'the tree' },
	museo: { icon: Landmark, tint: 'amber', why: 'a museum' },
	cartogram: { icon: Globe, tint: 'sky', why: 'the world, reweighed' },

	// simulations
	rover: { icon: Mountain, tint: 'coral', why: 'Mount Sharp' },
	fluidity: { icon: Tornado, tint: 'cyan', why: 'a vortex' },
	coalesce: { icon: Orbit, tint: 'violet', why: 'two bodies, circling' },

	// instruments
	meridian: { icon: Compass, tint: 'coral', why: 'a chronometer' },
	titi: { icon: ChartSpline, tint: 'lime', why: 'a graph' },
	'srt-08': { icon: AudioWaveform, tint: 'amber', why: 'sorting, heard' },

	// explainers
	'paradigm-lost': { icon: Layers, tint: 'amber', why: 'eleven layers of one problem' },
	einstein: { icon: Hexagon, tint: 'teal', why: 'the hat, from hexagons' },
	quantii: { icon: Sigma, tint: 'violet', why: 'numbers, rounded' },

	// research
	'session-context': { icon: Eye, tint: 'rose', why: 'what a page sees' },
	'chat-chat': { icon: Bot, tint: 'mint', why: 'two models' },
	'portfolio-paycheck-gap': { icon: TrendingUp, tint: 'green', why: 'a line going up' },

	// books and courses
	'measure-of-the-world': { icon: Clock, tint: 'indigo', why: 'Greenwich time' },
	'joy-of-randomness': { icon: Dice5, tint: 'coral', why: 'chance' },
	'a-program-looking-in-the-mirror': { icon: Quote, tint: 'orchid', why: 'a quotation of itself' },

	// web
	turborust: { icon: Zap, tint: 'coral', why: 'fast rebuilds' },
	triblenka: { icon: TreePalm, tint: 'green', why: 'islands' },
	rockaway: { icon: Grid3x3, tint: 'amber', why: 'the character grid' },
	systema: { icon: Component, tint: 'indigo', why: 'components' },
	rummy: { icon: Binary, tint: 'lime', why: 'text, rendered' },

	// languages and libraries
	'nether-c': { icon: Shovel, tint: 'amber', why: 'buried, not run' },
	oath: { icon: ScrollText, tint: 'sky', why: 'a sworn statement' },
	subcell: { icon: Grid2x2, tint: 'cyan', why: 'a cell, divided' }
};

// An app without a mark yet still gets one, never a hole in the rail.
const fallback: Identity = { icon: Terminal, tint: 'teal', why: 'a tool' };

export function identity(name: string): Identity {
	return identities[name] ?? fallback;
}
