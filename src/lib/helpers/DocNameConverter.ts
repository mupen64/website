export function doc_name_to_friendly_name(name: string) {
	const baseName = name.split('/').pop() ?? name;
	const friendlyName = baseName
		.replace(/^\d+\.\s*/, '')
		.replaceAll('_', ' ')
		.replaceAll('-', ' ');

	return friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1);
}
