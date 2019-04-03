import {
    MONITOR_FETCH_REPLIES_LIST_BEGIN,
    MONITOR_FETCH_REPLIES_LIST_SUCCESS,
    MONITOR_FETCH_REPLIES_LIST_FAILURE,
    MONITOR_FETCH_REPLIES_LIST_DISMISS_ERROR,
} from './constants';
import { apiFetchRepliesList } from '../axios/api'


// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchRepliesList(args = {}) {
    return dispatch => {
        // optionally you can have getState as the second argument
        dispatch({
            type: MONITOR_FETCH_REPLIES_LIST_BEGIN,
        });

        // Return a promise so that you could control UI flow without states in the store.
        // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
        // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
        // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
        const promise = new Promise((resolve, reject) => {
            // doRequest is a placeholder Promise. You should replace it with your own logic.
            // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
            // args.error here is only for test coverage purpose.
            const doRequest = apiFetchRepliesList(args);
            doRequest.then(
                res => {
                    console.log('hRepliesList', res.data.data);
                    dispatch({
                        type: MONITOR_FETCH_REPLIES_LIST_SUCCESS,
                        data: {
                            items: res.data.data,
                        },
                    });
                    resolve(res);
                },
                // Use rejectHandler as the second argument so that render errors won't be caught.
                err => {
                    dispatch({
                        type: MONITOR_FETCH_REPLIES_LIST_FAILURE,
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
export function dismissFetchRepliesListError() {
    return {
        type: MONITOR_FETCH_REPLIES_LIST_DISMISS_ERROR
    };
}

export function reducer(state, action) {
    switch (action.type) {
        case MONITOR_FETCH_REPLIES_LIST_BEGIN:
            // Just after a request is sent
            return {
                ...state,
                repliesList: {
                    ...state.repliesList,
                    fetchRepliesListPending: true,
                    fetchRepliesListError: null,
                },
            };
        case MONITOR_FETCH_REPLIES_LIST_SUCCESS:
            const byId = {};
            const items = [];
            action.data.items.forEach(item => {
                items.push(item.commentId);
                byId[item.commentId] = item;
            });
            return {
                ...state,
                repliesList: {
                    ...state.repliesList,
                    byId,
                    items,
                    fetchRepliesListPending: false,
                    fetchRepliesListError: null,
                },
            };

        case MONITOR_FETCH_REPLIES_LIST_FAILURE:
            // The request is failed
            return {
                ...state,
                repliesList: {
                    ...state.repliesList,
                    fetchRepliesListPending: false,
                    fetchRepliesListError: action.data.error,
                },
            };

        case MONITOR_FETCH_REPLIES_LIST_DISMISS_ERROR:
            // Dismiss the request failure error
            return {
                ...state,
                repliesList: {
                    ...state.repliesList,
                    fetchRepliesListPending: false,
                    fetchRepliesListError: null,
                },
            };

        default:
            return state;
    }
}