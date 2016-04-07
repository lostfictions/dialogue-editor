import { actionTypes } from '../Components/Columns/QuestionsColumn';

import Immutable, { Map } from 'immutable';

const makeQuestion = (id, x = 0, y = 0) => ({
  id,
  x,
  y,
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
    case actionTypes.ADD_QUESTION: {
      const qIds = state.get('questionIds');
      let i = 1;
      while(qIds.has(i)) {
        i++;
      }

      let s = state;
      s = s.update('questionIds', qids => qids.add(i));
      s = s.updateIn(['graph', 'questions'], questions => questions.unshift(Immutable.fromJS(makeQuestion(i, action.x, action.y))));
      return s;
    }
    case actionTypes.REMOVE_QUESTION: {
      const i = getIndex(state, 'questions', action.id);

      let s = state;
      s = s.update('questionIds', qids => qids.delete(action.id));
      s = s.updateIn(['graph', 'questions'], questions => questions.splice(i, 1));
      return s;
    }
    default:
      return state;
  }
};
