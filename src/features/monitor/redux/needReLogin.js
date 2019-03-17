// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { MONITOR_NEED_RE_LOGIN } from './constants';

export function needReLogin() {
  return {
    type: MONITOR_NEED_RE_LOGIN,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MONITOR_NEED_RE_LOGIN:
      return {
        ...state,
        reLogin: true,
      };

    default:
      return state;
  }
}
