// Extends the ruled table down to the footer so short pages keep the
// same rhythm as long ones. The footer is fixed, so its top does not
// move as rows are added and the loop converges.
(() => {
	const fill = () => {
		const table = document.querySelector('.projects-table');
		const footer = document.querySelector('.footer');
		if (!table || !footer) return;

		[...table.rows].filter((r) => r.dataset.filler).forEach((r) => r.remove());

		const limit = footer.getBoundingClientRect().top;
		let guard = 0;
		const columns = table.rows[0] ? table.rows[0].cells.length : 1;
		while (table.getBoundingClientRect().bottom < limit && guard++ < 300) {
			const row = table.insertRow(-1);
			row.dataset.filler = '1';
			const cell = row.insertCell(0);
			cell.className = 'project-description';
			cell.colSpan = columns;
			cell.innerHTML = '&nbsp;';
		}

		// the loop stops one row after crossing the footer, which would put a
		// scrollbar on a page that did not need one
		const last = [...table.rows].reverse().find((r) => r.dataset.filler);
		if (last && table.getBoundingClientRect().bottom > limit) last.remove();
	};

	const run = () => requestAnimationFrame(fill);
	document.readyState === 'loading'
		? document.addEventListener('DOMContentLoaded', run)
		: run();
	addEventListener('resize', run);
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
})();
