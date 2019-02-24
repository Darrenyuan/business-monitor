import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_GET_AVAILABLE_PROJECTS_BEGIN,
  MONITOR_GET_AVAILABLE_PROJECTS_SUCCESS,
  MONITOR_GET_AVAILABLE_PROJECTS_FAILURE,
  MONITOR_GET_AVAILABLE_PROJECTS_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  getAvailableProjects,
  dismissGetAvailableProjectsError,
  reducer,
} from '../../../../src/features/monitor/redux/getAvailableProjects';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/getAvailableProjects', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAvailableProjects succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjects())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_SUCCESS);
      });
  });

  it('dispatches failure action when getAvailableProjects fails', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjects({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAvailableProjectsError', () => {
    const expectedAction = {
      type: MONITOR_GET_AVAILABLE_PROJECTS_DISMISS_ERROR,
    };
    expect(dismissGetAvailableProjectsError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_BEGIN correctly', () => {
    const prevState = { getAvailableProjectsPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsPending).toBe(true);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_SUCCESS correctly', () => {
    const prevState = { getAvailableProjectsPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsPending).toBe(false);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_FAILURE correctly', () => {
    const prevState = { getAvailableProjectsPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsPending).toBe(false);
    expect(state.getAvailableProjectsError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_DISMISS_ERROR correctly', () => {
    const prevState = { getAvailableProjectsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsError).toBe(null);
  });
});

