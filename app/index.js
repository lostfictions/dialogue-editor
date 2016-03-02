//App styles
import './app.css';

//React/Redux
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

//Node/Electron
import path from 'path';
import fs from 'fs-extra';
import { remote } from 'electron';

import Immutable, { Set } from 'immutable';

import configureStore from './Store/configureStore';
import App from './Containers/App';
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

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

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
    const lastGraph = fs.readJsonSync(lastFilename);
    if(lastGraph.clips !== undefined &&
       lastGraph.questions !== undefined &&
       lastGraph.script !== undefined) {
      return { lastFilename, lastGraph };
    }
  }
  return { error: `Problem opening last file: ${ lastFilename }` };
}

