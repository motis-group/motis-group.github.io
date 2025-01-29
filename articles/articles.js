const articles = [
	{
		name: 'readme.md',
		description: '',
		date: '2024-03-20',
		link: '/articles/read_me.html',
	},
	{
		name: 'ammo_studio_review.mp4',
		description: '',
		date: '2022-01-19',
		link: 'https://www.loom.com/share/c5ce641b12a2438ea0e226efdc45dc54?sid=75d3a346-5dfd-4d61-91db-53c2b0cfd999',
	},
	{
		name: 'process-mapping.mp4',
		description: '',
		date: '2021-11-13',
		link: 'https://www.loom.com/share/1870e9ab9fc8411db9476a99908d89f2',
	},
	{
		name: 'workflow-walkthrough.mp4',
		description: '',
		date: '2021-12-31',
		link: 'https://www.loom.com/share/76757c089c024f37b88cf4727744bb24?sid=89e5083b-7986-4f25-97a4-8c2be56154d9',
	},
];

// Function to sort articles by date (newest first)
function getSortedArticles() {
	return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Add the id to the articles
articles.forEach((article, index) => {
	article.id = (index + 1).toString().padStart(3, '0');
});

// Function to generate HTML for the articles table
function generateArticlesHTML() {
	const sortedArticles = getSortedArticles();
	return sortedArticles
		.map(
			(article) => `
        <tr>
            <td class="project-name">${article.id} ${article.name}</td>
            <td class="project-description">${article.description}</td>
            <td class="date">${article.date}</td>
            <td class="view-link">
                <a href="${article.link}">link ⇱</a>
            </td>
        </tr>
    `
		)
		.join('');
}
