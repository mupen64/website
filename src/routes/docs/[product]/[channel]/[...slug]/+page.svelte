<script lang="ts">
	let { data } = $props();
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="text-sm uppercase tracking-wide opacity-70">{data.product_label}</p>
				<h1 class="text-3xl font-bold">{data.title}</h1>
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

		<div class="mx-auto flex max-w-4xl flex-col items-start">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</section>
</main>
