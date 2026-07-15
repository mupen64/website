import { error, redirect } from '@sveltejs/kit';
import { Marked } from 'marked';
import type { PageServerLoad } from './$types';
import { doc_name_to_friendly_name } from '$lib/helpers/DocNameConverter';
import {
	buildDocHref,
	getDocContent,
	getDocsChannelLinks,
	getDocsNavItems,
	getDocsProductLabel,
	isDocsChannel,
	isDocsProduct,
	listDocSlugs
} from '$lib/server/docs';

function renderDoc(content: string) {
	const marked = new Marked({
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
				html = html.replaceAll('<p', '<p class="my-2"');
				html = html.replaceAll('<a', '<a class="app-link"');
				html = html.replaceAll('<h1', '<h1 class="my-4 text-3xl font-bold separator-below"');
				html = html.replaceAll('<h2', '<h2 class="my-3 text-2xl"');
				html = html.replaceAll('<h3', '<h3 class="my-2 text-xl"');
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
		docs: await getDocsNavItems(params.product, params.channel),
		current_doc_href: buildDocHref(params.product, params.channel, slug),
		content: await renderDoc(content),
		title: doc_name_to_friendly_name(slug)
	};
};
