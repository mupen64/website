<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Channel } from '$lib/helpers/RepackDownloadHelper';
	import { downloadUrls } from '$lib/helpers/RepackDownloadHelper';
	import mupen64 from '$lib/assets/mupen64.svg';
	const channel = page.params.channel as Channel;

	const channelToDocs: Partial<Record<Channel, string>> = {
		'stable-w32': '/docs/mupen64/stable',
		'stable-w64': '/docs/mupen64/stable',
		'nightly-w32': '/docs/mupen64/nightly',
		'nightly-w64': '/docs/mupen64/nightly'
	};
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div
			class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
		>
			<div class="flex w-full flex-col items-center gap-2">
				<img src={mupen64} alt="Mupen64" class="h-32 w-32" />

				<br />

				<p class="text-center text-xl">Thank you for downloading Mupen64 {channel}!</p>

				{#if channelToDocs[channel]}
					<p class="text-center">
						Visit the <a class="app-link" href={resolve(channelToDocs[channel])}>Quickstart guide</a
						> for instructions on how to use Mupen64.
					</p>
				{:else}
					<p class="text-center">
						There is no documentation for the <b>{channel}</b> channel.<br />Refer to the
						corresponding pull request's description for more context.
					</p>
				{/if}
				<br />

				<p class="text-center">
					Download didn't start? Try the <a class="app-link" href={downloadUrls[channel]}
						>direct download</a
					>.
				</p>
			</div>
		</div>
	</section>
</main>
