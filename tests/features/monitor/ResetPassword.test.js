import React from 'react';
import { shallow } from 'enzyme';
import { ResetPassword } from '../../../src/features/monitor/ResetPassword';

describe('monitor/ResetPassword', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ResetPassword {...props} />
    );

    expect(
      renderedComponent.find('.monitor-reset-password').length
    ).toBe(1);
  });
});
