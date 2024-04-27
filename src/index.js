const { BrowserWindow, app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const createWin = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: __dirname + '/preload.js',
		},
	});
	win.loadFile('src/app/index.html');

	ipcMain.on('ready', (ev, data) => {
		console.log('Ready to start installing with data',data)
	})

	ipcMain.handle('check-git-exists', (ev) => {
		console.log('Checking if git exists...')
		return fs.existsSync(path.resolve('C:\\Program Files\\Git\\bin\\git.exe'));
	})
}


app.whenReady().then(createWin);