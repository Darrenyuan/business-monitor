import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_GET_AVAILABLE_PROJECTS_SIZE_BEGIN,
  MONITOR_GET_AVAILABLE_PROJECTS_SIZE_SUCCESS,
  MONITOR_GET_AVAILABLE_PROJECTS_SIZE_FAILURE,
  MONITOR_GET_AVAILABLE_PROJECTS_SIZE_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  getAvailableProjectsSize,
  dismissGetAvailableProjectsSizeError,
  reducer,
} from '../../../../src/features/monitor/redux/getAvailableProjectsSize';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/getAvailableProjectsSize', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAvailableProjectsSize succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectsSize())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_SIZE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_SIZE_SUCCESS);
      });
  });

  it('dispatches failure action when getAvailableProjectsSize fails', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableProjectsSize({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_SIZE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_PROJECTS_SIZE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAvailableProjectsSizeError', () => {
    const expectedAction = {
      type: MONITOR_GET_AVAILABLE_PROJECTS_SIZE_DISMISS_ERROR,
    };
    expect(dismissGetAvailableProjectsSizeError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_SIZE_BEGIN correctly', () => {
    const prevState = { getAvailableProjectsSizePending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_SIZE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsSizePending).toBe(true);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_SIZE_SUCCESS correctly', () => {
    const prevState = { getAvailableProjectsSizePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_SIZE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsSizePending).toBe(false);
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_SIZE_FAILURE correctly', () => {
    const prevState = { getAvailableProjectsSizePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_SIZE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsSizePending).toBe(false);
    expect(state.getAvailableProjectsSizeError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_GET_AVAILABLE_PROJECTS_SIZE_DISMISS_ERROR correctly', () => {
    const prevState = { getAvailableProjectsSizeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_PROJECTS_SIZE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableProjectsSizeError).toBe(null);
  });
});

