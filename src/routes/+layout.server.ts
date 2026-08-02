import { getDocsNavItems } from '$lib/server/docs';
import type { LayoutServerLoad } from './$types';
import { MAINTENANCE } from '$env/static/private';

export const load: LayoutServerLoad = async () => {
	return {
		mupen64_docs: await getDocsNavItems('mupen64', 'stable'),
		redux_docs: await getDocsNavItems('redux', 'stable'),
		maintenance: MAINTENANCE === '1'
	};
};
