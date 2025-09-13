<script lang="ts">
	import mupen64 from '$lib/assets/mupen64.svg';
	import github from '$lib/assets/github.svg';
	import lua from '$lib/assets/lua.svg';
	import { fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { cubicInOut, cubicOut, quadOut } from 'svelte/easing';

	let version_visible = $state(false);

	onMount(() => {
		setTimeout(() => {
			version_visible = true;
		}, 100);
	});
</script>

<main>
	<section class="bg-hero p-16 shadow-md">
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-row flex-wrap items-center justify-center gap-12 text-white">
				<img src={mupen64} alt="Mupen64 Logo" class="object-fit w-48" />
				<div class="flex flex-col gap-4">
					<div class="flex flex-row items-center gap-2 text-5xl leading-tight font-bold">
						<p>Mupen64</p>
						{#if version_visible}
							<p
								in:fly={{ y: 20, duration: 300, easing: quadOut }}
								class="bg-gradient-to-b from-white to-black bg-clip-text text-transparent"
								style="-webkit-text-stroke: 1px white;"
							>
								1.3.0
							</p>
						{/if}
					</div>
					<p class="text-lg">Advanced N64 TASing emulator.</p>
					<div class="flex flex-wrap items-center justify-center gap-4">
						<a href="https://github.com/mupen64/repack/archive/refs/heads/main.zip" class="button primary">Download Repack</a>
						<a href="https://github.com/mupen64/mupen64-rr-lua" class="button">
							<img src={github} alt="Github Logo" class="invert" />
							<p>See on GitHub</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="features" class="p-16">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-bold">Features</h2>
				<p class="mt-2"></p>
			</div>

			<div class="flex flex-row flex-wrap justify-center gap-8">
				<div class="card">
					<p class="text-xl font-semibold">🔋 Batteries Included</p>
					<p class="text-sm">
						The Mupen64 repack comes with plugins to get you started right away.
					</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">⌛ Rerecording</p>
					<p class="text-sm">
						Movie recording, playback, savestates - all the basics, but also advanced tools like
						Piano Roll and Seeking.
					</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">⚡ High Performance</p>

					<p class="text-sm">
						Optimized for TASing workloads and delivers consistently high performance.
					</p>
				</div>
				<div class="card">
					<p class="flex flex-row items-center gap-2 text-xl font-semibold">
						<img src={lua} alt="Lua Logo" class="w-8" />
						Lua Integration
					</p>

					<p class="text-sm">
						Contains a comprehensive Lua API which allows automating your TASing workflow.
					</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">🌳 Rich Ecosystem</p>
					<p class="text-sm">
						Rich ecosystem of advanced TASing tools and plugins, some of which are even first-party!
					</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">🔌 Extendable</p>
					<p class="text-sm">The GUI can be extended seamlessly using the Lua Actions API.</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">💪 Poweruser-Friendly</p>
					<p class="text-sm">
						Featuring a Command Palette and a hotkey for each action, Mupen64 gives powerusers
						freedom.
					</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">🎥 Video Capture</p>
					<p class="text-sm">Capture video directly from the emulator using VFW and FFmpeg.</p>
				</div>
				<div class="card">
					<p class="text-xl font-semibold">🎮 GameShark</p>
					<p class="text-sm">Support for GameShark cheats and GS button emulation.</p>
				</div>
			</div>
		</div>
	</section>
</main>

<style lang="tailwindcss">
	.bg-hero {
		background: linear-gradient(45deg, #ff0000, rgb(141, 12, 12));
	}
</style>
