import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_FETCH_PROJECT_LIST_BEGIN,
  MONITOR_FETCH_PROJECT_LIST_SUCCESS,
  MONITOR_FETCH_PROJECT_LIST_FAILURE,
  MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  fetchProjectList,
  dismissFetchProjectListError,
  reducer,
} from '../../../../src/features/monitor/redux/fetchProjectList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/fetchProjectList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchProjectList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchProjectList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_PROJECT_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_PROJECT_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when fetchProjectList fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchProjectList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_PROJECT_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_PROJECT_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchProjectListError', () => {
    const expectedAction = {
      type: MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchProjectListError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_FETCH_PROJECT_LIST_BEGIN correctly', () => {
    const prevState = { fetchProjectListPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectListPending).toBe(true);
  });

  it('handles action type MONITOR_FETCH_PROJECT_LIST_SUCCESS correctly', () => {
    const prevState = { fetchProjectListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectListPending).toBe(false);
  });

  it('handles action type MONITOR_FETCH_PROJECT_LIST_FAILURE correctly', () => {
    const prevState = { fetchProjectListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectListPending).toBe(false);
    expect(state.fetchProjectListError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectListError).toBe(null);
  });
});

