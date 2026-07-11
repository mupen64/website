import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	buildDocHref,
	getDocsChannelLinks,
	getDocsProductLabel,
	getFirstDocSlug,
	isDocsChannel,
	isDocsProduct
} from '$lib/server/docs';

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
		channel_links: await getDocsChannelLinks(params.product)
	};
};
