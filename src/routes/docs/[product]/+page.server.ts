import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { buildDocsChannelHref, isDocsProduct } from '$lib/server/docs';

export const load: PageServerLoad = async ({ params }) => {
	if (!isDocsProduct(params.product)) {
		error(404, 'Documentation not found');
	}

	redirect(307, buildDocsChannelHref(params.product, 'stable'));
};
