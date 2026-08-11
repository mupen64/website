export type Channel =
	'stable-w32' | 'stable-w64' | 'nightly-w32' | 'nightly-w64';
export const downloadUrls: Record<Channel, string> = {
	'stable-w32': 'https://github.com/mupen64/repack/archive/refs/heads/stable-w32.zip',
	'stable-w64': 'https://github.com/mupen64/repack/archive/refs/heads/stable-w64.zip',
	'nightly-w32': 'https://github.com/mupen64/repack/archive/refs/heads/nightly-w32.zip',
	'nightly-w64': 'https://github.com/mupen64/repack/archive/refs/heads/nightly-w64.zip',
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
