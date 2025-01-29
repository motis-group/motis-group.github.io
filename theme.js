// Check system theme first, then saved preference
const getPreferredTheme = () => {
	const savedTheme = localStorage.getItem('theme');
	const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';

	// Only use saved theme if user has explicitly set it
	if (savedTheme && savedTheme !== systemTheme) {
		return savedTheme;
	}
	return systemTheme;
};

// Apply theme to document
const setTheme = (theme) => {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
};

// Initialize theme immediately to prevent flash
setTheme(getPreferredTheme());

// Handle theme toggle
document.addEventListener('DOMContentLoaded', () => {
	const themeToggle = document.getElementById('theme-toggle');
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-theme');
			const newTheme = currentTheme === 'light' ? 'dark' : 'light';
			setTheme(newTheme);
			themeToggle.textContent = `${newTheme === 'light' ? '☾' : '☀'}`;
		});

		// Set initial button text
		themeToggle.textContent = `${
			document.documentElement.getAttribute('data-theme') === 'light'
				? '☾'
				: '☀'
		}`;
	}
});

// Listen for system theme changes
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', (e) => {
		const savedTheme = localStorage.getItem('theme');
		const newSystemTheme = e.matches ? 'dark' : 'light';

		// Update theme if user hasn't explicitly chosen a different one
		if (
			!savedTheme ||
			savedTheme === document.documentElement.getAttribute('data-theme')
		) {
			setTheme(newSystemTheme);

			// Update toggle button if it exists
			const themeToggle = document.getElementById('theme-toggle');
			if (themeToggle) {
				themeToggle.textContent = `${newSystemTheme === 'light' ? '☾' : '☀'}`;
			}
		}
	});
