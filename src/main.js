const { spawn, exec } = require('child_process');
const { BrowserWindow, app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const createDesktopShortcut = require('create-desktop-shortcuts');

const createWin = () => {
	const win = new BrowserWindow({
		width: 700,
		height: 550,
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

	ipcMain.handle('ask-to-install-git', (ev) => {
		console.log('Downloading git..');
		download("https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe", "git-install.exe").then(() => {
			const pathToFile = path.resolve('git-install.exe');
			console.log('Downloaded to', pathToFile);
			// run the installer
			const chil = spawn(pathToFile , ['/NORESTART', '/NOCANCEL'], {
				shell: true,
				stdio: 'inherit',
			});
			chil.on('exit', (code) => {
				console.log('Installation completed with code', code);
				ev.sender.send('git-installed', code);
			});
		})
	})

	ipcMain.handle('install', (ev, pathe, desktop) => {
		pathe = path.resolve(pathe);
		console.log('Installing to', pathe, 'with desktop', desktop);
		ev.sender.send('notify', 'Got path of ' + pathe);
		if(!fs.existsSync(pathe)) {
			fs.mkdirSync(pathe);
			ev.sender.send('notify', 'Created' + pathe);
		}
		exec('cd ' + pathe + ' && git clone https://github.com/freedeck/freedeck/',() => {
			ev.sender.send('notify', 'Cloned repository');
			console.log('Cloned');
			const shortcutsCreated = createDesktopShortcut({
				windows: { 
					name: 'Freedeck',
					icon: path.resolve(pathe + '/freedeck/assets/logo_big.ico'),
					filePath: path.resolve(pathe + '/freedeck/init.bat'),
					arguments: path.resolve(pathe+"/freedeck")
				}
			});
			
			if (shortcutsCreated) {
				console.log('Everything worked correctly!');
			} else {
				console.log('Could not create the icon or set its permissions (in Linux if "chmod" is set to true, or not set)');
			}
			ev.sender.send('notify', 'Created shortcut');
			exec('cd ' + pathe + '/freedeck && npm i', () => {
				  ev.sender.send('notify', 'Installed NPM packages, install complete.');
				console.log('Installed npm packages for freedeck');
				ev.sender.send('installation-completed');
			});
		});
	});
}

const download = (flink, to) => {
	return new Promise((res, rej) => {
		const https = require('https');
		const path = require('path');

		const file = fs.createWriteStream(path.resolve(to));

		const req = https.get(flink, function(response) {
			if(response.statusCode == 302 || response.statusCode == 301) {
				file.close();
				download(response.headers.location, to).then((pathToFile) => {
					res(pathToFile);
				});
				return;
			}
			response.pipe(file);
			file.on('finish', () => {
				file.close(res)
			});
		}).on('error', function(err) { // Handle errors
            fs.unlink(path.resolve(to)); // Delete the file async. (But we don't check the result)
            rej(err.message);
        });
	});
}


app.whenReady().then(createWin);