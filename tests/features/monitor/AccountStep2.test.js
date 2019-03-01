import React from 'react';
import { shallow } from 'enzyme';
import { AccountStep2 } from '../../../src/features/monitor/AccountStep2';

describe('monitor/AccountStep2', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountStep2 {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-step-2').length
    ).toBe(1);
  });
});
