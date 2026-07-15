<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import GithubLogo from '$lib/assets/GithubLogo.svelte';

	let {
		name,
		description,
		logo,
		repository,
		button = undefined,
		bg_color_from,
		bg_color_to,
		dark
	} = $props();

	const bg_style = $derived(`
	background: repeating-linear-gradient(45deg, ${bg_color_from} 0 1px, transparent 1px 20px), repeating-linear-gradient(-45deg, ${bg_color_from} 0 1px, transparent 1px 20px), linear-gradient(45deg, ${bg_color_from}, ${bg_color_to});
	`);
</script>

<section class="border-b border-slate-200 p-16 shadow-lg dark:border-slate-700" style={bg_style}>
	<div class="mx-auto max-w-6xl">
		<div
			class="flex flex-row flex-wrap items-center justify-center gap-12 {dark
				? 'text-white'
				: 'text-slate-950'}"
		>
			<img src={logo} alt="{name} Logo" class="object-fit w-48" />
			<div class="flex flex-col gap-4">
				<div
					class="flex flex-col items-center gap-2 text-center text-5xl leading-tight font-bold md:flex-row"
				>
					<p>{name}</p>
				</div>
				<p class="text-center text-lg md:text-left">{description}</p>
				<div class="flex flex-wrap items-center justify-center gap-4 md:justify-start">
					{#if button}
						{@render button(dark)}
					{/if}

					<Button
						href={repository}
						color={dark ? 'light' : 'dark'}
						class="inline-flex items-center gap-2 shadow-sm"
					>
						<GithubLogo class="h-6 w-6"></GithubLogo>
						<span>See on GitHub</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>
