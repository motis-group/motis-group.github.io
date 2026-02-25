const projects = [
	{
		name: 'motis.group',
		description: 'canonical website and operating profile',
		date: '2026-02-25',
		link: 'https://motis.group',
		status: 'LIVE',
		visibility: 'open',
		company: 'motis.group',
		location: 'global',
	},
	{
		name: 'kernel-bots',
		description: 'multi-agent operations kernel',
		date: '2026-02-24',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'flow-builder-ui',
		description: 'visual workflow builder for operations teams',
		date: '2026-02-24',
		link: '#',
		status: 'WIP',
		visibility: 'closed',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'runtime-service',
		description: 'agent runtime orchestration and contracts',
		date: '2026-02-23',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'website-source',
		description: 'source repo for this site',
		date: '2026-02-20',
		link: 'https://github.com/wmarzella/website',
		status: 'OSS',
		visibility: 'open',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'kanpeki',
		description: 'costing CLI tool',
		date: '2025-01-15',
		link: 'https://github.com/wmarzella/kanpeki',
		status: 'OSS',
		visibility: 'open',
		company: 'alfab',
		location: 'sydney',
	},
	{
		name: 'revoltx',
		description: 'automation experiments for job workflows',
		date: '2025-01-05',
		link: 'https://github.com/wmarzella/revoltx',
		status: 'OSS',
		visibility: 'open',
		company: 'motis.group',
		location: 'sydney',
	},
	{
		name: 'marzella-wiki',
		description: 'personal wiki and operations notes',
		date: '2024-03-20',
		link: '#',
		status: 'PRIVATE',
		visibility: 'closed',
		company: 'motis.group',
		location: 'sydney',
	},
	{
		name: 'data-sync contracts',
		description: 'delivery across HR/CRM/finance data pipelines',
		date: '2024-01-15',
		link: '#',
		status: 'ARCHIVE',
		visibility: 'closed',
		company: 'consulting',
		location: 'remote',
	},
	{
		name: 'usc-tsc-podcast',
		description: 'podcast production and publishing',
		date: '2020-09-25',
		link: 'https://open.spotify.com/show/3QWs17CVzPMCdiciMXM4Nz?si=a22f46e7621341e5',
		status: 'ARCHIVE',
		visibility: 'open',
		company: 'usc',
		location: 'los angeles',
	},
	{
		name: 'in-on-merit',
		description: 'campaign and merchandise launch',
		date: '2019-04-19',
		link: 'https://lamag.com/featured/these-usc-students-want-you-to-know-exactly-how-they-got-accepted',
		status: 'ARCHIVE',
		visibility: 'open',
		company: 'usc',
		location: 'los angeles',
	},
];

function toTimestamp(dateValue) {
	const parsed = Date.parse(dateValue);
	return Number.isNaN(parsed) ? 0 : parsed;
}

function getSortedProjects() {
	const sortedProjects = [...projects].sort(
		(a, b) => toTimestamp(b.date) - toTimestamp(a.date)
	);

	sortedProjects.forEach((project, index) => {
		project.id = (index + 1).toString().padStart(3, '0');
	});

	return sortedProjects;
}

function canShowLink(project) {
	return Boolean(project.link && project.link !== '#') && project.visibility === 'open';
}

function generateProjectsHTML() {
	const sortedProjects = getSortedProjects();

	return sortedProjects
		.map(
			(project) => `
        <tr>
            <td class="project-name">
                <span class="project-id">${project.id}</span> ${project.name}
                ${project.status ? `<span class="project-status">${project.status}</span>` : ''}
                ${project.visibility === 'closed' ? '<span class="project-status closed">⊗</span>' : ''}
            </td>
            <td class="project-description">${project.description}</td>
            <td class="company">${project.company}</td>
            <td class="location">${project.location}</td>
            <td class="view-link">
                ${
						canShowLink(project)
							? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">link ⇱</a>`
							: '<span class="disabled-link">link ⇱</span>'
					}
            </td>
        </tr>
    `
		)
		.join('');
}
