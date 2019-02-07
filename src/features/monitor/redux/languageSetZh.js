// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  MONITOR_LANGUAGE_SET_ZH,
} from './constants';

export function languageSetZh() {
  return {
    type: MONITOR_LANGUAGE_SET_ZH,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MONITOR_LANGUAGE_SET_ZH:
      return {
        ...state,
        language: 'zh'
      };

    default:
      return state;
  }
}
