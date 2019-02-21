import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_CREATE_USER_BEGIN,
  MONITOR_CREATE_USER_SUCCESS,
  MONITOR_CREATE_USER_FAILURE,
  MONITOR_CREATE_USER_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  createUser,
  dismissCreateUserError,
  reducer,
} from '../../../../src/features/monitor/redux/createUser';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/createUser', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createUser succeeds', () => {
    const store = mockStore({});

    return store.dispatch(createUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_CREATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_CREATE_USER_SUCCESS);
      });
  });

  it('dispatches failure action when createUser fails', () => {
    const store = mockStore({});

    return store.dispatch(createUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_CREATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_CREATE_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateUserError', () => {
    const expectedAction = {
      type: MONITOR_CREATE_USER_DISMISS_ERROR,
    };
    expect(dismissCreateUserError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_CREATE_USER_BEGIN correctly', () => {
    const prevState = { createUserPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUserPending).toBe(true);
  });

  it('handles action type MONITOR_CREATE_USER_SUCCESS correctly', () => {
    const prevState = { createUserPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUserPending).toBe(false);
  });

  it('handles action type MONITOR_CREATE_USER_FAILURE correctly', () => {
    const prevState = { createUserPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUserPending).toBe(false);
    expect(state.createUserError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_CREATE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { createUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_CREATE_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUserError).toBe(null);
  });
});

