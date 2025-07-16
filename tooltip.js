// Enhanced tooltip functionality - Fixed Version
document.addEventListener('DOMContentLoaded', () => {
	const tooltips = document.querySelectorAll('.tooltip');

	tooltips.forEach((tooltip) => {
		const content = tooltip.querySelector('.tooltip-content');

		tooltip.addEventListener('mouseenter', () => {
			// Reset classes first
			content.classList.remove('align-left', 'align-right', 'mobile-bottom');

			// Wait for next frame to get accurate measurements
			requestAnimationFrame(() => {
				const rect = content.getBoundingClientRect();
				const viewportWidth = window.innerWidth;
				const scrollX = window.scrollX || window.pageXOffset;

				// Check if tooltip goes off right edge
				if (rect.right > viewportWidth) {
					content.classList.add('align-right');
				}

				// Check if tooltip goes off left edge
				if (rect.left < 0) {
					content.classList.add('align-left');
				}

				// On mobile, show below if near top of screen
				if (window.innerWidth <= 768) {
					const tooltipRect = tooltip.getBoundingClientRect();
					if (tooltipRect.top < 120) {
						content.classList.add('mobile-bottom');
					}
				}
			});
		});

		tooltip.addEventListener('mouseleave', () => {
			// Clean up classes
			content.classList.remove('align-left', 'align-right', 'mobile-bottom');
		});
	});
});
