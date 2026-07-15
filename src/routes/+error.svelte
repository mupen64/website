<script>
	import { page } from '$app/state';
</script>

<main>
	<section class="bg-gradient-to-br from-red-700 to-red-900 p-16 shadow-md dark:from-red-900 dark:to-red-950">
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-col items-center justify-center gap-12 text-white">
				<p class="text-4xl">{page.error?.message}</p>
				<a
					class="font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:text-red-100"
					href="https://mupen64.com"
				>
					Back to the Homepage
				</a>
			</div>
		</div>
	</section>
</main>
