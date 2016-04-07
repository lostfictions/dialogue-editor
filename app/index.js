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
import buildMenu from './Electron/buildMenu';

import Immutable, { Set } from 'immutable';

import configureStore from './Store/configureStore';
import { viewModes } from './Constants';

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
//Dump state to console:
const b = document.createElement('button');
b.innerHTML = 'Dump';
b.style.position = 'absolute';
b.style.right = '10px';
b.style.bottom = '10px';
b.className = 'btn btn-warning';
b.onclick = () => console.log(store.getState().get('graph'));
document.body.appendChild(b);
*/

/*
//Perf checking:
if (process.env.NODE_ENV !== 'production') {
  const perf = require('react-addons-perf');
  let startPerf, endPerf;

  const perfButton = document.createElement('button');
  perfButton.style.position = 'absolute';
  perfButton.style.right = '10px';
  perfButton.style.bottom = '10px';
  document.body.appendChild(perfButton);

  perfButton.innerHTML = 'Start';
  perfButton.className = 'btn btn-success';

  startPerf = () => {
    console.log('Starting perf!');
    perf.start();
    perfButton.innerHTML = 'Stop';
    perfButton.className = 'btn btn-danger';
    perfButton.onclick = endPerf;
  };
  endPerf = () => {
    console.log('Stopping perf!');
    perf.stop();
    try {
      perf.printWasted();
    }
    catch(e) {
      console.log(`Can't print wasted! It exploded for some reason. Error: ${e}`);
    }
    perfButton.innerHTML = 'Start';
    perfButton.className = 'btn btn-success';
    perfButton.onclick = startPerf;
  };
  perfButton.onclick = startPerf;
}
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
