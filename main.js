/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

if(process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  const mainWindow = new BrowserWindow({ width: 1024, height: 728 });
  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  if(process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }
});
