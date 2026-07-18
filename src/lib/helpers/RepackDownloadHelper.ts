export type Channel = 'stable' | 'nightly' | 'experiments';
export const downloadUrls: Record<Channel, string> = {
	stable: 'https://github.com/mupen64/repack-stable/archive/refs/heads/main.zip',
	nightly: 'https://github.com/mupen64/repack-nightly/archive/refs/heads/main.zip',
	experiments: 'https://github.com/mupen64/repack-experiments/archive/refs/heads/main.zip'
};

export function startDownloadFromChannel(channel: Channel): () => void {
	const url = downloadUrls[channel];
	if (!url) {
		alert(`No download URL available for channel: ${channel}. Try again later.`);
		return () => {};
	}
	const iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.src = url;
	document.body.appendChild(iframe);

	return () => {
		iframe.remove();
	};
}
