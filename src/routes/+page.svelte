<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import RepackDownloadButton from '$lib/components/RepackDownloadButton.svelte';
	import mupen64 from '$lib/assets/mupen64.svg';
	import GithubLogo from '$lib/assets/GithubLogo.svelte';
	import lua from '$lib/assets/lua.svg';
	import demo from '$lib/assets/demo.webp';
	import Hero from '$lib/components/Hero.svelte';
	import Title from '$lib/components/Title.svelte';
	import { resolve } from '$app/paths';
	import versions from '$lib/assets/versions.json';
	import StarBeg from '$lib/components/StarBeg.svelte';
	import redux from '$lib/assets/sm64luaredux.webp';
	import ugui from '$lib/assets/ugui.webp';
	import type { PageData } from './$types';
	import ReleaseDate from '$lib/components/ReleaseDate.svelte';

	let { data }: { data: PageData } = $props();

	const releaseProducts = {
		mupen64: { label: 'Mupen64', icon: mupen64 },
		redux: { label: 'SM64 Lua Redux', icon: redux },
		ugui: { label: 'ugui', icon: ugui }
	};

	const released_150 = true; //
	let nightly_hovered = $state(false);
</script>

<svelte:head>
	<title>Mupen64</title>
	<meta
		name="description"
		content="Download Mupen64, an advanced Nintendo 64 TASing emulator with rerecording, Lua scripting, video capture, and a rich ecosystem of tools."
	/>
</svelte:head>

<main>
	<Hero
		name="Mupen64"
		version={versions.mupen64}
		version_hovered={nightly_hovered}
		description="Advanced N64 TASing emulator."
		logo={mupen64}
		repository="https://github.com/mupen64/mupen64-rr-lua"
		docs={resolve('/docs/[product]', { product: 'mupen64' })}
		bg_color_from="#ff0000"
		bg_color_to="#ee0000"
		dark={true}
	>
		{#snippet button(dark: boolean)}
			<RepackDownloadButton
				channels={['stable', 'nightly']}
				variant="home"
				released150={released_150}
				onNightlyHover={(hovered) => (nightly_hovered = hovered)}
			/>
		{/snippet}
	</Hero>

	{#if data.releases.length}
		<section class="px-4 pt-16 sm:px-8 lg:px-16" aria-labelledby="latest-releases">
			<div class="mx-auto max-w-6xl">
				<Title id="latest-releases">Latest releases</Title>
				<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
					<p class="text-slate-600 dark:text-slate-400">
						The latest Mupen64 project family updates.
					</p>
					<a href={resolve('/releases')} class="app-link text-sm font-semibold">All releases →</a>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="flex snap-x snap-mandatory gap-5 overflow-x-auto rounded-2xl pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
					role="region"
					aria-label="Latest release summaries"
					tabindex="0"
				>
					{#each data.releases as release (release.id)}
						{@const product = releaseProducts[release.product]}
						<article
							class="flex w-80 max-w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
						>
							<div class="h-1 bg-emerald-500 dark:bg-emerald-600"></div>
							<div class="flex flex-1 flex-col p-6">
								<header class="mb-4 flex items-center gap-3">
									<img src={product.icon} alt="" class="h-10 w-10 shrink-0 object-contain" />
									<div class="min-w-0">
										<p class="text-sm text-slate-500 dark:text-slate-400">{product.label}</p>
										<h2 class="text-xl font-bold break-words">{release.title}</h2>
									</div>
								</header>
								{#if release.date}
									<ReleaseDate
										date={release.date}
										class="mb-3 text-xs text-slate-500 dark:text-slate-400"
									/>
								{/if}
								<p
									class="mb-6 line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
								>
									{release.summary || 'Explore the changes in this release.'}
								</p>
								<a
									href={resolve(`/releases#${release.id}`)}
									class="app-link mt-auto text-sm font-semibold"
									aria-label={`Read release notes for ${product.label} ${release.title}`}
								>
									Read release notes →
								</a>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<section id="showcase" class="p-16 pt-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<Title id="showcase">Showcase</Title>
			<div class="flex flex-col items-center justify-center">
				<img src={demo} alt="Demo" class="object-contain" />
			</div>
		</div>
	</section>

	<section id="features" class="p-16">
		<div class="mx-auto max-w-6xl">
			<Title id="features">Features</Title>
			<div class="flex flex-row flex-wrap justify-center gap-8">
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">🔋 Batteries Included</p>
					<p class="text-sm">
						The Mupen64 Repack comes with plugins, Lua scripts, and more to get you TASing right
						away.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">⌛ Rerecording</p>
					<p class="text-sm">
						Features the basics like movies and savestates, but also advanced tools like Piano Roll
						and Seeking.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">⚡ High Performance</p>

					<p class="text-sm">
						Mupen64 and its first-party plugins are optimized for TASing workloads and deliver
						consistently high performance.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="flex flex-row items-center gap-2 text-xl font-semibold">
						<img src={lua} alt="Lua Logo" class="w-8" />
						Lua Integration
					</p>

					<p class="text-sm">
						Contains a comprehensive Lua API which allows automating and enhancing your TASing
						workflow.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">🌳 Rich Ecosystem</p>
					<p class="text-sm">
						Rich ecosystem of advanced TASing tools and plugins geared towards increasing TASer
						productivity.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">🔌 Extendable</p>
					<p class="text-sm">The GUI can be extended seamlessly using Lua APIs.</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">💪 Poweruser-Friendly</p>
					<p class="text-sm">
						Features a Command Palette and a hotkey for each action to give powerusers the freedom
						they need.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">🎥 Video Capture</p>
					<p class="text-sm">
						Capture stable and perfectly synchronized video directly from the emulator faster than
						realtime using VFW or FFmpeg.
					</p>
				</Card>
				<Card class="w-80 max-w-72 p-4">
					<p class="text-xl font-semibold">🎮 Cheats</p>
					<p class="text-sm">Support for GameShark cheats and GS button emulation.</p>
				</Card>
			</div>
		</div>
	</section>
</main>
