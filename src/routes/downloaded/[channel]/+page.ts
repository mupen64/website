export const entries = () =>
	(['stable-w32', 'stable-w64', 'nightly-w32', 'nightly-w64'] as const).map((channel) => ({
		channel
	}));
