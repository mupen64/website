import { getReleases } from '$lib/server/releases';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ releases: getReleases() });
