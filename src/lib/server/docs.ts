import { doc_name_to_friendly_name } from '$lib/helpers/DocNameConverter';

export const DOCS_PRODUCTS = ['mupen64', 'redux'] as const;
export const DOCS_CHANNELS = ['stable', 'nightly'] as const;

export type DocsProduct = (typeof DOCS_PRODUCTS)[number];
export type DocsChannel = (typeof DOCS_CHANNELS)[number];

export type DocsNavItem = {
	slug: string;
	title: string;
	href: string;
	channel: DocsChannel;
};

export type DocsChannelLink = {
	channel: DocsChannel;
	href: string;
	available: boolean;
};

const DOCS_PRODUCT_LABELS: Record<DocsProduct, string> = {
	mupen64: 'Mupen64',
	redux: 'SM64 Lua Redux'
};

export function getDocsProductLabel(product: DocsProduct) {
	return DOCS_PRODUCT_LABELS[product];
}

type IndexedDoc = {
	product: DocsProduct;
	channel: DocsChannel;
	slug: string;
	content: string;
};

const modules = import.meta.glob('/static/docs/{mupen64,redux}/{stable,nightly}/**/*.md', {
	as: 'raw',
	eager: true
}) as Record<string, string>;

export function isDocsProduct(value: string): value is DocsProduct {
	return DOCS_PRODUCTS.includes(value as DocsProduct);
}

export function isDocsChannel(value: string): value is DocsChannel {
	return DOCS_CHANNELS.includes(value as DocsChannel);
}

function compareDocSlugs(a: string, b: string) {
	return a.localeCompare(b, undefined, {
		numeric: true,
		sensitivity: 'base'
	});
}

function normalizeSlug(slug: string) {
	return slug
		.split('/')
		.map((segment) => segment.trim())
		.filter(Boolean)
		.join('/');
}

const docs: IndexedDoc[] = Object.entries(modules)
	.flatMap(([filePath, content]) => {
		const match = filePath.match(/^\/static\/docs\/([^/]+)\/([^/]+)\/(.+)\.md$/);

		if (!match) {
			return [];
		}

		const [, product, channel, slug] = match;

		if (!isDocsProduct(product) || !isDocsChannel(channel)) {
			return [];
		}

		return [
			{
				product,
				channel,
				slug: normalizeSlug(slug),
				content
			}
		];
	})
	.sort((a, b) => compareDocSlugs(a.slug, b.slug));

export function buildDocsChannelHref(product: DocsProduct, channel: DocsChannel) {
	return `/docs/${product}/${channel}`;
}

export function buildDocHref(product: DocsProduct, channel: DocsChannel, slug: string) {
	const encodedSlug = normalizeSlug(slug)
		.split('/')
		.map(encodeURIComponent)
		.join('/');

	return `/docs/${product}/${channel}/${encodedSlug}`;
}

export async function listDocSlugs(product: DocsProduct, channel: DocsChannel) {
	return docs.filter((doc) => doc.product === product && doc.channel === channel).map((doc) => doc.slug);
}

export async function hasDocs(product: DocsProduct, channel: DocsChannel) {
	return (await listDocSlugs(product, channel)).length > 0;
}

export async function getFirstDocSlug(product: DocsProduct, channel: DocsChannel) {
	return (await listDocSlugs(product, channel))[0] ?? null;
}

export async function getDefaultDocHref(product: DocsProduct) {
	const firstSlug = await getFirstDocSlug(product, 'stable');
	return firstSlug ? buildDocHref(product, 'stable', firstSlug) : buildDocsChannelHref(product, 'stable');
}

export async function getDocsNavItems(
	product: DocsProduct,
	channel: DocsChannel = 'stable'
): Promise<DocsNavItem[]> {
	const slugs = await listDocSlugs(product, channel);

	return slugs.map((slug) => ({
		slug,
		title: doc_name_to_friendly_name(slug),
		href: buildDocHref(product, channel, slug),
		channel
	}));
}

export async function getDocsChannelLinks(
	product: DocsProduct,
	slug?: string
): Promise<DocsChannelLink[]> {
	const normalizedSlug = slug ? normalizeSlug(slug) : '';

	return Promise.all(
		DOCS_CHANNELS.map(async (channel) => {
			const available = await hasDocs(product, channel);
			const href = normalizedSlug && (await getDocContent(product, channel, normalizedSlug))
				? buildDocHref(product, channel, normalizedSlug)
				: buildDocsChannelHref(product, channel);

			return {
				channel,
				href,
				available
			};
		})
	);
}

export async function getDocContent(product: string, channel: string, slug: string) {
	if (!isDocsProduct(product) || !isDocsChannel(channel)) {
		return null;
	}

	const normalizedSlug = normalizeSlug(slug);
	return docs.find((doc) => doc.product === product && doc.channel === channel && doc.slug === normalizedSlug)
		?.content;
}

export async function getDocHrefForSlug(product: DocsProduct, slug: string) {
	const normalizedSlug = normalizeSlug(slug);

	if (!normalizedSlug) {
		return getDefaultDocHref(product);
	}

	for (const channel of DOCS_CHANNELS) {
		const content = await getDocContent(product, channel, normalizedSlug);

		if (content) {
			return buildDocHref(product, channel, normalizedSlug);
		}
	}

	return buildDocsChannelHref(product, 'stable');
}
