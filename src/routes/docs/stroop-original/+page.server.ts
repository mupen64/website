import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DOCS_LINK_TARGETS } from '$lib/server/docs';

export const load: PageServerLoad = async () => {
	redirect(307, DOCS_LINK_TARGETS['stroop-original']);
};
