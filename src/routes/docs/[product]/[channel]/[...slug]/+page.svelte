<script lang="ts">

	import { resolve } from '$app/paths';
	import mupen64 from '$lib/assets/mupen64.svg';
	import sm64luaredux from '$lib/assets/sm64luaredux.png';

	type DocsPageData = {
		product: 'mupen64' | 'redux';
		product_label: string;
		channel: 'stable' | 'nightly';
		channel_links: Array<{ channel: 'stable' | 'nightly'; href: string; available: boolean }>;
		docs: Array<{ slug: string; title: string; href: string; channel: 'stable' | 'nightly' }>;
		current_doc_href: string;
		content: string;
		title: string;
	};

	let { data }: { data: DocsPageData } = $props();

	function handle_doc_change(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		window.location.assign(target.value);
	}

	function channelLinkClass(active: boolean, index: number) {
		return [
			'px-3 py-1.5 text-sm font-medium capitalize transition-colors',
			index > 0 ? 'border-l border-slate-300 dark:border-slate-700' : '',
			active
				? 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white'
				: 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-300'
		].join(' ');
	}
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div
			class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 rounded-xl border border-slate-300 bg-slate-200/80 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between dark:border-slate-700 dark:bg-slate-800/70"
		>
			<div>
				<p class="flex items-center gap-2 text-sm uppercase tracking-wide opacity-70">
					<img
						src={data.product === 'mupen64' ? mupen64 : sm64luaredux}
						alt=""
						class="h-5 w-5 object-contain"
					/>
					<span>{data.product_label}</span>
				</p>
				<span
					aria-hidden="true"
					class="mt-3 block h-px w-16 rounded-full"
					style:background-color={data.product === 'mupen64' ? '#dc2626' : '#64748b'}
				></span>
				<h1 class="mt-4 text-3xl font-bold">{data.title}</h1>
				<select
					class="mt-4 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-primary-400 dark:focus:ring-primary-400/30"
					aria-label="Choose a document"
					value={data.current_doc_href}
					onchange={handle_doc_change}
				>
					{#each data.docs as doc (doc.href)}
						<option value={doc.href}>{doc.title}</option>
					{/each}
				</select>
			</div>

			<div class="inline-flex self-start overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
				{#each data.channel_links as link, i (i)}
					<a href={resolve(link.href as `/docs/${string}`)} class={channelLinkClass(link.channel === data.channel, i)}>
						{link.channel}
					</a>
				{/each}
			</div>
		</div>

		<div
			class="mx-auto flex max-w-4xl flex-col items-start rounded-xl border border-slate-300 bg-slate-100/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</section>
</main>
