<script lang="ts">
	import '../app.css';
	import mupen64 from '$lib/assets/mupen64.svg';
	import sm64luaredux from '$lib/assets/sm64luaredux.webp';
	import ugui from '$lib/assets/ugui.webp';
	import stroop from '$lib/assets/stroop.svg';
	import org from '$lib/assets/org.svg';
	import { resolve } from '$app/paths';
	import { NavBrand, Navbar, Button } from 'flowbite-svelte';
	import { ChevronDownOutline, DiscordSolid } from 'flowbite-svelte-icons';

	let { children } = $props();

	const maintenance = false;
	const navItemClass =
		'!text-slate-900 hover:!bg-slate-200/70 hover:!text-primary-600 dark:!text-slate-100 dark:hover:!bg-slate-800/70 dark:hover:!text-primary-400';
	const navListClass =
		'flex w-full flex-col gap-1 rounded-lg !border-b border-dotted border-slate-400 bg-slate-100/90 p-2 dark:border-slate-600 dark:bg-slate-900/90 md:w-auto md:flex-row md:overflow-visible md:border-0 md:bg-transparent md:p-0';
	const megaMenuClass =
		'z-50 mt-2 w-fit rounded-xl !border-b border-dotted border-slate-400 bg-slate-100/95 p-2 text-slate-900 shadow-lg backdrop-blur-md dark:border-slate-500 dark:bg-slate-800/95 dark:text-slate-100';
	const megaMenuItemClass =
		'block -mx-2 w-[calc(100%+1rem)] !border-b border-dotted border-slate-400/70 px-4 py-2 text-sm text-slate-900 transition-colors hover:bg-slate-200/70 hover:text-primary-600 first:rounded-t-lg last:!border-b-0 last:rounded-b-lg dark:border-slate-500/70 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700/95 dark:hover:text-primary-300';
	const discordUrl = 'https://discord.gg/hFANcme32k';
	let projectsOpen = $state(false);
	let navOpen = $state(false);

	const projectItems = [
		{ name: 'Mupen64', href: resolve('/'), icon: mupen64 },
		{ name: 'SM64 Lua Redux', href: resolve('/sm64luaredux'), icon: sm64luaredux },
		{ name: 'ugui', href: resolve('/ugui'), icon: ugui },
		{ name: 'STROOP', href: resolve('/stroop'), icon: stroop }
	];
</script>

<svelte:head>
	<link rel="icon" href={mupen64} />
</svelte:head>

<div
	class="sticky top-0 z-50 mx-auto w-full border-b border-dashed border-slate-400/70 bg-white/20 md:border-x shadow-sm backdrop-blur-xs md:max-w-6xl md:rounded-b-xl dark:border-slate-600/70 dark:bg-slate-950/10"
>
	<Navbar class="mr-auto ml-auto max-w-6xl bg-transparent">
		<NavBrand href={resolve('/')} class="text-xl font-semibold text-slate-900 dark:text-slate-100">
			<img src={org} alt="Mupen64 Logo" class="object-fit w-8 pr-1" />
			<span>Mupen64 Organization</span>
		</NavBrand>

		<button
			type="button"
			class="inline-flex items-center rounded-lg p-2 text-xl text-slate-900 hover:bg-slate-200 md:hidden dark:text-slate-100 dark:hover:bg-slate-800"
			aria-label={navOpen ? 'Close main menu' : 'Open main menu'}
			aria-expanded={navOpen}
			onclick={() => (navOpen = !navOpen)}
		>☰</button>

		<div class={`${navOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
			<div class="flex items-center gap-1 md:flex">
				<div class={navListClass}>
			<div class="group relative w-full md:w-auto">
				<button
					type="button"
					class={`${navItemClass} inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium`}
					aria-haspopup="true"
					aria-expanded={projectsOpen}
					onclick={() => (projectsOpen = !projectsOpen)}
				>
					Projects
					<span aria-hidden="true" class="text-xs transition-transform group-hover:rotate-180">
						<ChevronDownOutline />
					</span>
				</button>
				<div
					class={`${megaMenuClass} ${projectsOpen ? 'visible opacity-100' : 'invisible opacity-0'} absolute top-full left-0 !mt-0 min-w-48 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100`}
				>
					{#each projectItems as item (item.name)}
						<a href={item.href} class={`${megaMenuItemClass} flex items-center gap-2`}>
													<img src={item.icon} alt="" class="h-5 w-5 shrink-0 rounded-sm object-contain" />
													<span>{item.name}</span>
												</a>
					{/each}
				</div>
			</div>
			<a
				href={resolve('/docs/mupen64/stable')}
				class={`${navItemClass} block w-full rounded-lg px-3 py-2 text-sm font-medium md:w-auto`}>Docs</a
			>
			<Button href={discordUrl} class="w-full sm:w-auto md:rounded-r-lg!" size="sm" pill>
				<DiscordSolid />
				<span class="ml-2">Discord server</span>
			</Button>
			</div>
		</div>
	</div>
	</Navbar>
</div>

<div class="flex min-h-screen flex-col">
	<div class="flex-1">
		{#if maintenance}
			<div class="flex min-h-[60vh] items-center justify-center p-8">
				<div
					class="w-full max-w-xl rounded-2xl border border-dashed border-slate-400/70 bg-slate-100/90 p-10 text-center shadow-sm backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-900/90"
				>
					<img
						src={org}
						alt="Organization Logo"
						class="object-fit mx-auto mb-6 w-24 animate-pulse"
					/>
					<h1 class="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
						We'll be right back! 🛠️
					</h1>
					<p class="mb-2 text-lg text-slate-700 dark:text-slate-300">
						The site is currently undergoing maintenance.
					</p>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Avoid downloading the repacks directly during maintenance, as they might be broken. <br
						/>
						We're working hard to get everything back up and running. Please check back soon.
					</p>
				</div>
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</div>

	<footer class="grid-300-45 w-full bg-slate-100/70 dark:bg-slate-900/70">
		<hr class="border-dashed border-slate-400/70 dark:border-slate-600/70" />
		<div class="flex flex-col items-center justify-center p-10 text-center">
			<div class="mb-5 flex flex-row items-center gap-2">
				<img src={org} alt="Mupen64 Logo" class="object-fit w-10" />
				<p class="text-2xl font-bold">Mupen64 Organization</p>
			</div>
			<p class="mb-5 max-w-2xl text-center">
				The Mupen64 Organization is a shared-ownership organization maintained by developers around
				the world.
				<br />
				Feel free to contribute!
			</p>

			<p class="mb-5 max-w-2xl text-center">
				Need support? Join our Discord server for live support and community discussions.
			</p>

			<Button href={discordUrl} class="mb-5" size="sm" pill>
				<DiscordSolid />
				<span class="ml-2">Discord server</span>
			</Button>

			<a class="app-link" href="https://github.com/mupen64">© 2026 Mupen64 Organization</a>
			<p>Licensed under GNU GPL v2 License</p>
		</div>
	</footer>
</div>
