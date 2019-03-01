import React from 'react';
import { shallow } from 'enzyme';
import { AccountStep3 } from '../../../src/features/monitor/AccountStep3';

describe('monitor/AccountStep3', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountStep3 {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-step-3').length
    ).toBe(1);
  });
});
