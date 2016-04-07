import { createStore, compose } from 'redux';
import rootReducer from '../Reducers';
import DevTools from '../Containers/DevTools';

export default function configureStore(initialState, enhancers = []) {
  const store = createStore(rootReducer, initialState, compose(...enhancers, DevTools.instrument()));

  if (module.hot) {
    module.hot.accept('../Reducers', () =>
      store.replaceReducer(require('../Reducers'))
    );
  }

  return store;
}
