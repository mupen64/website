<script lang="ts">
	import mupen64 from '$lib/assets/mupen64.svg';
	import redux from '$lib/assets/sm64luaredux.webp';
	import ugui from '$lib/assets/ugui.webp';
	import type { PageData } from './$types';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import RepackDownloadButton from '$lib/components/RepackDownloadButton.svelte';
	import { onMount, tick } from 'svelte';
	import { SvelteURL } from 'svelte/reactivity';
	import ReleaseDate from '$lib/components/ReleaseDate.svelte';
	import ChannelPill from '$lib/components/ChannelPill.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import CollapsibleReleaseNotes from '$lib/components/CollapsibleReleaseNotes.svelte';

	let { data }: { data: PageData } = $props();

	let filtersReady = $state(false);
	onMount(() => {
		filtersReady = true;
	});

	const products = [
		{ id: 'mupen64', label: 'Mupen64', icon: mupen64 },
		{ id: 'redux', label: 'SM64 Lua Redux', icon: redux },
		{ id: 'ugui', label: 'ugui', icon: ugui }
	] as const;
	const channels = ['nightly', 'stable'] as const;
	type Product = (typeof products)[number]['id'];
	type Channel = (typeof channels)[number];

	function readSelection<T extends string>(value: string | null, allowed: readonly T[]): T[] {
		return allowed.filter((item) => value?.split(',').includes(item));
	}

	const selectedProducts = $derived(
		filtersReady
			? readSelection(
					page.url.searchParams.get('product'),
					products.map((product) => product.id)
				)
			: []
	);
	const selectedChannels = $derived.by((): Channel[] => {
		if (!filtersReady) return ['stable'];
		const value = page.url.searchParams.get('channel');
		if (value === 'all') return [];
		const selected = readSelection(value, channels);
		return selected.length ? selected : ['stable'];
	});

	function updateFilters(nextProducts: Product[], nextChannels: Channel[]) {
		const url = new URL(page.url);
		if (nextProducts.length) {
			url.searchParams.set('product', nextProducts.join(','));
		} else {
			url.searchParams.delete('product');
		}
		if (nextChannels.length === 1 && nextChannels[0] === 'stable') {
			url.searchParams.delete('channel');
		} else {
			url.searchParams.set('channel', nextChannels.length ? nextChannels.join(',') : 'all');
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(url, { replaceState: true, noScroll: true, keepFocus: true, state: page.state });
	}

	const latestStableMupen = $derived(
		data.releases.find((release) => release.product === 'mupen64' && release.channel === 'stable')
	);

	async function showRepack(event: MouseEvent, channel: Channel, id: string) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		const url = new SvelteURL(page.url);
		url.searchParams.delete('product');
		if (channel === 'nightly') url.searchParams.set('channel', 'nightly');
		else url.searchParams.delete('channel');
		url.hash = id;
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(url, { noScroll: true, keepFocus: true });
		await tick();
		document.getElementById(id)?.scrollIntoView();
	}

	const filteredReleases = $derived(
		data.releases.filter(
			(release) =>
				(!selectedProducts.length || selectedProducts.includes(release.product)) &&
				(!selectedChannels.length || selectedChannels.includes(release.channel))
		)
	);

	function toggleProduct(product: Product) {
		updateFilters(
			selectedProducts.includes(product)
				? selectedProducts.filter((value) => value !== product)
				: [...selectedProducts, product],
			selectedChannels
		);
	}

	function toggleChannel(channel: Channel) {
		updateFilters(
			selectedProducts,
			selectedChannels.includes(channel)
				? selectedChannels.filter((value) => value !== channel)
				: [...selectedChannels, channel]
		);
	}

	function resetFilters() {
		updateFilters([], []);
	}

	function chipClass(active: boolean) {
		return `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
			active
				? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
				: 'border-slate-300 bg-white/70 text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300'
		}`;
	}
</script>

<svelte:head>
	<title>Releases · Mupen64</title>
	<meta name="description" content="Latest releases from the Mupen64 project family." />
</svelte:head>

