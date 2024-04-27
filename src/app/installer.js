const setup = () => {
	document.getElementById('instbtn').onclick = (ev) => {
		const dialogBox = document.querySelector('.dialog');
		dialogBox.style.display = 'block';
		document.querySelector('.dialog > h1').innerHTML = 'Installing Freedeck!';
		document.querySelector('.dialog > p').innerHTML = 'Please wait as we install Freedeck on your system. This may take a while.';
		const path = document.getElementById('instp').value;
		const desktop = document.getElementById('instds').checked;
		fdi.install(path, desktop);
		fdi.postInstall(() => {
			document.querySelector('.dialog > h1').innerHTML = 'Freedeck Installed!';
			document.querySelector('.dialog > p').innerHTML = 'Freedeck has been installed on your system. You can now close this window.';
		})
	}
}

const doSetup = async () => {
	await fdi.getUserHomeDir().then((homeDir) => {
		document.getElementById('instp').value = homeDir + '/Freedeck';
	});
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
}

doSetup();