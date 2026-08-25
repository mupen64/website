<script lang="ts">
	import Pill from './Pill.svelte';

	let { channel }: { channel: string } = $props();
</script>

<Pill color={channel === 'stable' ? 'green' : 'red'} text={channel} />