<main class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
	<header class="mb-8">
		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Releases</h1>
	</header>

	<div
		class="mb-8 flex flex-wrap gap-x-10 gap-y-6 rounded-2xl border border-slate-300 bg-slate-100/80 p-5 dark:border-slate-700 dark:bg-slate-900/70"
	>
		<fieldset class="min-w-0">
			<legend
				class="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
				>Channel</legend
			>
			<div class="flex flex-wrap gap-2">
				{#each channels as channel (channel)}
					<button
						type="button"
						class={chipClass(selectedChannels.includes(channel))}
						aria-pressed={selectedChannels.includes(channel)}
						onclick={() => toggleChannel(channel)}
					>
						<span
							aria-hidden="true"
							class={`h-2 w-2 rounded-full ${channel === 'nightly' ? 'bg-red-400' : 'bg-emerald-400'}`}
						></span>
						<span class="capitalize">{channel}</span>
					</button>
				{/each}
			</div>
		</fieldset>
		<fieldset class="min-w-0">
			<legend
				class="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
				>Product</legend
			>
			<div class="flex flex-wrap gap-2">
				{#each products as product (product.id)}
					<button
						type="button"
						class={chipClass(selectedProducts.includes(product.id))}
						aria-pressed={selectedProducts.includes(product.id)}
						onclick={() => toggleProduct(product.id)}
					>
						<img src={product.icon} alt="" class="h-5 w-5 rounded-sm object-contain" />
						{product.label}
					</button>
				{/each}
			</div>
		</fieldset>
		<button
			type="button"
			class="ml-auto shrink-0 self-end rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
			disabled={!selectedChannels.length && !selectedProducts.length}
			onclick={resetFilters}>Clear filters</button
		>
	</div>

	<div
		class="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400"
	>
		<p role="status">
			{filteredReleases.length}
			{filteredReleases.length === 1 ? 'release' : 'releases'}
		</p>
	</div>

	<div class="flex flex-col gap-6">
		{#each filteredReleases as release (release.id)}
			{@const product = products.find((product) => product.id === release.product)!}
			{@const hasRepack =
				release.product === 'mupen64' &&
				(release.channel === 'nightly' || release.id === latestStableMupen?.id)}
			{@const repackRelease = data.releases.find(
				(candidate) => candidate.product === 'mupen64' && candidate.channel === release.channel
			)}

			<article
				id={release.id}
				class={`scroll-mt-28 overflow-hidden rounded-2xl border bg-white/80 shadow-sm dark:bg-slate-900/80 ${release.channel === 'nightly' ? 'border-red-300 dark:border-red-800' : 'border-slate-300 dark:border-slate-700'}`}
			>
				<div
					class={`h-1 ${release.channel === 'nightly' ? 'bg-red-400 dark:bg-red-500' : 'bg-emerald-500 dark:bg-emerald-600'}`}
				></div>
				<div class="p-6 sm:p-8">
					<header class="mb-6 flex items-center gap-4">
						<img src={product.icon} alt="" class="h-14 w-14 shrink-0 object-contain" />
						<div class="flex min-w-0 flex-1 flex-col gap-1.5">
							<h2 class="text-xl font-bold break-words sm:text-2xl">
								<a
									href={`#${release.id}`}
									class="hover:text-primary-600 dark:hover:text-primary-400"
								>
									{product.label}
									<span class="font-normal text-slate-500 dark:text-slate-400">{release.title}</span
									>
								</a>
							</h2>
							<div class="flex flex-wrap items-center gap-1.5">
								<ChannelPill channel={release.channel} />
								{#if release.product === 'ugui'}
									<button
										type="button"
										title="This is just a library, you should only care about it if you're developing using it."
										class="inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
									>
										<Pill color="gray" text="library" />
									</button>
								{/if}
								{#if release.date}
									<ReleaseDate
										date={release.date}
										class="text-sm text-slate-500 dark:text-slate-400"
									/>
								{/if}
							</div>
						</div>
					</header>

					<CollapsibleReleaseNotes>
						<div class="release-content min-w-0 text-slate-700 dark:text-slate-300">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html release.content}
						</div>
					</CollapsibleReleaseNotes>

					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<footer
						class="mt-7 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5 dark:border-slate-800"
					>
						{#if hasRepack}
							<RepackDownloadButton channels={[release.channel]} variant="release" />
						{/if}
						<a href={release.href} class="app-link text-sm">
							{release.channel === 'nightly'
								? release.product === 'ugui'
									? 'View source'
									: 'View release'
								: 'View release'}
							<span aria-hidden="true">↗</span>
						</a>
						{#if release.sourceHref}
							<a href={release.sourceHref} class="app-link text-sm">Changelog</a>
						{/if}
						{#if release.product === 'redux' && repackRelease}
							<a
								href={`${resolve('/releases')}${release.channel === 'nightly' ? '?channel=nightly' : ''}#${repackRelease.id}`}
								class="app-link text-sm"
								onclick={(event) => showRepack(event, release.channel, repackRelease.id)}
								>Get it from the repack</a
							>
						{/if}
					</footer>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</div>
			</article>
		{:else}
			<div
				class="rounded-2xl border border-dashed border-slate-400 bg-slate-100/70 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-900/70"
			>
				<h2 class="text-2xl font-bold">No releases to show</h2>
				<p class="mt-3 text-slate-600 dark:text-slate-400">
					There aren’t any known releases for this selection yet. Try another product or channel.
				</p>
				{#if selectedChannels.length || selectedProducts.length}
					<button type="button" class="app-link mt-5" onclick={resetFilters}
						>Show all releases</button
					>
				{/if}
			</div>
		{/each}
	</div>
</main>

<style>
	.release-content {
		line-height: 1.8;
		overflow-wrap: anywhere;
	}
	.release-content :global(p + p),
	.release-content :global(ul),
	.release-content :global(ol),
	.release-content :global(pre),
	.release-content :global(blockquote) {
		margin-block: 1rem;
	}
	.release-content :global(h2),
	.release-content :global(h3),
	.release-content :global(h4),
	.release-content :global(h5),
	.release-content :global(h6) {
		margin-block: 1.5rem 0.5rem;
		font-weight: 700;
		color: var(--surface-content);
	}
	.release-content :global(h2),
	.release-content :global(h3) {
		font-size: 1.2rem;
	}
	.release-content :global(ul) {
		list-style: disc;
		padding-left: 1.5rem;
	}
	.release-content :global(ol) {
		list-style: decimal;
		padding-left: 1.5rem;
	}
	.release-content :global(li + li) {
		margin-top: 0.35rem;
	}
	.release-content :global(a) {
		color: var(--color-primary-600);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.release-content :global(code) {
		border-radius: 0.25rem;
		background: var(--surface-200);
		padding: 0.15rem 0.3rem;
		font-size: 0.85em;
	}
	.release-content :global(pre) {
		overflow-x: auto;
		border-radius: 0.75rem;
		background: var(--surface-200);
		padding: 1rem;
	}
	.release-content :global(pre code) {
		padding: 0;
	}
	.release-content :global(blockquote) {
		border-left: 3px solid var(--color-primary-400);
		padding-left: 1rem;
	}
	.release-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}
	.release-content :global(table) {
		display: block;
		max-width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
	}
	.release-content :global(th),
	.release-content :global(td) {
		border: 1px solid var(--surface-300);
		padding: 0.5rem 0.75rem;
	}
</style>
