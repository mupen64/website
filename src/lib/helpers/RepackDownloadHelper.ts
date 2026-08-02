export type Channel =
	'stable-w32' | 'stable-w64' | 'nightly-w32' | 'nightly-w64' | 'experiments-w64';
export const downloadUrls: Record<Channel, string> = {
	'stable-w32': 'https://github.com/mupen64/repack-stable-w32/archive/refs/heads/main.zip',
	'stable-w64': 'https://github.com/mupen64/repack-stable-w64/archive/refs/heads/main.zip',
	'nightly-w32': 'https://github.com/mupen64/repack-nightly-w32/archive/refs/heads/main.zip',
	'nightly-w64': 'https://github.com/mupen64/repack-nightly-w64/archive/refs/heads/main.zip',
	'experiments-w64': 'https://github.com/mupen64/repack-experiments-w64/archive/refs/heads/main.zip'
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
