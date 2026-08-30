import { doc_name_to_friendly_name } from '$lib/helpers/DocNameConverter';

export const DOCS_PRODUCTS = ['mupen64', 'redux'] as const;
export const DOCS_CHANNELS = ['stable', 'nightly'] as const;

// Products whose docs live entirely off-site: the doc tree links straight to
// them and /docs/<product> redirects to the external URL.
export const DOCS_LINK_PRODUCTS = ['stroop-original'] as const;

export const DOCS_LINK_TARGETS: Record<(typeof DOCS_LINK_PRODUCTS)[number], string> = {
	'stroop-original': 'https://stroop.sm64.us/'
};

export type DocsProduct = (typeof DOCS_PRODUCTS)[number];
export type DocsChannel = (typeof DOCS_CHANNELS)[number];
export type DocsLinkProduct = (typeof DOCS_LINK_PRODUCTS)[number];

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

export type DocsProductLink = {
	product: DocsProduct;
	label: string;
	href: string;
};

export type DocsTreeNode = {
	id: string;
	label: string;
	href?: string;
	icon?: DocsProduct | DocsLinkProduct;
	external?: boolean;
	channel?: DocsChannel;
	children?: DocsTreeNode[];
};

export type DocsSearchItem = {
	title: string;
	href: string;
	product: string;
	channel: DocsChannel;
	content: string;
};

const DOCS_PRODUCT_LABELS: Record<DocsProduct, string> = {
	mupen64: 'Mupen64',
	redux: 'SM64 Lua Redux'
};

const DOCS_LINK_PRODUCT_LABELS: Record<DocsLinkProduct, string> = {
	'stroop-original': 'Stroop Original'
};

export function getDocsLinkProductLabel(product: DocsLinkProduct) {
	return DOCS_LINK_PRODUCT_LABELS[product];
}

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

function getSearchableContent(content: string) {
	return content
		.replace(/^---[\s\S]*?---/m, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[#>*_`~-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
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
	const encodedSlug = normalizeSlug(slug).split('/').map(encodeURIComponent).join('/');

	return `/docs/${product}/${channel}/${encodedSlug}`;
}

export async function getDocsSearchIndex(): Promise<DocsSearchItem[]> {
	return docs.map((doc) => ({
		title: doc_name_to_friendly_name(doc.slug),
		href: buildDocHref(doc.product, doc.channel, doc.slug),
		product: getDocsProductLabel(doc.product),
		channel: doc.channel,
		content: getSearchableContent(doc.content)
	}));
}

export async function listDocSlugs(product: DocsProduct, channel: DocsChannel) {
	return docs
		.filter((doc) => doc.product === product && doc.channel === channel)
		.map((doc) => doc.slug);
}

export async function hasDocs(product: DocsProduct, channel: DocsChannel) {
	return (await listDocSlugs(product, channel)).length > 0;
}

export async function getFirstDocSlug(product: DocsProduct, channel: DocsChannel) {
	return (await listDocSlugs(product, channel))[0] ?? null;
}

export async function getDefaultDocHref(product: DocsProduct) {
	const firstSlug = await getFirstDocSlug(product, 'stable');
	return firstSlug
		? buildDocHref(product, 'stable', firstSlug)
		: buildDocsChannelHref(product, 'stable');
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

export async function getDocsTree(): Promise<DocsTreeNode[]> {
	const roots: DocsTreeNode[] = [];

	for (const product of DOCS_PRODUCTS) {
		for (const channel of DOCS_CHANNELS) {
			const slugs = await listDocSlugs(product, channel);
			if (slugs.length === 0) continue;

			const root: DocsTreeNode = {
				id: `${product}-${channel}`,
				label: getDocsProductLabel(product),
				icon: product,
				channel,
				href: buildDocsChannelHref(product, channel),
				children: []
			};

			for (const slug of slugs) {
				let current = root.children!;
				const segments = slug.split('/');
				for (let index = 0; index < segments.length; index += 1) {
					const segment = segments[index];
					const isDocument = index === segments.length - 1;
					const id = `${product}-${channel}-${segments.slice(0, index + 1).join('/')}`;
					let node = current.find((item) => item.id === id);

					if (!node) {
						node = {
							id,
							label: doc_name_to_friendly_name(segment),
							...(isDocument ? { href: buildDocHref(product, channel, slug) } : { children: [] })
						};
						current.push(node);
					}

					current = node.children ?? [];
				}
			}

			roots.push(root);
		}
	}

	for (const product of DOCS_LINK_PRODUCTS) {
		roots.push({
			id: `${product}-stable`,
			label: getDocsLinkProductLabel(product),
			icon: product,
			external: true,
			channel: 'stable',
			// Point at our own route, which redirects to the external target.
			href: `/docs/${product}`
		});
	}

	return roots;
}

export async function getDocsProductLinks(): Promise<DocsProductLink[]> {
	return Promise.all(
		DOCS_PRODUCTS.map(async (product) => ({
			product,
			label: getDocsProductLabel(product),
			href: await getDefaultDocHref(product)
		}))
	);
}

export async function getDocsChannelLinks(
	product: DocsProduct,
	slug?: string
): Promise<DocsChannelLink[]> {
	const normalizedSlug = slug ? normalizeSlug(slug) : '';

	return Promise.all(
		DOCS_CHANNELS.map(async (channel) => {
			const available = await hasDocs(product, channel);
			const href =
				normalizedSlug && (await getDocContent(product, channel, normalizedSlug))
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
	return docs.find(
		(doc) => doc.product === product && doc.channel === channel && doc.slug === normalizedSlug
	)?.content;
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
