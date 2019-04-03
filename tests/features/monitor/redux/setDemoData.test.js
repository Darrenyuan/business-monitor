import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MONITOR_SET_DEMO_DATA_BEGIN,
  MONITOR_SET_DEMO_DATA_SUCCESS,
  MONITOR_SET_DEMO_DATA_FAILURE,
  MONITOR_SET_DEMO_DATA_DISMISS_ERROR,
} from '../../../../src/features/monitor/redux/constants';

import {
  setDemoData,
  dismissSetDemoDataError,
  reducer,
} from '../../../../src/features/monitor/redux/setDemoData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('monitor/redux/setDemoData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when setDemoData succeeds', () => {
    const store = mockStore({});

    return store.dispatch(setDemoData())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_SET_DEMO_DATA_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_SET_DEMO_DATA_SUCCESS);
      });
  });

  it('dispatches failure action when setDemoData fails', () => {
    const store = mockStore({});

    return store.dispatch(setDemoData({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MONITOR_SET_DEMO_DATA_BEGIN);
        expect(actions[1]).toHaveProperty('type', MONITOR_SET_DEMO_DATA_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSetDemoDataError', () => {
    const expectedAction = {
      type: MONITOR_SET_DEMO_DATA_DISMISS_ERROR,
    };
    expect(dismissSetDemoDataError()).toEqual(expectedAction);
  });

  it('handles action type MONITOR_SET_DEMO_DATA_BEGIN correctly', () => {
    const prevState = { setDemoDataPending: false };
    const state = reducer(
      prevState,
      { type: MONITOR_SET_DEMO_DATA_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setDemoDataPending).toBe(true);
  });

  it('handles action type MONITOR_SET_DEMO_DATA_SUCCESS correctly', () => {
    const prevState = { setDemoDataPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_SET_DEMO_DATA_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setDemoDataPending).toBe(false);
  });

  it('handles action type MONITOR_SET_DEMO_DATA_FAILURE correctly', () => {
    const prevState = { setDemoDataPending: true };
    const state = reducer(
      prevState,
      { type: MONITOR_SET_DEMO_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setDemoDataPending).toBe(false);
    expect(state.setDemoDataError).toEqual(expect.anything());
  });

  it('handles action type MONITOR_SET_DEMO_DATA_DISMISS_ERROR correctly', () => {
    const prevState = { setDemoDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MONITOR_SET_DEMO_DATA_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setDemoDataError).toBe(null);
  });
});

