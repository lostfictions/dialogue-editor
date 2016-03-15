//App styles
import './app.css';

//React/Redux
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

//Node/Electron
import path from 'path';
import fs from 'fs-extra';
import { remote } from 'electron';
const Menu = remote.Menu;
const Window = remote.getCurrentWindow();
const ElectronApp = remote.app;

import Immutable, { Set } from 'immutable';

import configureStore from './Store/configureStore';
import { viewModes, appName } from './Constants';
import { actionTypes as fileActionTypes } from './Components/Toolbar';

const pathToLastOpen = path.join(remote.app.getPath('userData'), 'lastopen');

let currentFilename = '';
let initialGraph = {
  'script': '',
  'questions': [ ],
  'clips': [ ]
};

const res = tryReopenLastFile();
if(res.error) {
  console.log(res.error);
}
else {
  currentFilename = res.lastFilename;
  initialGraph = res.lastGraph;
}

const initialState = Immutable.fromJS({
  currentFilename,
  viewMode: viewModes.LIST,
  lang: 'en',
  zoom: 0.1,
  questionIds: Set(initialGraph.questions.map(q => q.id)),
  clipIds: Set(initialGraph.clips.map(c => c.id)),
  graph: initialGraph
});

const store = configureStore(initialState);

/*
//Test button:
const b = document.createElement('button');
b.innerHTML = 'Dump';
b.style.position = 'absolute';
b.style.right = '10px';
b.style.bottom = '10px';
b.className = 'btn btn-warning';
b.onclick = () => console.log(store.getState().get('graph'));
document.body.appendChild(b);
*/

const rootEl = document.getElementById('root');

let render = () => {
  const App = require('./Containers/App');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootEl
  );
};

if(module.hot) {
  const renderApp = render;
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    );
  };
  render = () => {
    try {
      renderApp();
    }
    catch(error) {
      renderError(error);
    }
  };
  module.hot.accept('./Containers/App', () => {
    setTimeout(render);
  });
}

render();

buildMenu(store.dispatch);

//Watch for changes in the filename, and write them to disk so we can reopen next time.
store.subscribe(() => {
  const newCurrentFilename = store.getState().get('currentFilename');
  if(newCurrentFilename !== currentFilename) {
    console.log(`filename changed from ${ currentFilename } to ${ newCurrentFilename }!`);
    fs.outputFileSync(pathToLastOpen, newCurrentFilename);
    currentFilename = newCurrentFilename;
  }
});

function tryReopenLastFile() {
  fs.ensureFileSync(pathToLastOpen);

  const lastFilename = fs.readFileSync(pathToLastOpen, 'utf8');
  if(lastFilename.length > 0 && fs.existsSync(lastFilename)) {
    const contents = fs.readFileSync(lastFilename);
    let lastGraph;
    try {
      lastGraph = JSON.parse(contents);
    }
    catch(e) {
      console.log(`Couldn't parse JSON file at ${lastFilename}! Error: ${e}`);
    }
    if(lastGraph !== undefined &&
       lastGraph.clips !== undefined &&
       lastGraph.questions !== undefined &&
       lastGraph.script !== undefined) {
      return { lastFilename, lastGraph };
    }
  }
  return { error: `Problem opening last file: ${ lastFilename }` };
}


//TODO: refactor this. it's a mess.
function buildMenu(dispatch) {
  let menu;
  let template;

  if (process.platform === 'darwin') {
    template = [
      {
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
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Open',
            accelerator: 'Command+O',
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
            accelerator: 'Command+S',
            click() {
              dispatch({
                type: fileActionTypes.SAVE_FILE
              });
            }
          },
          {
            label: 'Save &As',
            accelerator: 'Shift+Command+S',
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
              Window.close();
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: (process.env.NODE_ENV === 'development')
        ? [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click() {
              Window.reload();
            }
          },
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click() {
              Window.setFullScreen(!Window.isFullScreen());
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click() {
              Window.toggleDevTools();
            }
          }
        ]
        : [
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click() {
              Window.setFullScreen(!Window.isFullScreen());
            }
          }
        ]
      },
      {
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
      }
    ];
  }
  else {
    template = [{
      label: '&File',
      submenu: [
        {
          label: '&Open',
          accelerator: 'Ctrl+O',
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
          accelerator: 'Ctrl+S',
          click() {
            dispatch({
              type: fileActionTypes.SAVE_FILE
            });
          }
        },
        {
          label: 'Save &As',
          accelerator: 'Shift+Ctrl+S',
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
            Window.close();
          }
        }
      ]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          Window.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          Window.setFullScreen(!Window.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          Window.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          Window.setFullScreen(!Window.isFullScreen());
        }
      }]
    }];
  }
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


