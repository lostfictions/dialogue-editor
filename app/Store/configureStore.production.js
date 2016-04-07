import { createStore, compose } from 'redux';
import rootReducer from '../Reducers';

export default function configureStore(initialState, enhancers = []) {
  if(enhancers.length > 0) {
    return createStore(rootReducer, initialState, compose(...enhancers));
  }
  return createStore(rootReducer, initialState);
}
