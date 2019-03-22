import React from 'react';
import { shallow } from 'enzyme';
import { BindProject } from '../../../src/features/monitor/BindProject';

describe('monitor/BindProject', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <BindProject {...props} />
    );

    expect(
      renderedComponent.find('.monitor-bind-project').length
    ).toBe(1);
  });
});
