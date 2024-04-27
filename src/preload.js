const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld('fdi', {
	checkGitExists: async () => {
		return await ipcRenderer.invoke('check-git-exists')
	}
})