import React from 'react';
import { shallow } from 'enzyme';
import { AccountStep4 } from '../../../src/features/monitor/AccountStep4';

describe('monitor/AccountStep4', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountStep4 {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-step-4').length
    ).toBe(1);
  });
});
