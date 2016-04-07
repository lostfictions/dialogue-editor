import { remote } from 'electron';
const Menu = remote.Menu;
const ElectronApp = remote.app;

import { appName } from '../Constants';
import { actionTypes as fileActionTypes } from '../Components/Toolbar';

export default function buildMenu(dispatch) {
  const isOSX = process.platform === 'darwin';

  const template = [
    {
      label: '&File',
      submenu: [
        {
          label: '&Open',
          accelerator: 'CmdOrCtrl+O',
          click() {
            remote.dialog.showOpenDialog({
              title: 'Select a JSON file',
              filters: [
                { name: 'JSON', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile']
            }, (filenames) => {
              if(filenames) {
                dispatch({
                  type: fileActionTypes.OPEN_FILE,
                  filename: filenames[0]
                });
              }
            });
          }
        },
        {
          label: '&Save',
          accelerator: 'CmdOrCtrl+S',
          click() {
            dispatch({
              type: fileActionTypes.SAVE_FILE
            });
          }
        },
        {
          label: 'Save &As',
          accelerator: 'Shift+CmdOrCtrl+S',
          click() {
            remote.dialog.showSaveDialog({
              title: 'Select a JSON file',
              filters: [
                { name: 'JSON', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            }, (filename) => {
              if(filename) {
                dispatch({
                  type: fileActionTypes.SAVE_FILE_AS,
                  filename
                });
              }
            });
          }
        },
        {
          label: '&Close',
          accelerator: 'Ctrl+W',
          click() {
            const Window = remote.getCurrentWindow();
            Window.close();
          }
        }
      ]
    },
    {
      label: '&Edit',
      submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    },
    {
      label: '&View',
      submenu: [
        {
          label: 'Toggle &Full Screen',
          accelerator: isOSX ? 'Ctrl+Command+F' : 'F11',
          click() {
            const Window = remote.getCurrentWindow();
            Window.setFullScreen(!Window.isFullScreen());
          }
        }
      ]
    }
  ];

  if(isOSX) {
    template.unshift({
      label: 'Electron',
      submenu: [
        {
          label: `About ${ appName }`,
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: `Hide ${ appName }`,
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            ElectronApp.quit();
          }
        }
      ]
    });

    template.push({
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
