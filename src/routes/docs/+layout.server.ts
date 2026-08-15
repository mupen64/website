import type { LayoutServerLoad } from './$types';
import { getDocsTree } from '$lib/server/docs';

export const load: LayoutServerLoad = async () => ({
	docs_tree: await getDocsTree()
});
