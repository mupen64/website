<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, id = '' }: { children?: Snippet; id?: string } = $props();

	const check_icon_svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`;

	async function write_clipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			try {
				const textarea = document.createElement('textarea');
				textarea.value = text;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.append(textarea);
				textarea.select();
				const ok = document.execCommand('copy');
				textarea.remove();
				return ok;
			} catch {
				return false;
			}
		}
	}

	function copy_heading_link(link: HTMLAnchorElement) {
		const id = link.getAttribute('href')?.replace(/^#/, '');
		if (!id) {
			return;
		}

		const url = `${location.origin}${location.pathname}${location.search}#${id}`;
		history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);

		write_clipboard(url).then((ok) => {
			if (!ok) {
				return;
			}

			const original_html = link.innerHTML;
			const original_label = link.getAttribute('aria-label') ?? '';
			link.classList.add('copied');
			link.innerHTML = check_icon_svg;
			link.setAttribute('aria-label', 'Link copied to clipboard');

			window.setTimeout(() => {
				link.innerHTML = original_html;
				link.classList.remove('copied');
				link.setAttribute('aria-label', original_label);
			}, 1500);
		});
	}

	function onClick(event: MouseEvent) {
		event.preventDefault();
		copy_heading_link(event.currentTarget as HTMLAnchorElement);
	}
</script>

<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
	<div class="flex w-full max-w-3xs flex-col gap-4">
		<hr class="w-full border-2 border-dashed border-red-800" />
		<hr class="w-full border-2 border-dashed border-red-800" />
	</div>
	<span class="text-red-600" aria-hidden="true">[</span>
	<h1 {id} class="doc-heading scroll-mt-24 pr-8 pl-8 whitespace-nowrap">
		{@render children?.()}
		{#if id}
			<a
				class="doc-heading-link"
				href={`#${id}`}
				title="Copy link to heading"
				aria-label="Copy link to heading"
				onclick={onClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
					/></svg
				>
			</a>
		{/if}
	</h1>
	<span class="text-red-600" aria-hidden="true">]</span>
	<div class="flex w-full max-w-3xs flex-col gap-4">
		<hr class="w-full border-2 border-dashed border-red-800" />
		<hr class="w-full border-2 border-dashed border-red-800" />
	</div>
</div>

<style>
	.doc-heading-link {
		left: 0;
	}
</style>
