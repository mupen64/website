<script lang="ts">
	import Pill from './Pill.svelte';

	let {
		channel,
		active = true,
		onclick
	}: { channel: string; active?: boolean; onclick?: () => void } = $props();

	const color = $derived(active ? (channel === 'stable' ? 'green' : 'red') : 'gray');
</script>

{#if onclick}
	<button
		type="button"
		aria-pressed={active}
		onpointerdown={(event) => event.preventDefault()}
		{onclick}
		class="inline-flex rounded-full transition duration-150 hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
	>
		<Pill {color} text={channel} />
	</button>
{:else}
	<Pill {color} text={channel} />
{/if}
