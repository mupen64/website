<script lang="ts">
	import { ChevronDownOutline, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { SvelteSet } from 'svelte/reactivity';
	import mupen64Icon from '$lib/assets/mupen64.svg';
	import reduxIcon from '$lib/assets/sm64luaredux.webp';
	import stroopIcon from '$lib/assets/stroop.svg';
	import type { DocsTreeNode } from '$lib/server/docs';
	import DocsTree from './DocsTree.svelte';
	import ChannelPill from './ChannelPill.svelte';

	let { nodes, activeHref, onNavigate }: {
		nodes: DocsTreeNode[];
		activeHref: string;
		onNavigate?: () => void;
	} = $props();

	function expandableNodeIds(items: DocsTreeNode[]): string[] {
		return items.flatMap((item) => {
			if (!item.children?.length) return [];
			const descendants = item.channel === 'nightly' ? [] : [item.id];
			return [...descendants, ...expandableNodeIds(item.children)];
		});
	}

	function containsActiveHref(node: DocsTreeNode): boolean {
		return (
			(node.href !== undefined &&
				(activeHref === node.href || activeHref.startsWith(`${node.href}/`))) ||
			(node.children?.some(containsActiveHref) ?? false)
		);
	}

	let expanded = new SvelteSet<string>();
	let initialized = false;

	$effect(() => {
		if (!initialized) {
			for (const id of expandableNodeIds(nodes)) expanded.add(id);
			initialized = true;
		}

		for (const node of nodes) {
			if (node.channel === 'nightly' && node.children?.length && containsActiveHref(node)) {
				expanded.add(node.id);
			}
		}
	});

	function toggle(node: DocsTreeNode) {
		if (!node.children?.length) return;
		if (expanded.has(node.id)) expanded.delete(node.id);
		else expanded.add(node.id);
	}
</script>

<ul class="space-y-0.5" aria-label="Documentation pages">
	{#each nodes as node (node.id)}
		<li>
			<div class="flex items-center gap-1">
				{#if node.children?.length}
					<button
						type="button"
						class="flex h-6 w-5 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
						aria-label={`${expanded.has(node.id) ? 'Collapse' : 'Expand'} ${node.label}`}
						aria-expanded={expanded.has(node.id)}
						onclick={() => toggle(node)}
					>
						<span class:rotate-180={expanded.has(node.id)} class="transition-transform">
							<ChevronDownOutline class="h-4 w-4" />
						</span>
					</button>
				{:else}
					<span class="w-5 shrink-0"></span>
				{/if}

				{#if node.href}
					<a
						href={node.href}
						class={`min-w-0 flex-1 rounded-md px-2 py-1.5 text-sm hover:bg-slate-200/80 dark:hover:bg-slate-800/80 ${activeHref === node.href ? 'bg-primary-100 font-semibold text-primary-800 dark:bg-primary-900/40 dark:text-primary-200' : 'text-slate-700 dark:text-slate-300'}`}
						onclick={onNavigate}
					>
						<span class="flex min-w-0 items-center gap-1.5 truncate">
							{#if node.icon}
								<img
									src={node.icon === 'mupen64' ? mupen64Icon : node.icon === 'redux' ? reduxIcon : stroopIcon}
									alt=""
									class="h-4 w-4 shrink-0 rounded-sm object-contain"
								/>
							{/if}
							<span class="truncate">{node.label}</span>
							{#if node.external}
								<ArrowUpRightFromSquareOutline class="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
							{/if}
							{#if node.channel}
								<ChannelPill channel={node.channel} />
							{/if}
						</span>
					</a>
				{:else}
					<span class="min-w-0 flex-1 px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{node.label}</span>
				{/if}
			</div>

			{#if node.children?.length && expanded.has(node.id)}
				<div class="ml-2 border-l border-slate-300 pl-1 dark:border-slate-700">
					<DocsTree nodes={node.children} {activeHref} {onNavigate} />
				</div>
			{/if}
		</li>
	{/each}
</ul>

