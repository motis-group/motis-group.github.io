(() => {
	const THEME = {
		LIGHT: 'light',
		DARK: 'dark',
	};
	const ICONS = {
		[THEME.LIGHT]: '☾',
		[THEME.DARK]: '☀',
	};

	const getTheme = () => {
		const saved = localStorage.getItem('theme');
		return (
			saved ||
			(matchMedia('(prefers-color-scheme: dark)').matches
				? THEME.DARK
				: THEME.LIGHT)
		);
	};

	const setTheme = (theme) => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		const toggle = document.getElementById('theme-toggle');
		if (toggle) toggle.textContent = ICONS[theme];
	};

	// Initialize theme
	setTheme(getTheme());

	// Theme toggle handler
	document.addEventListener('DOMContentLoaded', () => {
		const toggle = document.getElementById('theme-toggle');
		if (toggle) {
			toggle.addEventListener('click', () =>
				setTheme(
					document.documentElement.getAttribute('data-theme') === THEME.LIGHT
						? THEME.DARK
						: THEME.LIGHT
				)
			);
		}
	});

	// System theme change handler
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			setTheme(e.matches ? THEME.DARK : THEME.LIGHT);
		}
	});
})();
