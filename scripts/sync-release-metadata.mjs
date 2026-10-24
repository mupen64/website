import { writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const repositories = {
	mupen64: 'https://api.github.com/repos/mupen64/mupen64-rr-lua',
	redux: 'https://codeberg.org/api/v1/repos/mupen64/SM64LuaRedux',
	ugui: 'https://codeberg.org/api/v1/repos/mupen64/ugui'
};
const maxPages = 100;
const pageSize = 100;

export function isoDate(value) {
	if (typeof value !== 'string' || !value.trim()) return null;
	const timestamp = Date.parse(value);
	return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

export function releaseDates(releases) {
	const stable = Object.create(null);
	for (const release of releases) {
		if (release.draft || typeof release.tag_name !== 'string') continue;
		const tag = release.tag_name.replace(/^v/i, '');
		const date = isoDate(release.published_at) ?? isoDate(release.created_at);
		if (!tag || !date) continue;
		if (stable[tag] && stable[tag] !== date) {
			throw new Error(`Conflicting release dates for normalized tag ${tag}`);
		}
		stable[tag] = date;
	}
	return Object.fromEntries(Object.entries(stable).sort(([a], [b]) => a.localeCompare(b)));
}

export function createRequester({
	fetchImpl = fetch,
	sleep = delay,
	token = process.env.GITHUB_TOKEN
} = {}) {
	return async function request(url) {
		const github = new URL(url).hostname === 'api.github.com';
		const headers = { Accept: 'application/json', 'User-Agent': 'mupen64-release-metadata' };
		if (github) {
			headers.Accept = 'application/vnd.github+json';
			headers['X-GitHub-Api-Version'] = '2022-11-28';
			if (token) headers.Authorization = `Bearer ${token}`;
		}

		for (let attempt = 0; attempt < 3; attempt++) {
			await sleep(300);
			let response;
			try {
				response = await fetchImpl(url, {
					headers,
					signal: AbortSignal.timeout(20_000),
					redirect: 'error'
				});
			} catch (error) {
				if (attempt === 2) throw new Error(`Request failed for ${url}: ${error.message}`);
				await sleep(1000 * 2 ** attempt);
				continue;
			}
			if (response.ok) {
				try {
					return await response.json();
				} catch (error) {
					throw new Error(`Invalid JSON from ${url}: ${error.message}`);
				}
			}

			const retryAfter = response.headers.get('retry-after');
			const rateLimited =
				response.status === 429 ||
				(response.status === 403 &&
					(response.headers.get('x-ratelimit-remaining') === '0' || retryAfter !== null));
			const detail = (await response.text()).slice(0, 500);
			const error = new Error(
				`HTTP ${response.status} from ${url}${rateLimited ? ' (rate limited)' : ''}: ${detail}`
			);
			if (attempt === 2 || (!rateLimited && response.status < 500)) throw error;
			const wait = retryAfter
				? /^\d+$/.test(retryAfter)
					? Number(retryAfter) * 1000
					: Date.parse(retryAfter) - Date.now()
				: 1000 * 2 ** attempt;
			// Do not hang CI or retry earlier than a long server-requested cooldown.
			if (!Number.isFinite(wait) || wait > 10_000) throw error;
			if (rateLimited && !retryAfter) throw error;
			await sleep(Math.max(0, wait));
		}
	};
}

export async function gatherMetadata(request = createRequester()) {
	const metadata = {};
	for (const [name, base] of Object.entries(repositories)) {
		const releases = [];
		for (let page = 1; ; page++) {
			if (page > maxPages) {
				throw new Error(`${name}: exceeded ${maxPages} release pages; refusing partial metadata`);
			}
			const pagination = base.startsWith('https://api.github.com/') ? 'per_page' : 'limit';
			const batch = await request(`${base}/releases?${pagination}=${pageSize}&page=${page}`);
			if (!Array.isArray(batch)) throw new Error(`${name}: expected a releases array`);
			if (batch.length === 0) break;
			releases.push(...batch);
		}
		const commitPath = base.startsWith('https://api.github.com/') ? 'commits' : 'git/commits';
		const commit = await request(`${base}/${commitPath}/main`);
		const nightly = isoDate(commit?.commit?.committer?.date);
		if (!nightly) throw new Error(`${name}: main commit has no valid commit.committer.date`);
		metadata[name] = { stable: releaseDates(releases), nightly };
	}
	return metadata;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		const metadata = await gatherMetadata();
		const output = new URL('../static/changelogs/metadata.json', import.meta.url);
		await writeFile(output, `${JSON.stringify(metadata, null, 2)}\n`);
		for (const [name, { stable, nightly }] of Object.entries(metadata)) {
			console.log(`${name}: ${Object.keys(stable).length} release dates; nightly ${nightly}`);
		}
	} catch (error) {
		console.error(`Release metadata sync failed: ${error.message}`);
		process.exitCode = 1;
	}
}
