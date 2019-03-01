import {
  MONITOR_FETCH_PROJECT_LIST_BEGIN,
  MONITOR_FETCH_PROJECT_LIST_SUCCESS,
  MONITOR_FETCH_PROJECT_LIST_FAILURE,
  MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR,
} from './constants';

import { apiFetchProjectList } from '../axios/api';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchProjectList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: MONITOR_FETCH_PROJECT_LIST_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = apiFetchProjectList(args);
      doRequest.then(
        res => {
          dispatch({
            type: MONITOR_FETCH_PROJECT_LIST_SUCCESS,
            data: {
              items: res.data.data.data,
              page: res.data.data.page,
              pageSize: res.data.data.pageSize,
              total: res.data.data.total,
            },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: MONITOR_FETCH_PROJECT_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissFetchProjectListError() {
  return {
    type: MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MONITOR_FETCH_PROJECT_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        projectList: {
          ...state.projectList,
          fetchProjectListPending: true,
          fetchProjectListError: null,
        },
      };

    case MONITOR_FETCH_PROJECT_LIST_SUCCESS:
      const byId = {};
      const items = [];
      action.data.items.forEach(item => {
        items.push(item.id);
        byId[item.id] = item;
      });
      return {
        ...state,
        projectList: {
          ...state.projectList,
          byId,
          items,
          fetchProjectListPending: false,
          fetchProjectListError: null,
          page: action.data.page,
          pageSize: action.data.pageSize,
          total: action.data.total,
        },
      };

    case MONITOR_FETCH_PROJECT_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        projectList: {
          ...state.projectList,
          fetchProjectListPending: false,
          fetchProjectListError: action.data.error,
        },
      };

    case MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        projectList: {
          ...state.projectList,
          fetchProjectListPending: false,
          fetchProjectListError: null,
        },
      };

    default:
      return state;
  }
}
