import {
  MONITOR_LANGUAGE_SET_EN,
} from '../../../../src/features/monitor/redux/constants';

import {
  languageSetEn,
  reducer,
} from '../../../../src/features/monitor/redux/languageSetEn';

describe('monitor/redux/languageSetEn', () => {
  it('returns correct action by languageSetEn', () => {
    expect(languageSetEn()).toHaveProperty('type', MONITOR_LANGUAGE_SET_EN);
  });

  it('handles action type MONITOR_LANGUAGE_SET_EN correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: MONITOR_LANGUAGE_SET_EN }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
