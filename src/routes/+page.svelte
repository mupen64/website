<script lang="ts">
	import { Button, Card, Dropdown, DropdownItem } from 'flowbite-svelte';
	import mupen64 from '$lib/assets/mupen64.svg';
	import lua from '$lib/assets/lua.svg';
	import demo from '$lib/assets/demo.png';
	import Hero from '$lib/components/Hero.svelte';
	import Title from '$lib/components/Title.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { downloadUrls, startDownloadFromChannel } from '$lib/helpers/RepackDownloadHelper';

	function handle_download(event: MouseEvent, channel: 'stable' | 'nightly' | 'experiments') {
		event.preventDefault();

	    const cleanup =	startDownloadFromChannel(channel);

		if(channel === 'experiments')
			return;

		setTimeout(() => {
			goto(resolve(`/downloaded/${channel}`));
			setTimeout(() => cleanup(), 1000);
		}, 300);
	}
</script>

<main>
	<Hero
		name="Mupen64"
		description="Advanced N64 TASing emulator."
		logo={mupen64}
		repository="https://github.com/mupen64/mupen64-rr-lua"
		bg_color_from="#ff0000"
		bg_color_to="#dd0000"
		dark={true}
	>
		{#snippet button(dark: boolean)}
			<div class="inline-flex flex-wrap items-center gap-2">
				<Button
					href={downloadUrls.stable}
					color={dark ? 'light' : 'dark'}
					class="inline-flex items-center gap-2"
					onclick={(event) => handle_download(event, 'stable')}
				>
					<span class="material-symbols-sharp">window</span>
					<span>Download for Windows</span>
				</Button>

				<Button
					type="button"
					color={dark ? 'light' : 'dark'}
					aria-label="More download options"
					class="inline-flex items-center justify-center"
				>
					<span class="material-symbols-sharp">arrow_drop_down</span>
				</Button>

				<Dropdown
					placement="bottom-end"
					class="list-none"
				>
					<DropdownItem
						href={downloadUrls.nightly}
						onclick={(event) => handle_download(event, 'nightly')}
					>
						<div class="flex w-full flex-col items-start text-left leading-tight">
							<p class="text-base">Download nightly</p>
							<p class="text-xs font-light opacity-70">Beta - updated nightly and may be unstable</p>
						</div>
					</DropdownItem>
					<DropdownItem
						href={downloadUrls.experiments}
						onclick={(event) => handle_download(event, 'experiments')}
					>
						<div class="flex w-full flex-col items-start text-left leading-tight">
							<p class="text-base">Download experiments</p>
							<p class="text-xs font-light opacity-70">Experimental variations with cutting-edge features</p>
						</div>
					</DropdownItem>
					<DropdownItem>
					<div class="flex w-full flex-col items-start text-left leading-tight">
						<p class="text-base">Download for Linux</p>
						<p class="text-xs font-light opacity-70">There are currently no Linux builds available,<br> but we're gradually working towards cross-platform support</p>
					</div>

					</DropdownItem>
				</Dropdown>
			</div>
		{/snippet}
	</Hero>

	<section id="showcase" class="p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<Title>Showcase</Title>
			<div class="flex flex-col items-center justify-center">
				<img src={demo} alt="Demo" class="object-contain" />
			</div>
		</div>
	</section>

	<section id="features" class="p-16">
		<div class="mx-auto max-w-6xl">
			<Title>Features</Title>
			<div class="flex flex-row flex-wrap justify-center gap-8">
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">🔋 Batteries Included</p>
					<p class="text-sm">
						The Mupen64 Repack comes with plugins, Lua scripts, and more to get you TASing right
						away.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">⌛ Rerecording</p>
					<p class="text-sm">
						Features the basics like movies and savestates, but also advanced tools like Piano Roll
						and Seeking.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">⚡ High Performance</p>

					<p class="text-sm">
						Mupen64 and its first-party plugins are optimized for TASing workloads and deliver
						consistently high performance.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="flex flex-row items-center gap-2 text-xl font-semibold">
						<img src={lua} alt="Lua Logo" class="w-8" />
						Lua Integration
					</p>

					<p class="text-sm">
						Contains a comprehensive Lua API which allows automating and enhancing your TASing
						workflow.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">🌳 Rich Ecosystem</p>
					<p class="text-sm">
						Rich ecosystem of advanced TASing tools and plugins geared towards increasing TASer
						productivity.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">🔌 Extendable</p>
					<p class="text-sm">The GUI can be extended seamlessly using Lua APIs.</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">💪 Poweruser-Friendly</p>
					<p class="text-sm">
						Features a Command Palette and a hotkey for each action to give powerusers the freedom
						they need.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">🎥 Video Capture</p>
					<p class="text-sm">
						Capture stable and perfectly synchronized video directly from the emulator faster than
						realtime using VFW or FFmpeg.
					</p>
				</Card>
				<Card class="p-4 w-80 max-w-72">
					<p class="text-xl font-semibold">🎮 Cheats</p>
					<p class="text-sm">Support for GameShark cheats and GS button emulation.</p>
				</Card>
			</div>
		</div>
	</section>
</main>
