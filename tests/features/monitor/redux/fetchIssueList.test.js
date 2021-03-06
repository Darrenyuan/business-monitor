import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_FETCH_ISSUE_LIST_BEGIN,
  MONITOR_FETCH_ISSUE_LIST_SUCCESS,
  MONITOR_FETCH_ISSUE_LIST_FAILURE,
  MONITOR_FETCH_ISSUE_LIST_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  fetchIssueList,
  dismissFetchIssueListError,
  reducer,
} from '../../../../src/features/monitor/redux/fetchIssueList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/fetchIssueList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchIssueList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchIssueList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_ISSUE_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_ISSUE_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when fetchIssueList fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchIssueList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_ISSUE_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_ISSUE_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchIssueListError', () => {
    const expectedAction = {
      type: MONITOR_FETCH_ISSUE_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchIssueListError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_FETCH_ISSUE_LIST_BEGIN correctly', () => {
    const prevState = { fetchIssueListPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_ISSUE_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchIssueListPending).toBe(true);
  });

  it('handles action type MONITOR_FETCH_ISSUE_LIST_SUCCESS correctly', () => {
    const prevState = { fetchIssueListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_ISSUE_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchIssueListPending).toBe(false);
  });

  it('handles action type MONITOR_FETCH_ISSUE_LIST_FAILURE correctly', () => {
    const prevState = { fetchIssueListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_ISSUE_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchIssueListPending).toBe(false);
    expect(state.fetchIssueListError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_FETCH_ISSUE_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchIssueListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_ISSUE_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchIssueListError).toBe(null);
  });
});

