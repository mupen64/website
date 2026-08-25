import type { LayoutServerLoad } from './$types';
import { getDocsSearchIndex } from '$lib/server/docs';

export const load: LayoutServerLoad = async () => ({
	docs_search: await getDocsSearchIndex()
});
