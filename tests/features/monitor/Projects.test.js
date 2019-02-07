import React from 'react';
import { shallow } from 'enzyme';
import { Projects } from '../../../src/features/monitor/Projects';

describe('monitor/Projects', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Projects {...props} />
    );

    expect(
      renderedComponent.find('.monitor-projects').length
    ).toBe(1);
  });
});
