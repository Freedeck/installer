fdi.checkGitExists((gitExists) => {
	if(!gitExists) window.location.href = 'git-install.html';
})