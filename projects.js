const projects = [
	{
		name: 'article-automation.py',
		description: 'workflow automation script',
		date: '2025-01-30',
		link: '#',
		status: 'WIP',
		visibility: 'open',
		company: 'dot2dotconsulting',
		location: 'remote',
	},
	{
		name: 'marzella',
		description: 'personal wiki',
		date: '2024-03-20',
		link: '#',
		status: 'WIP',
		visibility: 'open',
		company: 'motis.group',
		location: 'sydney',
	},
	{
		name: 'yami',
		description: 'costing cli tool',
		date: '2025-01-15',
		link: '#',
		status: 'WIP',
		visibility: 'open',
		company: 'alfab',
		location: 'sydney',
	},
	{
		name: 'tsukuyomi',
		description: 'experimental os',
		date: '2024-03-10',
		link: '#',
		visibility: 'closed',
		company: 'acme corp',
		location: 'remote',
	},
	{
		name: 'hr-sync.py',
		description: 'contract - data engineering',
		date: '2024-10-15',
		link: '#',
		visibility: 'open',
		company: 'kunes auto group',
		location: 'remote',
	},
	{
		name: 'motis.group',
		description: 'personal website',
		date: '2023-11-10',
		link: 'https://github.com/automationchad/website',
		visibility: 'open',
		company: 'motis group',
		location: 'sydney',
	},
	{
		name: 'ironclad-sync.py',
		description: 'contract - data engineering',
		date: '2023-04-15',
		link: '#',
		visibility: 'closed',
		company: 'molecular testing labs',
		location: 'san diego',
	},
	{
		name: 'crm-sync.py',
		description: 'contract - data engineering',
		date: '2022-10-19',
		link: '#',
		visibility: 'closed',
		company: 'nova',
		location: 'san diego',
	},
	{
		name: 'lever-sync.py',
		description: 'contract - data engineering',
		date: '2023-06-19',
		link: '#',
		visibility: 'closed',
		company: 'appen',
		location: 'san diego',
	},
	{
		name: 'revoltx.py',
		description: 'auto job application script',
		date: '2025-01-05',
		link: '#',
		visibility: 'closed',
		company: 'motis group',
		location: 'sydney',
	},
	{
		name: 'traci',
		description: 'rag application',
		date: '2023-04-15',
		link: '#',
		visibility: 'open',
		company: 'tray.io',
		location: 'italy',
	},
	{
		name: 'database-sync.py',
		description: 'contract - data engineering',
		date: '2024-04-30',
		link: '#',
		visibility: 'open',
		company: 'sai360',
		location: 'melbourne',
	},
	{
		name: 'hubspot-sync.py',
		description: 'contract - data engineering',
		date: '2023-10-06',
		link: '#',
		visibility: 'open',
		company: 'manobyte',
		location: 'remote',
	},
	{
		name: 'platform engineer',
		description: 'work in sales, automation, and data',
		date: '2021-04-12',
		link: '#',
		visibility: 'open',
		company: 'tray.io',
		location: 'san diego',
	},
	{
		name: 'usc-tsc-podcast',
		description: 'podcast',
		date: '2020-09-25',
		link: 'https://open.spotify.com/show/3QWs17CVzPMCdiciMXM4Nz?si=a22f46e7621341e5',
		visibility: 'open',
		company: 'usc',
		location: 'los angeles',
	},
	{
		name: 'in-on-merit',
		description: 't-shirt design',
		date: '2019-04-19',
		link: 'https://lamag.com/featured/these-usc-students-want-you-to-know-exactly-how-they-got-accepted',
		visibility: 'open',
		company: 'usc',
		location: 'los angeles',
	},
];

// Function to sort projects by date (newest first)
function getSortedProjects() {
	const sortedProjects = [...projects].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	);
	// Add the id to the sorted projects
	sortedProjects.forEach((project, index) => {
		project.id = (index + 1).toString().padStart(3, '0');
	});
	return sortedProjects;
}

// Function to generate HTML for the projects table
function generateProjectsHTML() {
	const sortedProjects = getSortedProjects();

	return sortedProjects
		.map(
			(project) => `
        <tr>
            <td class="project-name">
                <span class="project-id">${project.id}</span> ${project.name} 
                ${
									project.status
										? `<span class="project-status">${project.status}</span>`
										: ''
								}
                ${
									project.visibility === 'closed'
										? '<span class="project-status closed">⊗</span>'
										: ''
								}
            </td>
            <td class="project-description">${project.description}</td>
            <td class="company">${project.company}</td>
            <td class="location">${project.location}</td>
            <td class="view-link">
                ${
									project.status === 'WIP' || project.visibility === 'closed'
										? '<span class="disabled-link">link ⇱</span>'
										: `<a href="${project.link}" target="_blank">link ⇱</a>`
								}
            </td>
        </tr>
    `
		)
		.join('');
}
