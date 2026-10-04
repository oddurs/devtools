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
	brainiac: { icon: Brain, tint: 'orchid', why: 'context for an agent' },
	jerk: { icon: FolderGit, tint: 'violet', why: 'every repository, weighed' },
	nun: { icon: SquarePen, tint: 'indigo', why: 'an editor' },
	moan: { icon: MessagesSquare, tint: 'teal', why: 'a conversation, read back' },

	// roadmap
	cairn: { icon: Milestone, tint: 'teal', why: 'a marker on the road' },
	harrow: { icon: ListChecks, tint: 'lime', why: 'working a backlog' },
	sprig: { icon: Sprout, tint: 'green', why: 'a plan that branches' },

	// reading
	trafford: { icon: NotebookPen, tint: 'violet', why: 'a notebook' },
	hackney: { icon: Newspaper, tint: 'coral', why: 'the front page' },
	rsst: { icon: Rss, tint: 'amber', why: 'feeds' },
	brevity: { icon: Scissors, tint: 'cyan', why: 'cut it short' },

	// desk
	polkadot: { icon: Laptop, tint: 'orchid', why: 'the machine itself' },
	knit: { icon: Network, tint: 'teal', why: 'machines woven together' },
	fontina: { icon: Type, tint: 'amber', why: 'fonts' },
	clackson: { icon: Keyboard, tint: 'indigo', why: 'the keyboard, heard' },
	gummyworm: { icon: Worm, tint: 'rose', why: 'it is in the name' },
	mcdir: { icon: FolderPlus, tint: 'lime', why: 'a new directory' },

	// science
	starward: { icon: Telescope, tint: 'sky', why: 'looking up' },
	tsi: { icon: Rocket, tint: 'coral', why: 'the rocket equation' },
	tungsten: { icon: Calculator, tint: 'violet', why: 'quantities, worked out' },

	// art
	windsor: { icon: Engine, tint: 'coral', why: 'the engine' },
	cornell: { icon: Box, tint: 'lime', why: 'the box' },

	// web
	turborust: { icon: Zap, tint: 'coral', why: 'fast rebuilds' },
	triblenka: { icon: TreePalm, tint: 'green', why: 'islands' },
	dscheck: { icon: Ruler, tint: 'sky', why: 'measured against the system' },
	rockaway: { icon: Grid3x3, tint: 'amber', why: 'the character grid' }
};

// An app without a mark yet still gets one, never a hole in the rail.
const fallback: Identity = { icon: Terminal, tint: 'teal', why: 'a tool' };

export function identity(name: string): Identity {
	return identities[name] ?? fallback;
}
