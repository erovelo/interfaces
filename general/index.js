const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    }
  });

  // and load the index.html of the app.
  win.loadFile('app/index.html');
}

app.on('ready', createWindow);