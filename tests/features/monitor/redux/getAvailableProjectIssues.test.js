import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_BEGIN,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SUCCESS,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_FAILURE,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  getAvailableProjectIssues,
  dismissGetAvailableProjectIssuesError,
  reducer,
} from '../../../../src/features/monitor/redux/getAvailableProjectIssues';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/getAvailableProjectIssues', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAvailableProjectIssues succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectIssues())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SUCCESS);
      });
  });

  it('dispatches failure action when getAvailableProjectIssues fails', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectIssues({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAvailableProjectIssuesError', () => {
    const expectedAction = {
      type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_DISMISS_ERROR,
    };
    expect(dismissGetAvailableProjectIssuesError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_BEGIN correctly', () => {
    const prevState = { getAvailableProjectIssuesPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesPending).toBe(true);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SUCCESS correctly', () => {
    const prevState = { getAvailableProjectIssuesPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesPending).toBe(false);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_FAILURE correctly', () => {
    const prevState = { getAvailableProjectIssuesPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesPending).toBe(false);
    expect(state.getAvailableProjectIssuesError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_DISMISS_ERROR correctly', () => {
    const prevState = { getAvailableProjectIssuesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesError).toBe(null);
  });
});

