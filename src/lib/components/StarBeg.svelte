<script>
	import GithubLogo from '$lib/assets/GithubLogo.svelte';
	import { Card, Button } from 'flowbite-svelte';
	import { HeartSolid } from 'flowbite-svelte-icons';
	let { class: class_name = '' } = $props();
</script>

<Card class="flex flex-col items-center gap-4 p-4 text-center {class_name}">
	<div class="flex flex-row items-center gap-2 text-xl">
		<HeartSolid class="h-8 w-8 text-red-600" />
		<p>Appreciate the project?</p>
	</div>

	<p>You can star Mupen64 on GitHub if you think our work is valuable. It helps visibility.</p>

	<div class="flex flex-row gap-2">
		<Button size="sm" pill href="https://github.com/mupen64/mupen64-rr-lua">
			<GithubLogo class="w-5" />
			<span class="ml-2 whitespace-nowrap">Star on GitHub</span>
		</Button>
		<Button size="sm" pill href="https://github.com/mupen64">
			<GithubLogo class="w-5" />
			<span class="ml-2 whitespace-nowrap">Follow on GitHub</span>
		</Button>
		<Button size="sm" pill href="https://codeberg.org/mupen64">
			<HeartSolid />
			<span class="ml-2 whitespace-nowrap">Follow on Codeberg</span>
		</Button>
	</div>
</Card>
