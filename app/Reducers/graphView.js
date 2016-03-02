import { actionTypes } from '../Components/GraphView';
import { nodeTypes } from '../Constants';
import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch(action.type) {
    case actionTypes.DRAG_NODE:
      switch(action.nodeType) {
        case nodeTypes.QUESTION_NODE: {
          const i = state.getIn(['graph', 'questions']).findIndex(q => q.id === action.id);
          if(i !== -1) {
            let s = state;
            s = s.updateIn(['graph', 'questions', i, 'x'], x => x + action.delta.x);
            s = s.updateIn(['graph', 'questions', i, 'y'], y => y + action.delta.y);
            return s;
          }
          throw new Error(`Cannot find node of type ${action.nodeType} with id ${action.id}!`);
        }
        case nodeTypes.CLIP_NODE: {
          const i = state.getIn(['graph', 'clips']).findIndex(c => c.id === action.id);
          if(i !== -1) {
            let s = state;
            s = s.updateIn(['graph', 'clips', i, 'x'], x => x + action.delta.x);
            s = s.updateIn(['graph', 'clips', i, 'y'], y => y + action.delta.y);
            return s;
          }
          throw new Error(`Cannot find node of type ${action.nodeType} with id ${action.id}!`);
        }
        default:
          throw new Error(`Unhandled node type: ${action.nodeType} with id ${action.id}!`);
      }
    /*eslint no-fallthrough:0 */ //HACK: eslint can't figure out flow control with nested switches i guess
    default:
      return state;
  }
};
