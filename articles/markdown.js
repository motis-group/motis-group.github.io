// Import marked via CDN in the HTML file
function createArticleFromMarkdown(markdown) {
    // Configure marked to add classes to elements and handle text properly
    marked.use({
        renderer: {
            paragraph(text) {
                // Check if text is [object Object] and handle appropriately
                if (text === '[object Object]' || !text.trim()) {
                    return '';
                }
                return `<p class="project-description">${text}</p>`;
            },
            heading(text, level) {
                return `<h${level} class="project-description">${text}</h${level}>`;
            },
            // Add list rendering
            list(body, ordered) {
                const tag = ordered ? 'ol' : 'ul';
                return `<${tag} class="project-description">${body}</${tag}>`;
            },
            listitem(text) {
                return `<li>${text}</li>`;
            },
            // Add link rendering
            link(href, title, text) {
                return `<a href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`;
            }
        },
        breaks: true,
        gfm: true
    });
    
    // Clean up the markdown before parsing
    const cleanMarkdown = markdown
        .replace(/\[object Object\]/g, '')  // Remove [object Object]
        .replace(/\n{3,}/g, '\n\n')        // Replace multiple newlines with double newlines
        .trim();
    
    return marked.parse(cleanMarkdown);
}

async function loadMarkdownArticle(articlePath) {
    try {
        const response = await fetch(articlePath);
        if (!response.ok) throw new Error('Failed to load article');
        const markdown = await response.text();
        return createArticleFromMarkdown(markdown);
    } catch (error) {
        console.error('Error loading article:', error);
        return '<p class="project-description">Error loading article</p>';
    }
} 