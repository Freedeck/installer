const setup = () => {
	document.getElementById('instbtn').onclick = (ev) => {
		const path = document.getElementById('instp').value;
		const desktop = document.getElementById('instds').checked;
		fdi.install(path, desktop);
	}
}

await fdi.checkGitExists().then(async (gitExists) => {
	if(!gitExists) {
		document.getElementById('meta').innerHTML = 'You need Git to continue! Please wait as we automatically download it for you.';
		await fdi.askToInstallGit(() => {
			console.log('Git installed');
			setup();
		});
	} else {
		setup();
	}
});