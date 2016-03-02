import { actionTypes } from '../Components/Toolbar';

import fs from 'fs-extra';
import Immutable, { Map, Set, OrderedMap } from 'immutable';


export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.SET_VIEW_MODE:
      return state.set('viewMode', action.viewMode);
    case actionTypes.SET_LANG:
      return state.set('lang', action.lang);
    case actionTypes.SET_ZOOM:
      return state.set('zoom', action.zoom);
    case actionTypes.OPEN_FILE:
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
    case actionTypes.SAVE_FILE_AS:
      let fn = action.filename;
      if(!fn.endsWith('.json')) {
        fn = fn + '.json';
      }
      fs.ensureFileSync(fn);
      fs.writeJson(fn, state.graph, (err) => {
        if(err) {
          console.log(err);
        }
      });
      return state.set('currentFilename', fn);
    default:
      return state;
  }
};
