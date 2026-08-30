import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DOCS_PRODUCTS, getDefaultDocHref } from '$lib/server/docs';

export const load: PageServerLoad = async () => {
	redirect(307, await getDefaultDocHref(DOCS_PRODUCTS[0]));
};
