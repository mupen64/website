import { getReleases } from '$lib/server/releases';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	releases: getReleases()
		.filter((release) => release.channel === 'stable')
		.slice(0, 6)
		.map(({ id, product, title, date, content }) => ({
			id,
			product,
			title,
			date,
			summary: content
				.replace(/<[^>]*>/g, ' ')
				.replace(/&(amp|lt|gt|quot|#39);/g, (_, entity: string) => {
					return { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[entity]!;
				})
				.replace(/\s+/g, ' ')
				.trim()
				.slice(0, 280)
		}))
});
