import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_LOGIN_BEGIN,
  MONITOR_LOGIN_SUCCESS,
  MONITOR_LOGIN_FAILURE,
  MONITOR_LOGIN_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  login,
  dismissLoginError,
  reducer,
} from '../../../../src/features/monitor/redux/login';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/login', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when login succeeds', () => {
    const store = mockStore({});

    return store.dispatch(login())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_LOGIN_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_LOGIN_SUCCESS);
      });
  });

  it('dispatches failure action when login fails', () => {
    const store = mockStore({});

    return store.dispatch(login({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_LOGIN_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_LOGIN_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissLoginError', () => {
    const expectedAction = {
      type: MONITOR_LOGIN_DISMISS_ERROR,
    };
    expect(dismissLoginError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_LOGIN_BEGIN correctly', () => {
    const prevState = { loginPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGIN_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.loginPending).toBe(true);
  });

  it('handles action type MONITOR_LOGIN_SUCCESS correctly', () => {
    const prevState = { loginPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGIN_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.loginPending).toBe(false);
  });

  it('handles action type MONITOR_LOGIN_FAILURE correctly', () => {
    const prevState = { loginPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGIN_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.loginPending).toBe(false);
    expect(state.loginError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_LOGIN_DISMISS_ERROR correctly', () => {
    const prevState = { loginError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_LOGIN_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.loginError).toBe(null);
  });
});

