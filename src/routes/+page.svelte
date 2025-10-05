<script lang="ts">
	import mupen64 from '$lib/assets/mupen64.svg';
	import github from '$lib/assets/github.svg';
	import lua from '$lib/assets/lua.svg';
	import demo from '$lib/assets/demo.png';
</script>

<main>
	<section class="bg-hero p-16 shadow-md">
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-row flex-wrap items-center justify-center gap-12 text-white">
				<img src={mupen64} alt="Mupen64 Logo" class="object-fit w-48" />
				<div class="flex flex-col gap-4">
					<div class="flex flex-row items-center gap-2 text-5xl leading-tight font-bold">
						<p>Mupen64</p>
						<p
							class="bg-gradient-to-b from-white to-black bg-clip-text text-transparent"
							style="-webkit-text-stroke: 1px white;"
						>
							1.3.0-4
						</p>
					</div>
					<p class="text-lg">Advanced N64 TASing emulator.</p>
					<div class="flex flex-wrap items-center justify-center gap-4">
						<a
							href="https://github.com/mupen64/repack/archive/refs/heads/main.zip"
							class="button primary">Download Repack</a
						>
						<a href="https://github.com/mupen64/mupen64-rr-lua" class="button">
							<img src={github} alt="Github Logo" class="invert" />
							<p>See on GitHub</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="showcase" class="p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>Showcase</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>
			<div class="flex flex-col items-center justify-center">
				<img src={demo} alt="Demo" class="object-contain" />
			</div>
		</div>
	</section>

	<section id="features" class="p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>Features</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>

			<div class="flex flex-row flex-wrap justify-center gap-8">
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">🔋 Batteries Included</p>
					<p class="text-sm">
						The Mupen64 Repack comes with plugins, Lua scripts, and more to get you TASing right
						away.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">⌛ Rerecording</p>
					<p class="text-sm">
						Features the basics like movies and savestates, but also advanced tools like Piano Roll
						and Seeking.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">⚡ High Performance</p>

					<p class="text-sm">
						Mupen64 and its first-party plugins are optimized for TASing workloads and deliver
						consistently high performance.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="flex flex-row items-center gap-2 text-xl font-semibold">
						<img src={lua} alt="Lua Logo" class="w-8" />
						Lua Integration
					</p>

					<p class="text-sm">
						Contains a comprehensive Lua API which allows automating and enhancing your TASing
						workflow.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">🌳 Rich Ecosystem</p>
					<p class="text-sm">
						Rich ecosystem of advanced TASing tools and plugins geared towards increasing TASer
						productivity.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">🔌 Extendable</p>
					<p class="text-sm">The GUI can be extended seamlessly using Lua APIs.</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">💪 Poweruser-Friendly</p>
					<p class="text-sm">
						Features a Command Palette and a hotkey for each action to give powerusers the freedom
						they need.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">🎥 Video Capture</p>
					<p class="text-sm">
						Capture stable and perfectly synchronized video directly from the emulator faster than
						realtime using VFW or FFmpeg.
					</p>
				</div>
				<div class="card w-80 max-w-72">
					<p class="text-xl font-semibold">🎮 Cheats</p>
					<p class="text-sm">Support for GameShark cheats and GS button emulation.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="wiki" class="p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>Wiki</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>

			<div class="flex flex-row flex-wrap justify-center gap-8">
				<p>
					Visit the <a class="link" href="https://github.com/mupen64/mupen64-rr-lua/wiki"
						>Mupen64 Wiki</a
					> for documentation about Mupen64.
				</p>
			</div>
		</div>
	</section>

	<section id="projects" class="p-16 pb-0">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>Projects</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>

			<div class="flex w-full flex-col items-center justify-center gap-4 [&>*]:min-w-50 [&>*]:text-center">
				<p>
					In addition to Mupen64 itself, the Mupen64 organization also officially maintains <br />
					plugins and TAS utilities.
				</p>

				<a class="link" href="/ugui">ugui</a>
				<a class="link" href="/sm64luaredux">SM64 Lua Redux</a>
			</div>
		</div>
	</section>

	<section id="projects" class="p-16">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 flex flex-row items-center justify-center gap-4 text-3xl font-bold">
				<hr class="w-15 border-2 border-dashed border-red-600" />
				<p>About Us</p>
				<hr class="w-15 border-2 border-dashed border-red-600" />
			</div>

			<div class="flex w-full flex-col items-center justify-center gap-8">
				<p class="text-center">
					The Mupen64 Organization is a shared-ownership organization maintained by developers
					around the world.
					<br />
					Feel free to contribute!
				</p>
			</div>
		</div>
	</section>
</main>

<style lang="tailwindcss">
	.bg-hero {
		background: linear-gradient(45deg, #ff0000, rgb(141, 12, 12));
	}
</style>
