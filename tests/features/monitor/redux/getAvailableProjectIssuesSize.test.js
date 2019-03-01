import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_BEGIN,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_SUCCESS,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_FAILURE,
  MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  getAvailableProjectIssuesSize,
  dismissGetAvailableProjectIssuesSizeError,
  reducer,
} from '../../../../src/features/monitor/redux/getAvailableProjectIssuesSize';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/getAvailableProjectIssuesSize', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAvailableProjectIssuesSize succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectIssuesSize())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_SUCCESS);
      });
  });

  it('dispatches failure action when getAvailableProjectIssuesSize fails', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectIssuesSize({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAvailableProjectIssuesSizeError', () => {
    const expectedAction = {
      type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_DISMISS_ERROR,
    };
    expect(dismissGetAvailableProjectIssuesSizeError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_BEGIN correctly', () => {
    const prevState = { getAvailableProjectIssuesSizePending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesSizePending).toBe(true);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_SUCCESS correctly', () => {
    const prevState = { getAvailableProjectIssuesSizePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesSizePending).toBe(false);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_FAILURE correctly', () => {
    const prevState = { getAvailableProjectIssuesSizePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesSizePending).toBe(false);
    expect(state.getAvailableProjectIssuesSizeError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_DISMISS_ERROR correctly', () => {
    const prevState = { getAvailableProjectIssuesSizeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECT_ISSUES_SIZE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectIssuesSizeError).toBe(null);
  });
});

