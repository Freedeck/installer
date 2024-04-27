await fdi.checkGitExists().then(async (gitExists) => {
	if(!gitExists) {
		await fdi.askToInstallGit(() => {
			console.log('Git installed');
			setup();
		});
	} else {
		setup();
	}
});

const setup = () => {
	
}