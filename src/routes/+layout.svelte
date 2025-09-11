<script lang="ts">
	import '../app.css';
	import mupen64 from '$lib/assets/mupen64.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={mupen64} />
</svelte:head>

{@render children?.()}

<footer class="w-screen">
	<hr class="border-dashed border-gray-500" />
	<div class="mt-10 mb-10 flex flex-col items-center justify-center">
		<a class="link" href="https://github.com/mupen64/website">Website source on GitHub</a>
		<p>© 2025 Mupen64 Organization. Licensed under GNU GPL v2 License.</p>
	</div>
</footer>
