import toolbar from './toolbar';
import graphView from './graphView';
import questions from './questions';
import clips from './clips';
import shared from './shared';

//From https://github.com/acdlite/reduce-reducers
function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous
    );
}

const rootReducer = reduceReducers(
  toolbar,
  graphView,
  questions,
  clips,
  shared
);

export default rootReducer;