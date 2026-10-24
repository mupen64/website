<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	const contentId = $props.id();
	let expanded = $state(false);
	let overflowing = $state(false);

	function measure(node: HTMLDivElement) {
		function updateOverflow() {
			const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight);
			overflowing = node.scrollHeight > lineHeight * 20 + 1;
		}

		const observer = new ResizeObserver(updateOverflow);
		observer.observe(node);
		updateOverflow();
		return { destroy: () => observer.disconnect() };
	}
</script>

<div
	id={contentId}
	class="notes-preview"
	class:collapsed={!expanded}
	onfocusin={() => (expanded = true)}
>
	<div class="flow-root" use:measure>
		{@render children()}
	</div>
</div>
{#if overflowing}
	<button
		type="button"
		class="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
		aria-expanded={expanded}
		aria-controls={contentId}
		onclick={() => (expanded = !expanded)}
	>
		{expanded ? 'Show less' : 'Read more'}
	</button>
{/if}

<style>
	.notes-preview {
		line-height: 1.8;
	}

	.collapsed {
		max-height: 20lh;
		overflow: hidden;
	}
</style>
