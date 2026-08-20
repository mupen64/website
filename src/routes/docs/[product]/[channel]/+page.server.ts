import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	buildDocHref,
	getDocsChannelLinks,
	getDocsProductLabel,
	getDocsProductLinks,
	getFirstDocSlug,
	isDocsChannel,
	isDocsProduct,
	DOCS_CHANNELS,
	DOCS_PRODUCTS
} from '$lib/server/docs';

export const entries = () =>
	DOCS_PRODUCTS.flatMap((product) => DOCS_CHANNELS.map((channel) => ({ product, channel })));

export const load: PageServerLoad = async ({ params }) => {
	if (!isDocsProduct(params.product) || !isDocsChannel(params.channel)) {
		error(404, 'Documentation not found');
	}

	const firstSlug = await getFirstDocSlug(params.product, params.channel);

	if (firstSlug) {
		redirect(307, buildDocHref(params.product, params.channel, firstSlug));
	}

	return {
		product: params.product,
		product_label: getDocsProductLabel(params.product),
		channel: params.channel,
		channel_links: await getDocsChannelLinks(params.product),
		product_links: await getDocsProductLinks()
	};
};
