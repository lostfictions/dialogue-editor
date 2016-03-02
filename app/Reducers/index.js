import toolbar from './toolbar';
import graphView from './graphView';
import graphAndListView from './graphAndListView';

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
  graphAndListView
);

export default rootReducer;