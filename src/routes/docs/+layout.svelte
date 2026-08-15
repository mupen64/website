<script lang="ts">
	import { page } from '$app/state';
	import DocsTree from '$lib/components/DocsTree.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	let sidebarOpen = $state(false);
	const activeHref = $derived(page.url.pathname);

	$effect(() => {
		const openSidebar = () => (sidebarOpen = true);
		window.addEventListener('docs-sidebar:open', openSidebar);
		return () => window.removeEventListener('docs-sidebar:open', openSidebar);
	});
</script>

<div class="relative mx-auto flex max-w-7xl items-start">
	<button
		type="button"
		class="fixed top-20 left-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-slate-100/95 text-xl text-slate-900 shadow-lg backdrop-blur-md md:hidden dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100"
		aria-label="Open documentation navigation"
		onclick={() => (sidebarOpen = true)}
	>☰</button>

	{#if sidebarOpen}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
			aria-label="Close documentation navigation"
			onclick={() => (sidebarOpen = false)}
		></button>
	{/if}

	<aside
		class:translate-x-0={sidebarOpen}
		class="fixed top-20 bottom-0 left-0 z-40 w-72 -translate-x-full overflow-y-auto border-r border-slate-300 bg-slate-100/95 p-4 shadow-xl backdrop-blur-md transition-transform dark:border-slate-700 dark:bg-slate-900/95 md:sticky md:top-18 md:z-0 md:block md:h-[calc(100vh-5rem)] md:translate-x-0 md:shadow-none md:mt-14 md:mb-14 md:max-h-[calc(100vh-5rem)] md:rounded-xl md:border"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-sm font-bold tracking-wide text-slate-900 uppercase dark:text-slate-100">Documentation</h2>
			<button
				type="button"
				class="rounded p-1 text-xl text-slate-500 hover:bg-slate-200 md:hidden dark:hover:bg-slate-800"
				aria-label="Close documentation navigation"
				onclick={() => (sidebarOpen = false)}
			>×</button>
		</div>
		<DocsTree nodes={data.docs_tree} {activeHref} onNavigate={() => (sidebarOpen = false)} />
	</aside>

	<div class="min-w-0 flex-1">{@render children()}</div>
</div>
