import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_GET_AVAILABLE_TITLE_BEGIN,
  MONITOR_GET_AVAILABLE_TITLE_SUCCESS,
  MONITOR_GET_AVAILABLE_TITLE_FAILURE,
  MONITOR_GET_AVAILABLE_TITLE_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  getAvailableTitle,
  dismissGetAvailableTitleError,
  reducer,
} from '../../../../src/features/monitor/redux/getAvailableTitle';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/getAvailableTitle', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAvailableTitle succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableTitle())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_TITLE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_TITLE_SUCCESS);
      });
  });

  it('dispatches failure action when getAvailableTitle fails', () => {
    const store = mockStore({});

    return store.dispatch(getAvailableTitle({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_GET_AVAILABLE_TITLE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_GET_AVAILABLE_TITLE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAvailableTitleError', () => {
    const expectedAction = {
      type: MONITOR_GET_AVAILABLE_TITLE_DISMISS_ERROR,
    };
    expect(dismissGetAvailableTitleError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_GET_AVAILABLE_TITLE_BEGIN correctly', () => {
    const prevState = { getAvailableTitlePending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_TITLE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableTitlePending).toBe(true);
  });

  it('handles action type MONITOR_GET_AVAILABLE_TITLE_SUCCESS correctly', () => {
    const prevState = { getAvailableTitlePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_TITLE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableTitlePending).toBe(false);
  });

  it('handles action type MONITOR_GET_AVAILABLE_TITLE_FAILURE correctly', () => {
    const prevState = { getAvailableTitlePending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_TITLE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableTitlePending).toBe(false);
    expect(state.getAvailableTitleError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_GET_AVAILABLE_TITLE_DISMISS_ERROR correctly', () => {
    const prevState = { getAvailableTitleError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_GET_AVAILABLE_TITLE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAvailableTitleError).toBe(null);
  });
});

