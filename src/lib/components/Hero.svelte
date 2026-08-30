<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { BookOutline } from 'flowbite-svelte-icons';
	import GithubLogo from '$lib/assets/GithubLogo.svelte';

	let {
		name,
		description,
		logo,
		repository,
		docs = undefined,
		button = undefined,
		bg_color_from,
		bg_color_to,
		dark,
		version = undefined,
		version_hovered = false
	} = $props();

	const bg_style = $derived(`
	background: repeating-linear-gradient(45deg, ${bg_color_from} 0 1px, transparent 1px 10px), repeating-linear-gradient(-45deg, ${bg_color_from} 0 1px, transparent 1px 10px), radial-gradient(circle at center, ${bg_color_from}, ${bg_color_to});
	`);
</script>

<section
	class="-mt-16 border-b border-slate-200 p-16 pt-32 pb-24 shadow-lg dark:border-slate-700"
	style={bg_style}
>
	<div class="mx-auto max-w-6xl">
		<div
			class="flex flex-row flex-wrap items-center justify-center gap-12 {dark
				? 'text-white'
				: 'text-slate-950'}"
		>
			<img src={logo} alt="{name} Logo" fetchpriority="high" class="object-fit h-48 w-48" />
			<div class="flex flex-col gap-4">
				<div
					class="flex flex-col items-start justify-start gap-2 text-left text-5xl leading-tight font-bold md:flex-row md:items-center"
				>
					<p>{name}</p>
					{#if version}
						<span class="inline-block h-[1.25em] overflow-hidden leading-tight">
							<span
								class={`block transition-transform duration-200 ${version_hovered ? '-translate-y-full' : ''}`}
							>
								{version}
							</span>

							<span
								class={`block transition-transform duration-200 ${version_hovered ? '-translate-y-full' : ''}`}
							>
								Nightly
							</span>
						</span>
					{/if}
				</div>
				<p class="text-center text-lg md:text-left">{description}</p>
				<div class="flex flex-wrap items-center justify-center gap-4 md:justify-start">
					{#if button}
						{@render button(dark)}
					{/if}

					{#if docs}
						<Button
							href={docs}
							color={dark ? 'light' : 'dark'}
							class="inline-flex items-center gap-2 shadow-sm"
						>
							<BookOutline class="h-6 w-6" />
							<span>Docs</span>
						</Button>
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
