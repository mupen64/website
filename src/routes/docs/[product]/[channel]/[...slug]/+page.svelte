<script lang="ts">
	import mupen64 from '$lib/assets/mupen64.svg';
	import sm64luaredux from '$lib/assets/sm64luaredux.png';

	let { data } = $props();
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 rounded-box border border-base-300 bg-base-300 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
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
					style:background-color={data.product === 'mupen64' ? '#ff0000' : '#ffffff'}
				></span>
				<h1 class="mt-4 text-3xl font-bold">{data.title}</h1>
			</div>

			<div class="join self-start">
				{#each data.channel_links as link, i (i)}
					<a
						href={link.href}
						class={`btn btn-sm join-item ${link.channel === data.channel ? 'btn-active' : 'btn-ghost'}`}
					>
						{link.channel}
					</a>
				{/each}
			</div>
		</div>

		<div class="mx-auto flex max-w-4xl flex-col items-start rounded-box border border-base-300 bg-base-200 p-6 shadow-sm">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</section>
</main>
