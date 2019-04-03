import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_FETCH_SEACH_PROJECT_LIST_BEGIN,
  MONITOR_FETCH_SEACH_PROJECT_LIST_SUCCESS,
  MONITOR_FETCH_SEACH_PROJECT_LIST_FAILURE,
  MONITOR_FETCH_SEACH_PROJECT_LIST_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  fetchSeachProjectList,
  dismissFetchSeachProjectListError,
  reducer,
} from '../../../../src/features/monitor/redux/fetchSeachProjectList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/fetchSeachProjectList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchSeachProjectList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchSeachProjectList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_SEACH_PROJECT_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_SEACH_PROJECT_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when fetchSeachProjectList fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchSeachProjectList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_SEACH_PROJECT_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_SEACH_PROJECT_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchSeachProjectListError', () => {
    const expectedAction = {
      type: MONITOR_FETCH_SEACH_PROJECT_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchSeachProjectListError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_FETCH_SEACH_PROJECT_LIST_BEGIN correctly', () => {
    const prevState = { fetchSeachProjectListPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_SEACH_PROJECT_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSeachProjectListPending).toBe(true);
  });

  it('handles action type MONITOR_FETCH_SEACH_PROJECT_LIST_SUCCESS correctly', () => {
    const prevState = { fetchSeachProjectListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_SEACH_PROJECT_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSeachProjectListPending).toBe(false);
  });

  it('handles action type MONITOR_FETCH_SEACH_PROJECT_LIST_FAILURE correctly', () => {
    const prevState = { fetchSeachProjectListPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_SEACH_PROJECT_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSeachProjectListPending).toBe(false);
    expect(state.fetchSeachProjectListError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_FETCH_SEACH_PROJECT_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchSeachProjectListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_SEACH_PROJECT_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSeachProjectListError).toBe(null);
  });
});

