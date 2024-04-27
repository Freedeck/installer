const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld('fdi', {
	checkGitExists: async () => {
		return await ipcRenderer.invoke('check-git-exists')
	},
	askToInstallGit: async (cb) => {
		await ipcRenderer.invoke('ask-to-install-git')
		ipcRenderer.on('git-installed', (ev, code) => {
			cb(code);
		});
		return true;
	},
})