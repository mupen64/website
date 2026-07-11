<script lang="ts">
	let { data } = $props();
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-3xl font-bold">{data.product_label} Documentation</h1>
				<p class="mt-2 text-base-content/70">Choose a channel to browse the synced docs.</p>
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

		<div class="mx-auto max-w-4xl rounded-box border border-base-300 bg-base-200 p-8 text-center">
			<p class="text-xl font-semibold">No documentation available for this channel.</p>
			<p class="mt-2 opacity-80">Check back later!</p>
		</div>
	</section>
</main>
