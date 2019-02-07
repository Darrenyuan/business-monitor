import {
  MONITOR_LANGUAGE_SET_ZH,
} from '../../../../src/features/monitor/redux/constants';

import {
  languageSetZh,
  reducer,
} from '../../../../src/features/monitor/redux/languageSetZh';

describe('monitor/redux/languageSetZh', () => {
  it('returns correct action by languageSetZh', () => {
    expect(languageSetZh()).toHaveProperty('type', MONITOR_LANGUAGE_SET_ZH);
  });

  it('handles action type MONITOR_LANGUAGE_SET_ZH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: MONITOR_LANGUAGE_SET_ZH }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
