import { actionTypes } from '../Components/Columns/ClipsColumn';

import Immutable, { List, Map } from 'immutable';

const makeClip = (id, x = 0, y = 0) => ({
  id,
  x,
  y,
  'next': '',
  'video': {
    'src': '',
    'loop': false
  },
  'strings': {
    'fr': [
      [
        0,
        ''
      ]
    ],
    'en': [
      [
        0,
        ''
      ]
    ],
    'de': [
      [
        0,
        ''
      ]
    ]
  }
});

const getIndex = (state, type, id) => {
  const i = state.getIn(['graph', type]).findIndex(item => item.get('id') === id);
  if(i === -1) {
    throw new Error(`Cannot find node of type ${type} with id ${id}!`);
  }
  return i;
};

export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.CAPTION_TEXT_CHANGED: {
      const ci = getIndex(state, 'clips', action.id);
      return state.setIn(
        ['graph', 'clips', ci, 'strings', action.lang, action.index, 1],
        action.text
      );
    }
    case actionTypes.CAPTION_TIME_CHANGED: {
      const ci = getIndex(state, 'clips', action.id);

      //We have to update the time for each of the languages!
      return state.updateIn(
        ['graph', 'clips', ci, 'strings'], strings =>
          strings.map(v =>
            v.setIn([action.index, 0], action.time)
        )
      );
    }
    case actionTypes.CAPTION_ADDED: {
      const ci = getIndex(state, 'clips', action.id);

      //We want to add a caption for each of the languages
      return state.updateIn(['graph', 'clips', ci, 'strings'], strings =>
        strings.map(v =>
          v.push(List([null, '']))
        )
      );
    }
    case actionTypes.CAPTION_REMOVED: {
      const ci = getIndex(state, 'clips', action.id);

      //We want to remove the caption for each of the languages
      return state.updateIn(['graph', 'clips', ci, 'strings'], strings =>
        strings.map(v =>
          v.splice(action.index, 1)
        )
      );
    }
    case actionTypes.CLIP_TARGET_CHANGED: {
      const ci = getIndex(state, 'clips', action.id);
      return state.setIn(['graph', 'clips', ci, 'next'], action.target);
    }
    case actionTypes.CLIP_VIDEO_CHANGED: {
      const ci = getIndex(state, 'clips', action.id);
      return state.setIn(['graph', 'clips', ci, 'video', 'src'], action.src);
    }
    case actionTypes.ADD_CLIP: {
      const cIds = state.get('clipIds');
      let i = 1;
      while(cIds.has(i)) {
        i++;
      }

      let s = state;
      s = s.update('clipIds', cids => cids.add(i));
      s = s.updateIn(['graph', 'clips'], clips => clips.unshift(Immutable.fromJS(makeClip(i, action.x, action.y))));
      return s;
    }
    case actionTypes.REMOVE_CLIP: {
      const i = getIndex(state, 'clips', action.id);

      let s = state;
      s = s.update('clipIds', cids => cids.delete(action.id));
      s = s.updateIn(['graph', 'clips'], clips => clips.splice(i, 1));
      return s;
    }
    default:
      return state;
  }
};
