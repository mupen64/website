const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
const units: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 31_536_000],
	['month', 2_592_000],
	['week', 604_800],
	['day', 86_400],
	['hour', 3_600],
	['minute', 60]
];

export function formatRelativeTime(date: string, now: number): string {
	const seconds = (new Date(date).getTime() - now) / 1000;
	if (Math.abs(seconds) < 60) return seconds > 0 ? 'in a moment' : 'just now';
	const [unit, size] = units.find(([, size]) => Math.abs(seconds) >= size)!;
	return relativeTime.format(Math.trunc(seconds / size), unit);
}
