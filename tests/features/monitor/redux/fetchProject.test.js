import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_FETCH_PROJECT_BEGIN,
  MONITOR_FETCH_PROJECT_SUCCESS,
  MONITOR_FETCH_PROJECT_FAILURE,
  MONITOR_FETCH_PROJECT_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  fetchProject,
  dismissFetchProjectError,
  reducer,
} from '../../../../src/features/monitor/redux/fetchProject';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/fetchProject', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchProject succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchProject())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_PROJECT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_PROJECT_SUCCESS);
      });
  });

  it('dispatches failure action when fetchProject fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchProject({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_FETCH_PROJECT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_FETCH_PROJECT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchProjectError', () => {
    const expectedAction = {
      type: MONITOR_FETCH_PROJECT_DISMISS_ERROR,
    };
    expect(dismissFetchProjectError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_FETCH_PROJECT_BEGIN correctly', () => {
    const prevState = { fetchProjectPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectPending).toBe(true);
  });

  it('handles action type MONITOR_FETCH_PROJECT_SUCCESS correctly', () => {
    const prevState = { fetchProjectPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectPending).toBe(false);
  });

  it('handles action type MONITOR_FETCH_PROJECT_FAILURE correctly', () => {
    const prevState = { fetchProjectPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectPending).toBe(false);
    expect(state.fetchProjectError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_FETCH_PROJECT_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_FETCH_PROJECT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchProjectError).toBe(null);
  });
});

