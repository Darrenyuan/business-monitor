import {
  MONITOR_SYNC_STEP_STATE,
} from '../../../../src/features/monitor/redux/constants';

import {
  syncStepState,
  reducer,
} from '../../../../src/features/monitor/redux/syncStepState';

describe('monitor/redux/syncStepState', () => {
  it('returns correct action by syncStepState', () => {
    expect(syncStepState()).toHaveProperty('type', MONITOR_SYNC_STEP_STATE);
  });

  it('handles action type MONITOR_SYNC_STEP_STATE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: MONITOR_SYNC_STEP_STATE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
