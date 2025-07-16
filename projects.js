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
		name: 'hr-sync.py',
		description: 'contract - data engineering',
		date: '2024-10-15',
		link: '#',
		visibility: 'open',
		company: 'kunes auto group',
		location: 'remote',
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
		name: 'gladius',
		description: 'ETL refactor + orchestration migration (Airflow to Prefect)',
		date: '2024-12-01',
		link: '#',
		visibility: 'closed',
		company: 'stealth logistics client',
		location: 'melbourne',
	},
	{
		name: 'synapse-audit',
		description: 'AI automation audit for mid-size enterprise',
		date: '2025-02-05',
		link: '#',
		visibility: 'closed',
		company: 'stealth corp',
		location: 'australia',
	},
	{
		name: 'lumen',
		description: 'internal LLM agent platform with retrieval layer',
		date: '2024-11-12',
		link: '#',
		visibility: 'closed',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'regulus',
		description: 'ML-driven forecasting pipeline for national wholesaler',
		date: '2024-09-15',
		link: '#',
		visibility: 'closed',
		company: 'stealth retail client',
		location: 'australia',
	},
	{
		name: 'ops-mirror',
		description: 'infra monitoring & alerting system using lightweight GPT agents',
		date: '2025-02-12',
		link: '#',
		visibility: 'closed',
		company: 'stealth infra client',
		location: 'melbourne',
	},
	{
		name: 'flint-sync.py',
		description: 'contract - dbt and Snowflake model sync',
		date: '2024-07-01',
		link: '#',
		visibility: 'open',
		company: 'rest super',
		location: 'melbourne',
	},
	{
		name: 'dendrite',
		description: 'multi-tenant embedding + vector pipeline with modular RAG endpoints',
		date: '2025-03-02',
		link: '#',
		visibility: 'open',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'vector-qa-sync',
		description: 'custom RAG app for internal knowledge base search',
		date: '2024-11-03',
		link: '#',
		visibility: 'closed',
		company: 'chiltons',
		location: 'melbourne',
	},
	{
		name: 'delta-layer-refactor',
		description: 'rewrote delta lake ingestion pipeline for lower latency + cost',
		date: '2024-08-19',
		link: '#',
		visibility: 'closed',
		company: 'rest super',
		location: 'remote',
	},
	{
		name: 'telemetry-pruner',
		description: 'wrote dbt macros to clean billions of log records for analytics',
		date: '2024-06-22',
		link: '#',
		visibility: 'closed',
		company: 'idee group',
		location: 'new zealand',
	},
	{
		name: 'sigil',
		description: 'experiment in building GPT-native contract drafting agents',
		date: '2024-12-05',
		link: 'https://github.com/automationchad/sigil',
		visibility: 'open',
		company: 'motis.group',
		location: 'remote',
	},
	{
		name: 'terraform-cleanroom',
		description: 'infra-as-code simplification project for Snowflake environments',
		date: '2024-10-11',
		link: '#',
		visibility: 'closed',
		company: 'rest super',
		location: 'melbourne',
	},
	{
		name: 'onboarding-agent',
		description: 'LLM-powered bot for HR onboarding workflow via Slack',
		date: '2025-01-18',
		link: '#',
		visibility: 'closed',
		company: 'stealth corp',
		location: 'australia',
	},
	{
		name: 'query-benchmark.py',
		description: 'tool to evaluate warehouse query performance across Snowflake + Redshift',
		date: '2025-02-09',
		link: 'https://github.com/automationchad/query-benchmark',
		visibility: 'open',
		company: 'alfab',
		location: 'remote',
	},
	{
		name: 'compose.ml',
		description: 'consulting project to rebuild ML feature store into modular dbt-native system',
		date: '2024-07-14',
		link: '#',
		visibility: 'closed',
		company: 'telecom industry',
		location: 'sydney',
	},
	{
		name: 'client-data-migration',
		description: 'multi-tenant customer analytics rebuild for Snowflake',
		date: '2024-05-20',
		link: '#',
		visibility: 'closed',
		company: 'education industry',
		location: 'remote',
	},
	{
		name: 'retention-agent',
		description: 'lightweight LLM tool to draft winback emails using customer CRM notes',
		date: '2024-09-01',
		link: '#',
		visibility: 'closed',
		company: 'stealth startup',
		location: 'los angeles',
	},

	{
		name: '*',
		description: '*',
		date: '*',
		link: '*',
		visibility: '*',
		company: '*',
		location: '*',
	},
	{
		name: '*',
		description: '*',
		date: '*',
		link: '*',
		visibility: '*',
		company: '*',
		location: '*',
	},
	{
		name: '*',
		description: '*',
		date: '*',
		link: '*',
		visibility: '*',
		company: '*',
		location: '*',
	},
	{
		name: 'MISCALLANEOUS',
		description: '*',
		date: '*',
		link: '*',
		visibility: '*',
		company: '*',
		location: '*',
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
									project.description.includes('*')
										? '*'
										: project.status === 'WIP' ||
										  project.visibility === 'closed'
										? '<span class="disabled-link">link ⇱</span>'
										: `<a href="${project.link}" target="_blank">link ⇱</a>`
								}
            </td>
        </tr>
    `
		)
		.join('');
}
