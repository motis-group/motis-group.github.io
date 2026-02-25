const GITHUB_OWNERS = ['wmarzella', 'motis-group'];
const PROJECT_CACHE_KEY = 'motis.projects.cache.v2';
const PROJECT_CACHE_TTL_MS = 1000 * 60 * 60;
const MAX_PROJECTS = 40;

const EXCLUDED_REPOS = new Set([
	'.github',
	'automationchad',
	'did-you-actually-check-my-github',
]);

const REPO_OVERRIDES = {
	'wmarzella/website': {
		name: 'website-source',
		description: 'Canonical source repository for motis.group.',
		status: 'SOURCE',
		company: 'wmarzella',
		location: 'github',
	},
	'motis-group/motis-group.github.io': {
		name: 'motis.group',
		link: 'https://motis.group',
		description: 'Production pages repository for motis.group.',
		status: 'LIVE',
		company: 'motis.group',
		location: 'global',
	},
	'wmarzella/ronin': {
		status: 'ACTIVE',
		description:
			'Automated job application system (hunt, evaluate, apply, follow-up).',
	},
	'motis-group/onlywithhim': {
		status: 'ACTIVE',
		description:
			'TikTok growth and messaging system for an AI companion product.',
	},
	'wmarzella/engineergpt': {
		status: 'BACKLOG',
		visibility: 'closed',
		description: 'RAG assistant for technical docs and proposal workflows.',
	},
	'wmarzella/dynix': {
		status: 'IN-PROGRESS',
		visibility: 'closed',
		description:
			'Variational mechanics and structure-preserving integrator experiments.',
	},
	'wmarzella/geomlib': {
		status: 'IN-PROGRESS',
		visibility: 'closed',
		description: 'Robust geometric computation library for CAD/CAM use cases.',
	},
	'motis-group/traci': {
		status: 'ARCHIVE',
		visibility: 'closed',
		description:
			'Trusted Retrieval Agents Computing Intelligence (multi-agent prototype).',
	},
};

