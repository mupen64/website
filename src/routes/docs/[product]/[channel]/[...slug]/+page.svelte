<script lang="ts">
	import { resolve } from '$app/paths';
	import mupen64 from '$lib/assets/mupen64.svg';
	import sm64luaredux from '$lib/assets/sm64luaredux.webp';

	type DocsPageData = {
		product: 'mupen64' | 'redux';
		product_label: string;
		channel: 'stable' | 'nightly';
		channel_links: Array<{ channel: 'stable' | 'nightly'; href: string; available: boolean }>;


		content: string;
		title: string;
	};

	let { data }: { data: DocsPageData } = $props();

	let content_ref: HTMLDivElement | undefined = $state();

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

	$effect(() => {
		const container = content_ref;
		void data.content; // re-run when a different doc is rendered
		if (!container) {
			return;
		}

		const onClick = (event: MouseEvent) => {
			const target = (event.target as Element | null)?.closest?.('.doc-heading-link');
			if (!(target instanceof HTMLAnchorElement)) {
				return;
			}
			event.preventDefault();
			copy_heading_link(target);
		};

		container.addEventListener('click', onClick);
		return () => container.removeEventListener('click', onClick);
	});

	function channelLinkClass(active: boolean, index: number) {
		return [
			'px-3 py-1.5 text-sm font-medium capitalize transition-colors',
			index > 0 ? 'border-l border-slate-300 dark:border-slate-700' : '',
			active
				? 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white'
				: 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-300'
		].join(' ');
	}
</script>

<main>
	<section id="wiki" class="mx-auto max-w-6xl p-4 py-16">
		<div
			class="mx-auto mb-8 flex max-w-4xl flex-col items-start gap-4 rounded-xl border border-slate-300 bg-slate-200/80 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between dark:border-slate-700 dark:bg-slate-800/70"
		>
			<div>
				<p class="flex items-center gap-2 text-sm tracking-wide uppercase opacity-70">
					<img
						src={data.product === 'mupen64' ? mupen64 : sm64luaredux}
						alt=""
						class="h-5 w-5 object-contain"
					/>
					<span>{data.product_label}</span>
				</p>
				<span
					aria-hidden="true"
					class="mt-3 block h-px w-16 rounded-full"
					style:background-color={data.product === 'mupen64' ? '#dc2626' : '#64748b'}
				></span>
				<h1 class="mt-4 text-3xl font-bold">{data.title}</h1>

			</div>

				<div
					class="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700"
				>
					{#each data.channel_links as link, i (i)}
						<a
							href={resolve(link.href as `/docs/${string}`)}
							class={channelLinkClass(link.channel === data.channel, i)}
						>
							{link.channel}
						</a>
					{/each}
				</div>
			</div>

		<div
			bind:this={content_ref}
			class="mx-auto flex max-w-4xl flex-col items-start rounded-xl border border-slate-300 bg-slate-100/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</section>
</main>
