import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_LOGOUT_BEGIN,
  MONITOR_LOGOUT_SUCCESS,
  MONITOR_LOGOUT_FAILURE,
  MONITOR_LOGOUT_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  logout,
  dismissLogoutError,
  reducer,
} from '../../../../src/features/monitor/redux/logout';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/logout', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when logout succeeds', () => {
    const store = mockStore({});

    return store.dispatch(logout())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_LOGOUT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_LOGOUT_SUCCESS);
      });
  });

  it('dispatches failure action when logout fails', () => {
    const store = mockStore({});

    return store.dispatch(logout({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_LOGOUT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_LOGOUT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissLogoutError', () => {
    const expectedAction = {
      type: MONITOR_LOGOUT_DISMISS_ERROR,
    };
    expect(dismissLogoutError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_LOGOUT_BEGIN correctly', () => {
    const prevState = { logoutPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGOUT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.logoutPending).toBe(true);
  });

  it('handles action type MONITOR_LOGOUT_SUCCESS correctly', () => {
    const prevState = { logoutPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGOUT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.logoutPending).toBe(false);
  });

  it('handles action type MONITOR_LOGOUT_FAILURE correctly', () => {
    const prevState = { logoutPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGOUT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.logoutPending).toBe(false);
    expect(state.logoutError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_LOGOUT_DISMISS_ERROR correctly', () => {
    const prevState = { logoutError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGOUT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.logoutError).toBe(null);
  });
});

