import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_CREATE_PROJECT_BEGIN,
  MONITOR_CREATE_PROJECT_SUCCESS,
  MONITOR_CREATE_PROJECT_FAILURE,
  MONITOR_CREATE_PROJECT_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  createProject,
  dismissCreateProjectError,
  reducer,
} from '../../../../src/features/monitor/redux/createProject';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/createProject', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createProject succeeds', () => {
    const store = mockStore({});

    return store.dispatch(createProject())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_CREATE_PROJECT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_CREATE_PROJECT_SUCCESS);
      });
  });

  it('dispatches failure action when createProject fails', () => {
    const store = mockStore({});

    return store.dispatch(createProject({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_CREATE_PROJECT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_CREATE_PROJECT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateProjectError', () => {
    const expectedAction = {
      type: MONITOR_CREATE_PROJECT_DISMISS_ERROR,
    };
    expect(dismissCreateProjectError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_CREATE_PROJECT_BEGIN correctly', () => {
    const prevState = { createProjectPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_PROJECT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createProjectPending).toBe(true);
  });

  it('handles action type MONITOR_CREATE_PROJECT_SUCCESS correctly', () => {
    const prevState = { createProjectPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_PROJECT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createProjectPending).toBe(false);
  });

  it('handles action type MONITOR_CREATE_PROJECT_FAILURE correctly', () => {
    const prevState = { createProjectPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_PROJECT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createProjectPending).toBe(false);
    expect(state.createProjectError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_CREATE_PROJECT_DISMISS_ERROR correctly', () => {
    const prevState = { createProjectError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_PROJECT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createProjectError).toBe(null);
  });
});

