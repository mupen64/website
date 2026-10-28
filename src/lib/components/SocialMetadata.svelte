<script lang="ts">
	import { page } from '$app/state';
	import { SITE_ORIGIN } from '$lib/site';

	let { title, description }: { title: string; description: string } = $props();
	const url = $derived(`${SITE_ORIGIN}${page.url.pathname}`);
	const image = `${SITE_ORIGIN}/img/banner.webp`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content="Mupen64 Organization" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1137" />
	<meta property="og:image:height" content="561" />
	<meta property="og:image:alt" content="Mupen64 banner" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
