import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocHrefForSlug } from '$lib/server/docs';

export const load: PageServerLoad = async ({ params }) => {
	const href = params.slug
		? await getDocHrefForSlug('mupen64', params.slug)
		: await getDocHrefForSlug('mupen64', '');

	redirect(307, href ?? '/docs/mupen64');
};
