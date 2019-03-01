import React from 'react';
import { shallow } from 'enzyme';
import { AccountStep1 } from '../../../src/features/monitor/AccountStep1';

describe('monitor/AccountStep1', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountStep1 {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-step-1').length
    ).toBe(1);
  });
});
