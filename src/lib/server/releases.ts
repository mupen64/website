import { Marked, type Token, type Tokens, type TokensList } from 'marked';
import releaseMetadata from '../../../static/changelogs/metadata.json';

export type ReleaseProduct = 'mupen64' | 'redux' | 'ugui';
export type ReleaseChannel = 'stable' | 'nightly';

export type Release = {
	id: string;
	product: ReleaseProduct;
	channel: ReleaseChannel;
	title: string;
	content: string;
	date: string | null;
	href: string;
	sourceHref: string | null;
};

type IndexedRelease = Release & { position: number; comparisonContent: string };

const repositories: Record<ReleaseProduct, string> = {
	mupen64: 'https://github.com/mupen64/mupen64-rr-lua',
	redux: 'https://codeberg.org/mupen64/SM64LuaRedux',
	ugui: 'https://codeberg.org/mupen64/ugui'
};

const modules = import.meta.glob(
	'/static/changelogs/{mupen64,redux,ugui}/{stable,nightly}/CHANGELOG.md',
	{ query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => {
		return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!;
	});
}

function sourceDirectory(product: ReleaseProduct, channel: ReleaseChannel, version: string) {
	const repository = repositories[product];
	const ref = channel === 'nightly' ? 'main' : encodeURIComponent(version);
	if (product === 'mupen64') return `${repository}/blob/${ref}/`;
	return `${repository}/src/${channel === 'nightly' ? 'branch' : 'tag'}/${ref}/`;
}

function renderContent(tokens: TokensList, base: string) {
	function safeUrl(href: string): string | null {
		try {
			const url = new URL(href, base);
			return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
		} catch {
			return null;
		}
	}

	const markdown = new Marked({
		renderer: {
			html({ text }: Tokens.HTML | Tokens.Tag) {
				return escapeHtml(text);
			},
			link({ href, title, tokens }: Tokens.Link) {
				const text = this.parser.parseInline(tokens);
				const url = safeUrl(href);
				if (!url) return text;
				return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${text}</a>`;
			},
			image({ href, title, text }: Tokens.Image) {
				const url = safeUrl(href);
				if (!url) return escapeHtml(text);
				return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ''}>`;
			}
		}
	});
	return markdown.parser(tokens);
}

function parseHeading(heading: Tokens.Heading) {
	const match = heading.text
		.trim()
		.match(
			/^(Unreleased|v?\d+(?:\.\d+)*(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?(?:\+[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?|\[(?:v?\d+(?:\.\d+)*(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?(?:\+[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?|Unreleased)\](?:\([^\n]*\)|\[[^\]\n]*\])?)(?:\s+(?:-\s*)?\(?([0-9]{4}-[0-9]{2}-[0-9]{2})\)?)?$/i
		);
	if (!match) return null;
	const label = match[1].startsWith('[') ? match[1].slice(1, match[1].indexOf(']')) : match[1];
	const date = match[2] ?? null;
	if (date) {
		const parsed = new Date(`${date}T00:00:00Z`);
		if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
			return null;
		}
	}

	return { title: label, date };
}

export function parseChangelog(
	content: string,
	product: ReleaseProduct,
	channel: ReleaseChannel
): IndexedRelease[] {
	const tokens = new Marked().lexer(content);
	const releases: IndexedRelease[] = [];
	let current: {
		heading: ReturnType<typeof parseHeading>;
		tokens: Token[];
		position: number;
	} | null = null;
	let position = 0;

	function finishSection() {
		if (!current?.heading) return;
		const { title, date } = current.heading;
		if (channel === 'stable' && title.toLowerCase() === 'unreleased') return;
		if (channel === 'nightly' && releases.length > 0) return;
		const section = Object.assign(current.tokens, { links: tokens.links }) as TokensList;
		const base = sourceDirectory(product, channel, title);
		const repository = repositories[product];
		releases.push({
			id: `${product}-${channel}-${encodeURIComponent(title)}-${current.position}`,
			product,
			channel,
			title,
			content: renderContent(section, base),
			comparisonContent: renderContent(section, `${repository}/`).trim(),
			date,
			href:
				channel === 'nightly'
					? product === 'ugui'
						? `${repository}/src/branch/main`
						: `${repository}/releases`
					: `${repository}/releases/tag/${encodeURIComponent(title)}`,
			sourceHref: `${base}CHANGELOG.md`,
			position: current.position
		});
	}

	for (const token of tokens) {
		if (token.type === 'heading' && token.depth === 1) {
			finishSection();
			current = {
				heading: parseHeading(token as Tokens.Heading),
				tokens: [],
				position: position++
			};
		} else if (current) {
			current.tokens.push(token);
		}
	}
	finishSection();
	return releases;
}

export function compareReleases(a: IndexedRelease, b: IndexedRelease) {
	if (a.channel !== b.channel) return a.channel === 'nightly' ? -1 : 1;
	if (a.channel === 'stable' && a.date !== b.date) {
		if (!a.date) return 1;
		if (!b.date) return -1;
		return b.date.localeCompare(a.date);
	}
	return a.position - b.position || a.product.localeCompare(b.product) || a.id.localeCompare(b.id);
}

export function getReleases(): Release[] {
	const releases = Object.entries(modules).flatMap(([path, content]) => {
		const match = path.match(
			/^\/static\/changelogs\/(mupen64|redux|ugui)\/(stable|nightly)\/CHANGELOG\.md$/
		);
		if (!match) return [];
		const product = match[1] as ReleaseProduct;
		const channel = match[2] as ReleaseChannel;
		const metadata = releaseMetadata[product];
		return parseChangelog(content, product, channel).map((release) => ({
			...release,
			date:
				(channel === 'nightly'
					? metadata.nightly
					: (metadata.stable as Record<string, string>)[release.title.replace(/^v/i, '')]) ??
				(release.date ? `${release.date}T00:00:00Z` : null)
		}));
	});

	const knownVersions = new Set(
		releases
			.filter((release) => release.channel === 'stable')
			.map((release) => `${release.product}:${release.title.replace(/^v/i, '')}`)
	);
	for (const product of Object.keys(releaseMetadata) as ReleaseProduct[]) {
		for (const [title, date] of Object.entries(releaseMetadata[product].stable)) {
			if (knownVersions.has(`${product}:${title.replace(/^v/i, '')}`)) continue;
			releases.push({
				id: `${product}-stable-${encodeURIComponent(title)}-metadata`,
				product,
				channel: 'stable',
				title,
				date,
				content: '<p>No changelog entry is available for this release.</p>',
				comparisonContent: '',
				href: `${repositories[product]}/releases/tag/${encodeURIComponent(title)}`,
				sourceHref: null,
				position: Number.MAX_SAFE_INTEGER
			});
		}
	}
	releases.sort(compareReleases);

	return releases.map(({ position, comparisonContent, ...release }) => {
		void position;
		if (release.channel === 'nightly') {
			const latestStable = releases.find(
				(candidate) => candidate.product === release.product && candidate.channel === 'stable'
			);
			if (latestStable?.sourceHref && comparisonContent === latestStable.comparisonContent) {
				return { ...release, content: '<p>(same as stable)</p>' };
			}
		}
		return release;
	});
}
