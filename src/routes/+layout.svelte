<script lang="ts">
	import '../app.css';
	import mupen64 from '$lib/assets/mupen64.svg';
	import { resolve } from '$app/paths';
	import { MegaMenu, NavBrand, NavHamburger, NavLi, Navbar, NavUl } from 'flowbite-svelte';

	let { children, data } = $props();

	const navItemClass =
		'!text-slate-900 hover:!bg-slate-200/70 hover:!text-primary-600 dark:!text-slate-100 dark:hover:!bg-slate-800/70 dark:hover:!text-primary-400';
	const navListClass =
		'flex flex-col gap-1 rounded-lg !border-b border-dotted border-slate-400 bg-slate-100/90 p-2 dark:border-slate-600 dark:bg-slate-900/90 md:border-0 md:bg-transparent md:p-0';
	const megaMenuClass =
		'grid-300-45 z-50 mt-2 w-fit rounded-xl !border-b border-dotted border-slate-400 bg-slate-100/90 p-2 text-slate-900 shadow-lg backdrop-blur-md dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100';
	const megaMenuItemClass =
		'block -mx-2 w-[calc(100%+1rem)] !border-b border-dotted border-slate-400/70 px-4 py-2 text-sm text-slate-900 transition-colors hover:bg-slate-200/70 hover:text-primary-600 first:rounded-t-lg last:!border-b-0 last:rounded-b-lg dark:border-slate-600/70 dark:text-slate-100 dark:hover:bg-slate-800/70 dark:hover:text-primary-400';

	const mupen64Items = $derived([
		{ name: 'Home', href: resolve('/') },
		...(data.mupen64_docs ?? []).map((doc) => ({ name: doc.title, href: doc.href }))
	]);

	const reduxItems = $derived([
		{ name: 'Home', href: resolve('/sm64luaredux') },
		...(data.redux_docs ?? []).map((doc) => ({ name: doc.title, href: doc.href }))
	]);

	const uguiItems = [{ name: 'Home', href: resolve('/ugui') }];
	const stroopItems = [{ name: 'Home', href: resolve('/stroop') }];
</script>

<svelte:head>
	<link rel="icon" href={mupen64} />
</svelte:head>

<div
	class="grid-300-45 sticky top-0 z-50 w-full border-b border-dashed border-slate-400/70 bg-slate-100/80 shadow-sm backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-900/80"
>
	<Navbar class="bg-transparent">
		<NavBrand href={resolve('/')} class="text-xl font-semibold text-slate-900 dark:text-slate-100">
			<img src={mupen64} alt="Mupen64 Logo" class="object-fit w-8 pr-1" />
			<span>Mupen64 Organization</span>
		</NavBrand>

		<NavHamburger class="text-slate-900 dark:text-slate-100" menuClass="text-slate-900 dark:text-slate-100" />

		<NavUl class="items-center gap-1" ulClass={navListClass}>
			<NavLi class={navItemClass}>Mupen64</NavLi>
			<MegaMenu items={mupen64Items} class={megaMenuClass} ulClass="flex w-full min-w-0 flex-col gap-0">
				{#snippet children({ item })}
					<a href={item.href} class={megaMenuItemClass}>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class={navItemClass}>SM64 Lua Redux</NavLi>
			<MegaMenu items={reduxItems} class={megaMenuClass} ulClass="flex w-full min-w-0 flex-col gap-0">
				{#snippet children({ item })}
					<a href={item.href} class={megaMenuItemClass}>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class={navItemClass}>ugui</NavLi>
			<MegaMenu items={uguiItems} class={megaMenuClass} ulClass="flex w-full min-w-0 flex-col gap-0">
				{#snippet children({ item })}
					<a href={item.href} class={megaMenuItemClass}>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class={navItemClass}>STROOP</NavLi>
			<MegaMenu items={stroopItems} class={megaMenuClass} ulClass="flex w-full min-w-0 flex-col gap-0">
				{#snippet children({ item })}
					<a href={item.href} class={megaMenuItemClass}>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>
		</NavUl>
	</Navbar>
</div>

<div class="flex min-h-screen flex-col">
	<div class="flex-1">
		{@render children?.()}
	</div>

	<footer class="grid-300-45 w-full bg-slate-100/70 dark:bg-slate-900/70">
		<hr class="border-dashed border-slate-400/70 dark:border-slate-600/70" />
		<div class="flex flex-col items-center justify-center p-10 text-center">
			<div class="mb-5 flex flex-row items-center gap-2">
				<img src={mupen64} alt="Mupen64 Logo" class="object-fit w-10" />
				<p class="text-2xl font-bold">Mupen64 Organization</p>
			</div>
			<p class="mb-5 max-w-2xl text-center">
				The Mupen64 Organization is a shared-ownership organization maintained by developers around
				the world.
				<br />
				Feel free to contribute!
			</p>

			<a class="app-link" href="https://github.com/mupen64">© 2026 Mupen64 Organization</a>
			<p>Licensed under GNU GPL v2 License</p>
		</div>
	</footer>
</div>
