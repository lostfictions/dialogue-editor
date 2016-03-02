import { createStore } from 'redux';
import rootReducer from '../Reducers';
import DevTools from '../Containers/DevTools';

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, DevTools.instrument());

  if (module.hot) {
    module.hot.accept('../Reducers', () =>
      store.replaceReducer(require('../Reducers'))
    );
  }

  return store;
}
