import { SITE_ORIGIN } from '$lib/site';
import { buildDocHref, DOCS_CHANNELS, DOCS_PRODUCTS, listDocSlugs } from '$lib/server/docs';

export const prerender = true;

export async function GET() {
	const paths = [
		'/',
		'/sm64luaredux',
		'/ugui',
		'/stroop-original',
		'/stroop-refactor',
		'/org/expenses',
		'/releases'
	];
	for (const product of DOCS_PRODUCTS) {
		for (const channel of DOCS_CHANNELS) {
			for (const slug of await listDocSlugs(product, channel)) {
				paths.push(buildDocHref(product, channel, slug));
			}
		}
	}

	const urls = paths
		.map((path) => `<url><loc>${(SITE_ORIGIN + path).replaceAll('&', '&amp;')}</loc></url>`)
		.join('\n');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
		{
			headers: { 'Content-Type': 'application/xml; charset=utf-8' }
		}
	);
}
