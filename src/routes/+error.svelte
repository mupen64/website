<script lang="ts">
	import { page } from '$app/state';
	import org from '$lib/assets/org.svg';
	import { resolve } from '$app/paths';

	const status = $derived(
		(page.error as (Error & { status?: number }) | null | undefined)?.status ?? 'Error'
	);
</script>

<main class="h-full">
	<div class="flex h-full items-center justify-center p-8">
		<div
			class="w-full max-w-xl rounded-2xl border border-dashed border-slate-400/70 bg-slate-100/90 p-10 text-center shadow-sm backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-900/90"
		>
			<img src={org} alt="Mupen64 Organization Logo" class="object-fit mx-auto mb-6 w-24" />
			<p class="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
				{status}
				{#if page.error?.message}
					({page.error?.message})
				{/if}
			</p>
			<p class="mb-6 text-slate-700 dark:text-slate-300">
				The page you're looking for may have moved or never existed. Try one of the links below, or
				use the navigation bar to find what you need.
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4">
				<a class="app-link font-semibold" href={resolve('/')}>Back to the Homepage</a>
				<a class="app-link font-semibold" href={resolve('/docs')}>Browse the Docs</a>
			</div>
		</div>
	</div>
</main>
