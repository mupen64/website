
import type { LayoutServerLoad } from './$types';
import { MAINTENANCE } from '$env/static/private';

export const load: LayoutServerLoad = async () => {
	return {
		maintenance: MAINTENANCE === '1'
	};
};
