<script lang="ts">

	import { resolve } from '$app/paths';
	import mupen64Icon from '$lib/assets/mupen64.svg';
	import reduxIcon from '$lib/assets/sm64luaredux.webp';
	import ChannelPill from './ChannelPill.svelte';

	type DocsSearchItem = {
		title: string;
		href: string;
		product: string;
		channel: string;
		content: string;
	};

	let { items }: { items: DocsSearchItem[] } = $props();
	let query = $state('');
	let focused = $state(false);
	let selectedChannels = $state(['stable', 'nightly']);
	let searchInput: HTMLInputElement;

	function focusSearch(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			searchInput?.focus();
			searchInput?.select();
		}
	}

	const results = $derived.by(() => {
		const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return [];

		return items
			.map((item) => {
				const title = item.title.toLowerCase();
				const content = item.content.toLowerCase();
				const searchable = `${title} ${content}`;
				const matches = terms.filter((term) => searchable.includes(term)).length;
				if (matches !== terms.length || !selectedChannels.includes(item.channel)) return null;

				const titleMatches = terms.filter((term) => title.includes(term)).length;
				return { item, score: titleMatches * 10 + matches };
			})
			.filter((result): result is { item: DocsSearchItem; score: number } => result !== null)
			.sort(
								(a, b) =>
									b.score - a.score ||
									(a.item.channel === 'stable' ? 0 : 1) - (b.item.channel === 'stable' ? 0 : 1) ||
									a.item.title.localeCompare(b.item.title)
							)
			.slice(0, 8)
			.map(({ item }) => item);
	});

	const showResults = $derived(focused && query.trim().length > 0);

	function closeResults() {
		setTimeout(() => (focused = false), 100);
	}

	function toggleChannel(channel: string) {
		selectedChannels = selectedChannels.includes(channel)
			? selectedChannels.filter((selected) => selected !== channel)
			: [...selectedChannels, channel];
	}

	function getProductIcon(product: string) {
		return product === 'Mupen64' ? mupen64Icon : reduxIcon;
	}

	function highlightParts(text: string) {
		const terms = query.trim().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return [{ text, matched: false }];

		const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
		const parts: { text: string; matched: boolean }[] = [];
		let lastIndex = 0;

		for (const match of text.matchAll(regex)) {
			const index = match.index ?? 0;
			if (index > lastIndex) parts.push({ text: text.slice(lastIndex, index), matched: false });
			parts.push({ text: match[0], matched: true });
			lastIndex = index + match[0].length;
		}

		if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), matched: false });
		return parts;
	}

	function resolveDocHref(href: string) {
		const [, , product, channel, ...slug] = href.split('/');
		return resolve('/docs/[product]/[channel]/[...slug]', {
			product,
			channel,
			slug: slug.map(decodeURIComponent).join('/')
		});
	}
</script>

<svelte:window onkeydown={focusSearch} />

<div class="relative w-full md:mx-4 md:flex-1">
	<label for="docs-search" class="sr-only">Search documentation</label>
	<div class="relative">
		<svg
			aria-hidden="true"
			class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-900 dark:text-white"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
		>
			<circle cx="8.5" cy="8.5" r="5.5" />
			<path d="m13 13 4 4" stroke-linecap="round" />
		</svg>
		<input
			id="docs-search"
			type="search"
			bind:this={searchInput}
			bind:value={query}
			placeholder="Search documentation... (Ctrl + K)"
			autocomplete="off"
			aria-label="Search documentation"
			aria-controls="docs-search-results"
			onfocus={() => (focused = true)}
			onblur={closeResults}
			onkeydown={(event) => event.key === 'Escape' && (focused = false)}
			class="w-full rounded-lg border border-slate-900/40 bg-transparent py-2 pr-3 pl-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/40 dark:text-slate-100"
		/>
	</div>

	{#if showResults}
		<div
			id="docs-search-results"
			class="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-300 bg-slate-100/95 p-2 text-slate-900 shadow-xl md:left-auto md:w-[min(32rem,calc(100vw-2rem))] dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100"
		>
			<div class="flex items-center gap-2 border-b border-slate-300 px-3 pb-2 dark:border-slate-600">
				<span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Channels:</span>
				{#each ['stable', 'nightly'] as channel (channel)}
					<ChannelPill
						{channel}
						active={selectedChannels.includes(channel)}
						onclick={() => toggleChannel(channel)}
					/>
				{/each}
			</div>
			<div role="listbox" aria-label="Search results" class="pt-2">
			{#if results.length > 0}
				{#each results as result (result.href)}
					<a
						href={resolveDocHref(result.href)}
						role="option"
						aria-selected="false"
						class="block rounded-lg px-3 py-2 transition-colors hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
					>
						<span class="flex items-center gap-2 text-base font-semibold">
							<img src={getProductIcon(result.product)} alt="" class="h-5 w-5 shrink-0 object-contain" />
							<span class="min-w-0 truncate">
								{#each highlightParts(result.title) as part, index (index)}
									{#if part.matched}<span class="font-semibold">{part.text}</span>{:else}{part.text}{/if}
								{/each}
							</span>
							<ChannelPill channel={result.channel} />
						</span>
						<span class="mt-1 line-clamp-2 block text-sm text-slate-600 dark:text-slate-300">
							{#each highlightParts(`${result.content.slice(0, 150)}${result.content.length > 150 ? '…' : ''}`) as part, index (index)}
								{#if part.matched}<span class="font-semibold text-slate-900 dark:text-slate-100">{part.text}</span>{:else}{part.text}{/if}
							{/each}
						</span>
					</a>
				{/each}
			{:else}
				<p class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No documentation found.</p>
			{/if}
			</div>
		</div>
	{/if}
</div>
