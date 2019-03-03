// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { MONITOR_SYNC_STEP_STATE } from './constants';

export function syncStepState(args = {}) {
  return {
    type: MONITOR_SYNC_STEP_STATE,
    data: args,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MONITOR_SYNC_STEP_STATE:
      return {
        ...state,
        stepState: {
          ...state.stepState,
          username: action.data.username,
          projectId: action.data.projectId,
          projectName: action.data.projectName,
          title: action.data.title,
          nameExist: action.data.nameExist,
        },
      };

    default:
      return state;
  }
}
