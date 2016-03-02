import { graphAndListViewActionTypes as actionTypes } from '../Constants';

import Immutable, { List, Map } from 'immutable';

const getIndex = (state, type, id) => {
  const i = state.getIn(['graph', type]).findIndex(item => item.get('id') === id);
  if(i === -1) {
    throw new Error(`Cannot find node of type ${type} with id ${id}!`);
  }
  return i;
};

export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.CHOICE_TEXT_CHANGED: {
      const qi = getIndex(state, 'questions', action.id);
      return state.setIn(
        ['graph', 'questions', qi, 'choices', action.index, 'strings', action.lang],
        action.text
      );
    }
    case actionTypes.CHOICE_TARGET_CHANGED: {
      const qi = getIndex(state, 'questions', action.id);
      return state.setIn(
        ['graph', 'questions', qi, 'choices', action.index, 'answer'],
        action.target
      );
    }
    case actionTypes.CHOICE_ADDED: {
      const qi = getIndex(state, 'questions', action.id);
      return state.updateIn(
        ['graph', 'questions', qi, 'choices'], choices => choices.push(
          Immutable.fromJS({
            'strings': {
              'fr': '',
              'en': '',
              'de': ''
            },
            'answer': null
          })
        )
      );
    }
    case actionTypes.CHOICE_REMOVED: {
      const qi = getIndex(state, 'questions', action.id);
      return state.updateIn(
        ['graph', 'questions', qi, 'choices'],
        choices => choices.splice(action.index, 1)
      );
    }
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
    case actionTypes.ADD_QUESTION: {
      const qIds = state.get('questionIds');
      let i = 1;
      while(qIds.has(i)) {
        i++;
      }

      let s = state;
      s = s.update('questionIds', qids => qids.add(i));
      s = s.updateIn(['graph', 'questions'], questions => questions.unshift(Immutable.fromJS({
        'id': i,
        'x': action.x || 0,
        'y': action.y || 0,
        'choices': [
          {
            'strings': {
              'fr': '',
              'en': '',
              'de': ''
            },
            'answer': ''
          }
        ]
      })));
      return s;
    }
    case actionTypes.REMOVE_QUESTION: {
      const i = getIndex(state, 'questions', action.id);

      let s = state;
      s = s.update('questionIds', qids => qids.delete(action.id));
      s = s.updateIn(['graph', 'questions'], questions => questions.splice(i, 1));
      return s;
    }
    case actionTypes.ADD_CLIP: {
      const cIds = state.get('clipIds');
      let i = 1;
      while(cIds.has(i)) {
        i++;
      }

      let s = state;
      s = s.update('clipIds', cids => cids.add(i));
      s = s.updateIn(['graph', 'clips'], clips => clips.unshift(Immutable.fromJS({
        'id': i,
        'x': action.x || 0,
        'y': action.y || 0,
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
      })));
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
