import {
  MONITOR_NEED_RE_LOGIN,
} from '../../../../src/features/monitor/redux/constants';

import {
  needReLogin,
  reducer,
} from '../../../../src/features/monitor/redux/needReLogin';

describe('monitor/redux/needReLogin', () => {
  it('returns correct action by needReLogin', () => {
    expect(needReLogin()).toHaveProperty('type', MONITOR_NEED_RE_LOGIN);
  });

  it('handles action type MONITOR_NEED_RE_LOGIN correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: MONITOR_NEED_RE_LOGIN }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
