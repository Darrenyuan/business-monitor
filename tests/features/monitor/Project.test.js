import React from 'react';
import { shallow } from 'enzyme';
import { Project } from '../../../src/features/monitor/Project';

describe('monitor/Project', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Project {...props} />
    );

    expect(
      renderedComponent.find('.monitor-project').length
    ).toBe(1);
  });
});
