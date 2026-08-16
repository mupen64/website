export type Channel =
	'stable-windows-x86' | 'stable-windows-x64' | 'nightly-windows-x86' | 'nightly-windows-x64';
export const downloadUrls: Record<Channel, string> = {
	'stable-windows-x86': 'https://github.com/mupen64/repack/archive/refs/heads/stable-windows-x86.zip',
	'stable-windows-x64': 'https://github.com/mupen64/repack/archive/refs/heads/stable-windows-x64.zip',
	'nightly-windows-x86': 'https://github.com/mupen64/repack/archive/refs/heads/nightly-windows-x86.zip',
	'nightly-windows-x64': 'https://github.com/mupen64/repack/archive/refs/heads/nightly-windows-x64.zip',
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
