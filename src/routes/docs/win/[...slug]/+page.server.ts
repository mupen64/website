import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DOCS_CHANNELS, getDocContent, getDocHrefForSlug, listDocSlugs } from '$lib/server/docs';

export const entries = async () => {
	const slugs = new Set<string>(['']);
	for (const channel of DOCS_CHANNELS) {
		for (const slug of await listDocSlugs('mupen64', channel)) slugs.add(slug);
	}
	return [...slugs].map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	if (params.slug) {
		const matches = await Promise.all(
			DOCS_CHANNELS.map((channel) => getDocContent('mupen64', channel, params.slug))
		);
		if (!matches.some(Boolean)) error(404, 'Documentation not found');
	}
	const href = params.slug
		? await getDocHrefForSlug('mupen64', params.slug)
		: await getDocHrefForSlug('mupen64', '');

	redirect(307, href ?? '/docs/mupen64');
};
