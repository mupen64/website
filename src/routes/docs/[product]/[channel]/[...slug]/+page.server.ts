import { error, redirect } from '@sveltejs/kit';
import { Marked, type Renderer, type Tokens } from 'marked';
import type { PageServerLoad } from './$types';
import { doc_name_to_friendly_name } from '$lib/helpers/DocNameConverter';
import {
	buildDocHref,
	getDocContent,
	getDocsChannelLinks,
	getDocsNavItems,
	getDocsProductLabel,
	getDocsProductLinks,
	isDocsChannel,
	isDocsProduct,
	listDocSlugs
} from '$lib/server/docs';

const HEADING_LINK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>`;

const HEADING_CLASSES: Record<number, string> = {
	1: 'my-4 text-3xl font-bold separator-below',
	2: 'my-3 text-2xl',
	3: 'my-2 text-xl',
	4: 'my-2 text-lg',
	5: 'my-2 text-base',
	6: 'my-2 text-sm'
};

function headingText(html: string) {
	return html.replace(/<[^>]*>/g, '');
}

function slugifyHeading(text: string) {
	return text
		.toLowerCase()
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function escapeHtmlAttr(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function renderDoc(content: string) {
	const headingSlugCounts = new Map<string, number>();

	const marked = new Marked({
		renderer: {
			heading(this: Renderer, { tokens, depth }: Tokens.Heading) {
				const html = this.parser.parseInline(tokens);
				const slug = slugifyHeading(headingText(html));
				const classes = `doc-heading scroll-mt-24 ${HEADING_CLASSES[depth] ?? ''}`.trimEnd();

				if (!slug) {
					return `<h${depth} class="${classes}">${html}</h${depth}>\n`;
				}

				const count = headingSlugCounts.get(slug) ?? 0;
				headingSlugCounts.set(slug, count + 1);
				const id = count === 0 ? slug : `${slug}-${count}`;

				return `<h${depth} id="${id}" class="${classes}">${html} <a class="doc-heading-link" href="#${id}" title="Copy link to heading" aria-label="Copy link to “${escapeHtmlAttr(headingText(html))}” heading">${HEADING_LINK_ICON}</a></h${depth}>\n`;
			}
		},
		hooks: {
			postprocess(html) {
				html = html.replaceAll('[!NOTE]', '<div class="note">');
				html = html.replaceAll('[!NOTE---]', '</div>');
				html = html.replaceAll('[!TIP]', '<div class="tip">');
				html = html.replaceAll('[!TIP---]', '</div>');
				html = html.replaceAll('[!WARN]', '<div class="warn">');
				html = html.replaceAll('[!WARN---]', '</div>');
				html = html.replaceAll('[!CAUTION]', '<div class="caution">');
				html = html.replaceAll('[!CAUTION---]', '</div>');
				html = html.replace(/<p(?=[\s>])/g, '<p class="my-2"');
				html = html.replace(/<a(?!\s+class=)/g, '<a class="app-link"');
				html = html.replaceAll(
					'<code',
					'<code class="rounded bg-slate-200 px-1 py-0.5 font-mono text-[0.95em] dark:bg-slate-700/80"'
				);
				html = html.replaceAll(
					'<pre',
					'<pre class="my-4 w-full overflow-x-auto rounded-xl border border-slate-300 bg-slate-950 p-4 text-slate-100 dark:border-slate-700"'
				);
				html = html.replaceAll('<table', '<table class="doc-table"');
				html = html.replaceAll('<ol', '<ol class="ol"');

				return html;
			}
		}
	});

	return marked.parse(content);
}

export const load: PageServerLoad = async ({ params }) => {
	if (!isDocsProduct(params.product) || !isDocsChannel(params.channel)) {
		error(404, 'Documentation not found');
	}

	const docSlugs = await listDocSlugs(params.product, params.channel);
	const slug = params.slug;

	if (slug === '') {
		const firstSlug = docSlugs[0];

		if (!firstSlug) {
			error(404, 'Documentation not found');
		}

		redirect(307, buildDocHref(params.product, params.channel, firstSlug));
	}

	const content = await getDocContent(params.product, params.channel, slug);

	if (!content) {
		error(404, 'Documentation not found');
	}

	return {
		product: params.product,
		product_label: getDocsProductLabel(params.product),
		channel: params.channel,
		channel_links: await getDocsChannelLinks(params.product, slug),
		product_links: await getDocsProductLinks(),
		docs: await getDocsNavItems(params.product, params.channel),
		current_doc_href: buildDocHref(params.product, params.channel, slug),
		content: await renderDoc(content),
		title: doc_name_to_friendly_name(slug)
	};
};
