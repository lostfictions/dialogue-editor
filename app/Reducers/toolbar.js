import { actionTypes } from '../Components/Toolbar';

import fs from 'fs-extra';
import Immutable, { Map, Set } from 'immutable';


export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.SET_VIEW_MODE:
      return state.set('viewMode', action.viewMode);
    case actionTypes.SET_LANG:
      return state.set('lang', action.lang);
    case actionTypes.SET_ZOOM:
      return state.set('zoom', action.zoom);
    case actionTypes.NEW_FILE: {
      let s = state;
      s = s.set('currentFilename', '');
      s = s.set('graph', Immutable.fromJS({
        'script': '',
        'questions': [ ],
        'clips': [ ]
      }));
      s = s.set('questionIds', Set());
      s = s.set('clipIds', Set());
      return s;
    }
    case actionTypes.OPEN_FILE: {
      if(fs.existsSync(action.filename)) {
        const nextGraph = fs.readJsonSync(action.filename);
        let s = state;
        s = s.set('questionIds', Set(nextGraph.questions.map(q => q.id)));
        s = s.set('clipIds', Set(nextGraph.clips.map(c => c.id)));
        s = s.set('graph', Immutable.fromJS(nextGraph));
        s = s.set('currentFilename', action.filename);
        return s;
      }
      throw new Error(`Filename ${action.filename} doesn't exist!`);
    }
    case actionTypes.SAVE_FILE: {
      const currentFilename = state.get('currentFilename');
      if(currentFilename !== undefined && fs.existsSync(currentFilename)) {
        fs.writeJson(currentFilename, state.get('graph'), (err) => {
          if(err) {
            console.log(err);
          }
          else {
            console.log(`Saved file over ${currentFilename}!`);
          }
        });
      }
      return state;
    }
    case actionTypes.SAVE_FILE_AS: {
      let fn = action.filename;
      if(!fn.endsWith('.json')) {
        fn = fn + '.json';
      }
      fs.ensureFileSync(fn);
      fs.writeJson(fn, state.get('graph'), (err) => {
        if(err) {
          console.log(err);
        }
        else {
          console.log(`Saved file as (new filename) ${fn}!`);
        }
      });
      return state.set('currentFilename', fn);
    }
    default:
      return state;
  }
};
