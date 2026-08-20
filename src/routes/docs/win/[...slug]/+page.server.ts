import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	DOCS_CHANNELS,
	DOCS_PRODUCTS,
	getDocHrefForSlug,
	listDocSlugs
} from '$lib/server/docs';

export const entries = async () => {
	const slugs = new Set<string>(['']);
	for (const product of DOCS_PRODUCTS) {
		for (const channel of DOCS_CHANNELS) {
			for (const slug of await listDocSlugs(product, channel)) slugs.add(slug);
		}
	}
	return [...slugs].map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const href = params.slug
		? await getDocHrefForSlug('mupen64', params.slug)
		: await getDocHrefForSlug('mupen64', '');

	redirect(307, href ?? '/docs/mupen64');
};
