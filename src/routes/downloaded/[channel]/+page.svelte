<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import type { Channel } from "$lib/helpers/RepackDownloadHelper";
	import { downloadUrls } from "$lib/helpers/RepackDownloadHelper";
	import mupen64 from '$lib/assets/mupen64.svg';
	const channel = page.params.channel as Channel;
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">

		<div class="w-full flex flex-col items-center gap-2">

			<img src={mupen64} alt="Mupen64" class="w-32 h-32" />

			<br>

		<p class="text-xl text-center">Thank you for downloading Mupen64 {channel}!</p>
		<p>Visit the <a class="app-link" href={resolve(`/docs/mupen64/${channel}`)}>Quickstart guide</a> for instructions on how to use Mupen64.</p>

		<br>

		<p>Download didn't start? Try the <a class="app-link" href={downloadUrls[channel]}>direct download</a>.</p>

		</div>


		</div>
	</section>
</main>
