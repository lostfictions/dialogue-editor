import { sharedActionTypes } from '../Constants';

import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch (action.type) {
    case sharedActionTypes.FILTER_COLUMN: {
      return state.setIn(['filters', action.column], action.query);
    }
    case sharedActionTypes.FOCUS_ITEM: {
      // console.log(`Focusing ${ action.column } to ${ action.id }`);
      return state.setIn(['focused', action.column], action.id);
    }
    default:
      return state;
  }
};
