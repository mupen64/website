<script lang="ts">
	import { onMount } from 'svelte';
	import { formatRelativeTime } from '$lib/helpers/RelativeTime';

	let { date, class: className = '' }: { date: string; class?: string } = $props();
	let now = $state<number | null>(null);
	const fullDate = $derived(
		new Intl.DateTimeFormat('en', {
			dateStyle: 'long',
			timeStyle: 'short',
			timeZone: 'UTC'
		}).format(new Date(date)) + ' UTC'
	);

	onMount(() => {
		now = Date.now();
		const timer = window.setInterval(() => (now = Date.now()), 60_000);
		return () => window.clearInterval(timer);
	});
</script>

<time datetime={date} title={fullDate} class={className}>
	{now === null ? fullDate : formatRelativeTime(date, now)}
</time>
