import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../../src/features/monitor/Login';

describe('monitor/Login', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Login {...props} />
    );

    expect(
      renderedComponent.find('.monitor-login').length
    ).toBe(1);
  });
});
