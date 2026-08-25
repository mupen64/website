<script lang="ts">
	type PillColor = 'green' | 'red' | 'gray';

	let { color, text }: { color: PillColor; text: string } = $props();

	const colorClasses: Record<PillColor, string> = {
		green: 'border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
		red: 'border border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300',
		gray: 'border border-slate-300 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
	};
</script>

<span
	class={`inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${colorClasses[color]}`}
	>{text}</span
>
