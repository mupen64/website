<script lang="ts">
	import stroop from '$lib/assets/stroop.svg';
	import Hero from '$lib/components/Hero.svelte';
	import Title from '$lib/components/Title.svelte';
	import { resolve } from '$app/paths';
</script>

<main>
	<Hero
		name="STROOP Original"
		description="Advanced diagnostic tool for Super Mario 64."
		logo={stroop}
		repository="https://github.com/SM64-TAS-ABC/STROOP"
		docs={resolve('/docs/[product]', { product: 'stroop-original' })}
		bg_color_from="#ffffff"
		bg_color_to="#dddddd"
		dark={false}
	></Hero>

	<section id="about" class="mb-12 p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<Title id="about">About</Title>
			<div class="flex flex-col items-center justify-center">
				<p>STROOP is a powerful diagnostic tool for Super Mario 64.</p>
				<p>
					This is the original STROOP. For the refactored fork with better performance and new
					features, see <a class="app-link" href="/stroop-refactor">STROOP Refactor</a>.
				</p>
				<p>
					This version is provided because STROOP Refactor's feature set doesn't yet match the
					original's.
				</p>
			</div>
		</div>
	</section>
</main>
