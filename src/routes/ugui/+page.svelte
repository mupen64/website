<script lang="ts">
	import ugui from '$lib/assets/ugui.png';
	import github from '$lib/assets/github.svg';
</script>

<main>
	<section class="bg-hero p-16 shadow-md">
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-row flex-wrap items-center justify-center gap-12 text-white">
				<img
					src={ugui}
					alt="Mupen64 Logo"
					class="object-fit w-48"
				/>
				<div class="flex flex-col gap-4">
					<div class="flex flex-row items-center gap-2 text-5xl leading-tight font-bold">
						<p>ugui</p>
						<p
							class="bg-gradient-to-b from-white to-black bg-clip-text text-transparent"
							style="-webkit-text-stroke: 1px white;"
						>
							2.0.0
						</p>
					</div>
					<p class="text-lg">Flexible immediate-mode Lua GUI library.</p>
					<div class="flex flex-wrap items-center justify-center gap-4">
						<a href="https://github.com/mupen64/ugui" class="button">
							<img src={github} alt="Github Logo" class="invert" />
							<p>See on GitHub</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="about" class="mb-12 p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>About</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>
			<div class="flex flex-col items-center justify-center">
				<p>
					ugui is a flexible immediate-mode Lua GUI library used by projects in the Mupen64 Lua
					script ecosystem.
				</p>
			</div>
		</div>
	</section>
</main>

<style lang="tailwindcss">
	.bg-hero {
		background: linear-gradient(0deg, #0000ff, rgb(39, 17, 209));
	}
</style>
