import { combineReducers } from 'redux';
import { LOGOUT } from './actionTypes';
import user from './user/reducer';

const appReducer = combineReducers({
  user,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
