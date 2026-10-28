<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline, QuestionCircleSolid, WindowsSolid } from 'flowbite-svelte-icons';
	import {
		downloadUrls,
		startDownloadFromChannel,
		type Channel
	} from '$lib/helpers/RepackDownloadHelper';
	import ChannelPill from '$lib/components/ChannelPill.svelte';
	import Pill from '$lib/components/Pill.svelte';

	let {
		channels,
		variant,
		released150 = true,
		onNightlyHover
	}: {
		channels: ('stable' | 'nightly')[];
		variant: 'home' | 'release';
		released150?: boolean;
		onNightlyHover?: (hovered: boolean) => void;
	} = $props();

	function handleDownload(event: MouseEvent, channel: Channel) {
		event.preventDefault();
		const cleanup = startDownloadFromChannel(channel);
		setTimeout(() => {
			goto(resolve(`/downloaded/${channel}`));
			setTimeout(() => cleanup(), 1000);
		}, 300);
	}
</script>

{#if variant === 'home'}
	<div class="flex w-full flex-nowrap items-stretch justify-center gap-2 md:w-auto">
		{#if channels.includes('stable')}
			{@const primary = released150 ? 'stable-windows-x64' : 'stable-windows-x86'}
			<Button
				href={downloadUrls[primary]}
				color="blue"
				class="inline-flex w-fit max-w-full items-center justify-start gap-2 border-b-4 border-b-blue-900 text-left active:mt-1 active:border-b-0"
				onclick={(event: MouseEvent) => handleDownload(event, primary)}
			>
				<WindowsSolid class="h-5 w-5 shrink-0" />
				<span>Download {released150 ? '64' : '32'}-bit for Windows</span>
			</Button>
		{/if}
		<Button
			type="button"
			aria-label="More download options"
			color="blue"
			class="inline-flex items-center gap-2 self-stretch border-b-4 border-b-blue-900 active:mt-1 active:border-b-0"
		>
			<ChevronDownOutline class="h-5 w-5" />
		</Button>

		<Dropdown placement="bottom-end" class="list-none">
			{#if released150 && channels.includes('stable')}
				<DropdownItem
					href={downloadUrls['stable-windows-x86']}
					onclick={(event) => handleDownload(event, 'stable-windows-x86')}
				>
					<div class="flex w-full flex-col items-start text-left leading-tight">
						<div class="flex flex-row items-center gap-1">
							<WindowsSolid class="mb-px h-4 w-4" />
							<p class="text-base">Windows (32-bit)</p>
							<ChannelPill channel="stable" />
						</div>
						<p class="text-xs font-light opacity-70">
							Compatible with Jabo's plugins. Not recommended for general use.
						</p>
					</div>
				</DropdownItem>
			{/if}
			{#if channels.includes('nightly')}
				<DropdownItem
					class="group/nightly"
					href={downloadUrls['nightly-windows-x86']}
					onmouseenter={() => onNightlyHover?.(true)}
					onmouseleave={() => onNightlyHover?.(false)}
					onclick={(event) => handleDownload(event, 'nightly-windows-x86')}
				>
					<div class="flex w-full flex-col items-start text-left leading-tight">
						<div class="flex flex-row items-center gap-1">
							<WindowsSolid class="mb-px h-4 w-4" />
							<p class="text-base">Download (32-bit)</p>
							<ChannelPill channel="nightly" />
						</div>
						<p class="text-xs font-light opacity-70">
							Bleeding-edge features with potential instability
						</p>
					</div>
				</DropdownItem>
				<DropdownItem
					class="group/nightly"
					href={downloadUrls['nightly-windows-x64']}
					onmouseenter={() => onNightlyHover?.(true)}
					onmouseleave={() => onNightlyHover?.(false)}
					onclick={(event) => handleDownload(event, 'nightly-windows-x64')}
				>
					<div class="flex w-full flex-col items-start text-left leading-tight">
						<div class="flex flex-row items-center gap-1">
							<WindowsSolid class="mb-px h-4 w-4" />
							<p class="text-base">Download (64-bit)</p>
							<ChannelPill channel="nightly" />
						</div>
						<p class="text-xs font-light opacity-70">
							Bleeding-edge features with potential instability
						</p>
					</div>
				</DropdownItem>
			{/if}
			<DropdownItem>
				<div class="flex w-full flex-col items-start text-left leading-tight">
					<div class="flex flex-row items-center gap-1">
						<QuestionCircleSolid class="mb-px h-4 w-4" />
						<p class="text-base">Download for Linux</p>
						<Pill color="gray" text="Unavailable" />
					</div>
					<p class="text-xs font-light opacity-70">
						To run Mupen64 on Linux, use <a class="app-link" href="https://usebottles.com/"
							>Bottles</a
						>.<br />
						Linux builds coming soon.
					</p>
				</div>
			</DropdownItem>
		</Dropdown>
	</div>
{:else}
	{#each channels as channel (channel)}
		{@const download64 = `${channel}-windows-x64` as Channel}
		{@const download32 = `${channel}-windows-x86` as Channel}
		<div class="flex items-stretch gap-2">
			<Button
				href={downloadUrls[download64]}
				color={channel === 'nightly' ? 'red' : 'green'}
				class={`inline-flex h-9 items-center gap-2 border-b-4 active:mt-1 active:border-b-0 ${channel === 'nightly' ? 'border-b-red-900' : 'border-b-green-900'}`}
				onclick={(event: MouseEvent) => handleDownload(event, download64)}
			>
				<WindowsSolid class="h-5 w-5 shrink-0" />
				<span>Download 64-bit for Windows</span>
			</Button>
			<Button
				type="button"
				aria-label="More download options"
				color={channel === 'nightly' ? 'red' : 'green'}
				class={`inline-flex h-9 items-center self-stretch border-b-4 active:mt-1 active:border-b-0 ${channel === 'nightly' ? 'border-b-red-900' : 'border-b-green-900'}`}
			>
				<ChevronDownOutline class="h-5 w-5" />
			</Button>
			<Dropdown placement="bottom-end" class="list-none">
				<DropdownItem
					href={downloadUrls[download32]}
					onclick={(event) => handleDownload(event, download32)}
				>
					<div class="flex flex-col items-start text-left leading-tight">
						<div class="flex items-center gap-1">
							<WindowsSolid class="h-4 w-4" /><span>Windows (32-bit)</span><ChannelPill {channel} />
						</div>
						<p class="text-xs font-light opacity-70">
							{channel === 'stable'
								? "Compatible with Jabo's plugins. Not recommended for general use."
								: 'Bleeding-edge features with potential instability'}
						</p>
					</div>
				</DropdownItem>
			</Dropdown>
		</div>
	{/each}
{/if}
