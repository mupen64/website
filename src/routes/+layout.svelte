<script lang="ts">
	import '../app.css';
	import mupen64 from '$lib/assets/mupen64.svg';
	import { resolve } from '$app/paths';
	import { MegaMenu, NavBrand, NavHamburger, NavLi, Navbar, NavUl } from 'flowbite-svelte';

	let { children, data } = $props();

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
	class="grid-300-45 sticky top-0 z-50 w-full border-b border-dashed border-gray-500 bg-base-200/80 shadow-sm backdrop-blur-md"
>
	<Navbar class="bg-transparent">
		<NavBrand href={resolve('/')} class="text-base-content text-xl font-semibold">
			<img src={mupen64} alt="Mupen64 Logo" class="object-fit w-8 pr-1" />
			<span>Mupen64 Organization</span>
		</NavBrand>

		<NavHamburger class="text-base-content" menuClass="text-base-content" />

		<NavUl
			class="items-center gap-1"
			ulClass="flex flex-col gap-1 rounded-lg border-b! border-dotted border-base-content bg-base-200/90 p-2 md:border-0 md:bg-transparent md:p-0"
		>
			<NavLi class="text-base-content! hover:bg-base-300/60! hover:text-orange-600!">Mupen64</NavLi>
			<MegaMenu
				items={mupen64Items}
				class="grid-300-45 z-50 mt-2 w-fit rounded-xl border-b! border-dotted border-base-content bg-base-200/90 p-2 text-base-content shadow-lg backdrop-blur-md"
				ulClass="flex w-full min-w-0 flex-col gap-0"
			>
				{#snippet children({ item })}
					<a
						href={item.href}
						class="block -mx-2 w-[calc(100%+1rem)] border-b! border-dotted border-base-content/50 px-4 py-2 text-sm text-base-content transition-colors hover:bg-base-300/60 hover:text-orange-600 first:rounded-t-lg last:border-b-0 last:rounded-b-lg"
					>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class="text-base-content! hover:bg-base-300/60! hover:text-orange-600!">SM64 Lua Redux</NavLi>
			<MegaMenu
				items={reduxItems}
				class="grid-300-45 z-50 mt-2 w-fit rounded-xl border-b! border-dotted border-base-content bg-base-200/90 p-2 text-base-content shadow-lg backdrop-blur-md"
				ulClass="flex w-full min-w-0 flex-col gap-0"
			>
				{#snippet children({ item })}
					<a
						href={item.href}
						class="block -mx-2 w-[calc(100%+1rem)] border-b! border-dotted border-base-content px-4 py-2 text-sm text-base-content transition-colors hover:bg-base-300/60 hover:text-orange-600 first:rounded-t-lg last:border-b-0 last:rounded-b-lg"
					>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class="text-base-content! hover:bg-base-300/60! hover:text-orange-600!">ugui</NavLi>
			<MegaMenu
				items={uguiItems}
				class="grid-300-45 z-50 mt-2 w-fit rounded-xl border-b! border-dotted border-base-content bg-base-200/90 p-2 text-base-content shadow-lg backdrop-blur-md"
				ulClass="flex w-full min-w-0 flex-col gap-0"
			>
				{#snippet children({ item })}
					<a
						href={item.href}
						class="block -mx-2 w-[calc(100%+1rem)] border-b! border-dotted border-base-content px-4 py-2 text-sm text-base-content transition-colors hover:bg-base-300/60 hover:text-orange-600 first:rounded-t-lg last:border-b-0 last:rounded-b-lg"
					>
						{item.name}
					</a>
				{/snippet}
			</MegaMenu>

			<NavLi class="text-base-content! hover:bg-base-300/60! hover:text-orange-600!">STROOP</NavLi>
			<MegaMenu
				items={stroopItems}
				class="grid-300-45 z-50 mt-2 w-fit rounded-xl border-b! border-dotted border-base-content bg-base-200/90 p-2 text-base-content shadow-lg backdrop-blur-md"
				ulClass="flex w-full min-w-0 flex-col gap-0"
			>
				{#snippet children({ item })}
					<a
						href={item.href}
						class="block -mx-2 w-[calc(100%+1rem)] border-b! border-dotted border-base-content px-4 py-2 text-sm text-base-content transition-colors hover:bg-base-300/60 hover:text-orange-600 first:rounded-t-lg last:border-b-0 last:rounded-b-lg"
					>
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

	<footer class="grid-300-45 w-full bg-base-200">
		<hr class="border-dashed border-gray-500" />
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

			<a class="link" href="https://github.com/mupen64">© 2026 Mupen64 Organization</a>
			<p>Licensed under GNU GPL v2 License</p>
		</div>
	</footer>
</div>
