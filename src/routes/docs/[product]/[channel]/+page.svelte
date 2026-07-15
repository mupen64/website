<script lang="ts">
	import mupen64 from '$lib/assets/mupen64.svg';
	import sm64luaredux from '$lib/assets/sm64luaredux.png';

	let { data } = $props();

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
		<div class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
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
				<h1 class="mt-4 text-3xl font-bold">Documentation</h1>
				<p class="mt-2 text-slate-600 dark:text-slate-400">Choose a channel to browse the synced docs.</p>
			</div>

			<div class="inline-flex self-start overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
				{#each data.channel_links as link, i (i)}
					<a href={link.href} class={channelLinkClass(link.channel === data.channel, i)}>
						{link.channel}
					</a>
				{/each}
			</div>
		</div>

		<div
			class="mx-auto max-w-4xl rounded-xl border border-slate-300 bg-slate-100/90 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
		>
			<p class="text-xl font-semibold">No documentation available for this channel.</p>
			<p class="mt-2 opacity-80">Check back later!</p>
		</div>
	</section>
</main>