const LOCAL_PRIVATE_PROJECTS = [
	{
		name: 'kernel-bots',
		description: 'Multi-agent operations kernel (local private repository).',
		date: '2026-02-24',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
	{
		name: 'control-plane',
		description:
			'Operator control plane for autonomous agent dispatch and oversight.',
		date: '2026-02-18',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
	{
		name: 'data-platform',
		description: 'Data infrastructure and pipeline foundation (client delivery).',
		date: '2025-04-02',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
	{
		name: 'infra-templates',
		description:
			'Terraform templates for repeatable client infrastructure provisioning.',
		date: '2026-02-17',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
	{
		name: 'ultrawhisper',
		description: 'Speech and transcription tooling experiments.',
		date: '2026-01-17',
		link: '#',
		status: 'IN-PROGRESS',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
	{
		name: 'wiki',
		description: 'Obsidian knowledge vault (project notes and operating context).',
		date: '2026-02-21',
		link: '#',
		status: 'ACTIVE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'local',
	},
];

function toTimestamp(dateValue) {
	const parsed = Date.parse(dateValue);
	return Number.isNaN(parsed) ? 0 : parsed;
}

function toDateOnly(value) {
	if (!value) {
		return '1970-01-01';
	}
	const asString = String(value);
	if (asString.includes('T')) {
		return asString.split('T')[0];
	}
	if (/^\d{4}-\d{2}-\d{2}$/.test(asString)) {
		return asString;
	}
	return '1970-01-01';
}

function parseNextLink(linkHeader) {
	if (!linkHeader) {
		return null;
	}
	const parts = linkHeader.split(',');
	for (const part of parts) {
		const match = part.match(/<([^>]+)>;\s*rel="next"/);
		if (match) {
			return match[1];
		}
	}
	return null;
}

function isRecentlyUpdated(dateValue, days) {
	const timestamp = toTimestamp(dateValue);
	if (!timestamp) {
		return false;
	}
	const ageMs = Date.now() - timestamp;
	return ageMs <= days * 24 * 60 * 60 * 1000;
}

function defaultStatusForRepo(repo) {
	if (repo.archived) {
		return 'ARCHIVE';
	}
	if (repo.fork) {
		return 'FORK';
	}
	if (isRecentlyUpdated(repo.pushed_at, 120)) {
		return 'ACTIVE';
	}
	return 'OSS';
}

function defaultVisibilityForRepo(repo) {
	if (repo.archived || repo.fork) {
		return 'closed';
	}
	return 'open';
}

function normalizeDescription(value) {
	const raw = String(value || 'No description yet.').replace(/\s+/g, ' ').trim();
	return raw.length > 140 ? `${raw.slice(0, 137)}...` : raw;
}

function mapRepoToProject(repo) {
	const owner = repo.owner && repo.owner.login ? repo.owner.login : 'github';
	const company = owner === 'motis-group' ? 'motis.group' : owner;
	const homepage = typeof repo.homepage === 'string' ? repo.homepage.trim() : '';
	const link = homepage.startsWith('http://') || homepage.startsWith('https://')
		? homepage
		: repo.html_url;

	const project = {
		name: repo.name,
		description: normalizeDescription(repo.description),
		date: toDateOnly(repo.pushed_at),
		link,
		status: defaultStatusForRepo(repo),
		visibility: defaultVisibilityForRepo(repo),
		company,
		location: 'github',
	};

	const override = REPO_OVERRIDES[(repo.full_name || '').toLowerCase()];
	if (override) {
		Object.assign(project, override);
	}

	project.description = normalizeDescription(project.description);
	project.date = toDateOnly(project.date);
	return project;
}

function shouldIncludeRepo(repo) {
	if (!repo || typeof repo !== 'object') {
		return false;
	}
	if (EXCLUDED_REPOS.has((repo.name || '').toLowerCase())) {
		return false;
	}
	if (repo.fork) {
		return false;
	}
	return true;
}

async function fetchOwnerRepos(owner) {
	let url = owner === 'motis-group'
		? `https://api.github.com/orgs/${owner}/repos?per_page=100&type=public&sort=updated`
		: `https://api.github.com/users/${owner}/repos?per_page=100&type=public&sort=updated`;

	const repos = [];
	let pages = 0;

	while (url && pages < 4) {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github+json',
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error ${response.status} for ${owner}`);
		}

		const payload = await response.json();
		if (!Array.isArray(payload)) {
			throw new Error(`Unexpected GitHub API payload for ${owner}`);
		}

		repos.push(...payload);
		url = parseNextLink(response.headers.get('link'));
		pages += 1;
	}

	return repos;
}

function dedupeProjects(projects) {
	const merged = new Map();
	for (const project of projects) {
		const key = `${String(project.company).toLowerCase()}::${String(project.name).toLowerCase()}`;
		const existing = merged.get(key);
		if (!existing || toTimestamp(project.date) > toTimestamp(existing.date)) {
			merged.set(key, project);
		}
	}
	return [...merged.values()];
}

function getSortedProjects(projectList) {
	const sortedProjects = [...projectList].sort(
		(a, b) => toTimestamp(b.date) - toTimestamp(a.date)
	);

	sortedProjects.forEach((project, index) => {
		project.id = (index + 1).toString().padStart(3, '0');
	});

	return sortedProjects.slice(0, MAX_PROJECTS);
}

function canShowLink(project) {
	return Boolean(project.link && project.link !== '#') && project.visibility === 'open';
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function renderProjects(projectList) {
	const sortedProjects = getSortedProjects(projectList);

	return sortedProjects
		.map(
			(project) => `
        <tr>
            <td class="project-name">
                <span class="project-id">${escapeHtml(project.id)}</span> ${escapeHtml(project.name)}
                ${project.status ? `<span class="project-status">${escapeHtml(project.status)}</span>` : ''}
                ${project.visibility === 'closed' ? '<span class="project-status closed">⊗</span>' : ''}
            </td>
            <td class="project-description">${escapeHtml(project.description)}</td>
            <td class="company">${escapeHtml(project.company)}</td>
            <td class="location">${escapeHtml(project.location)}</td>
            <td class="view-link">
                ${
						canShowLink(project)
							? `<a href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">link ⇱</a>`
							: '<span class="disabled-link">link ⇱</span>'
					}
            </td>
        </tr>
    `
		)
		.join('');
}

function renderLoadingState() {
	return `
    <tr>
        <td class="project-name"><span class="project-id">...</span> syncing projects <span class="project-status">LIVE</span></td>
        <td class="project-description">Pulling from GitHub (wmarzella + motis-group) and local metadata.</td>
        <td class="company">motis.group</td>
        <td class="location">sync</td>
        <td class="view-link"><span class="disabled-link">link ⇱</span></td>
    </tr>
    `;
}

function readCachedProjects() {
	try {
		const raw = localStorage.getItem(PROJECT_CACHE_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.projects) || typeof parsed.cachedAt !== 'number') {
			return [];
		}
		if (Date.now() - parsed.cachedAt > PROJECT_CACHE_TTL_MS) {
			return [];
		}
		return parsed.projects;
	} catch (_error) {
		return [];
	}
}

function writeCachedProjects(projects) {
	try {
		localStorage.setItem(
			PROJECT_CACHE_KEY,
			JSON.stringify({
				cachedAt: Date.now(),
				projects,
			})
		);
	} catch (_error) {
		// Ignore cache write failures (private mode, quota, etc)
	}
}

async function loadProjects() {
	const repoPages = await Promise.all(GITHUB_OWNERS.map((owner) => fetchOwnerRepos(owner)));
	const githubProjects = repoPages
		.flat()
		.filter((repo) => shouldIncludeRepo(repo))
		.map((repo) => mapRepoToProject(repo));

	return dedupeProjects([...githubProjects, ...LOCAL_PRIVATE_PROJECTS]);
}

async function refreshProjectsTable() {
	const tableElement = document.getElementById('projects-table');
	if (!tableElement) {
		return;
	}

	try {
		const projects = await loadProjects();
		writeCachedProjects(projects);
		tableElement.innerHTML = renderProjects(projects);
	} catch (error) {
		const cached = readCachedProjects();
		if (cached.length > 0) {
			tableElement.innerHTML = renderProjects(cached);
			return;
		}
		tableElement.innerHTML = `
            <tr>
                <td class="project-name"><span class="project-id">ERR</span> project sync failed <span class="project-status">OFFLINE</span></td>
                <td class="project-description">${escapeHtml(error.message || 'Unable to load dynamic projects.')}</td>
                <td class="company">motis.group</td>
                <td class="location">sync</td>
                <td class="view-link"><span class="disabled-link">link ⇱</span></td>
            </tr>
        `;
	}
}

function generateProjectsHTML() {
	const cached = readCachedProjects();
	setTimeout(() => {
		refreshProjectsTable();
	}, 0);

	if (cached.length > 0) {
		return renderProjects(cached);
	}

	return renderLoadingState();
}
