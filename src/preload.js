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
	getUserHomeDir: async () => {
		return require('os').homedir();
	},
	install: async (path, desktop) => {
		return await ipcRenderer.invoke('install', path, desktop);
	},
	onUpdate: async (cb) => {
		ipcRenderer.on('notify', (ev, c) => {
			cb(c);
		})
	},
	postInstall: async (cb) => {
		ipcRenderer.on('installation-completed', (ev) => {
			cb();
		});
	}
})