await fdi.checkGitExists().then((gitExists) => {
	if(!gitExists) {
		window.location.href = 'install-git.html';
	}
});