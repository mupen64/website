import { downloadUrls } from '$lib/helpers/RepackDownloadHelper';

export const entries = () => Object.keys(downloadUrls).map((channel) => ({ channel }));
