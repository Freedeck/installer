fdi.checkGitExists((gitExists) => {
	if(!gitExists) {
	} else {
		window.location.href = 'index.html';
	}
})