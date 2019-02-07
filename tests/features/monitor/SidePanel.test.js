import React from 'react';
import { shallow } from 'enzyme';
import { SidePanel } from '../../../src/features/monitor/SidePanel';

describe('monitor/SidePanel', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SidePanel {...props} />
    );

    expect(
      renderedComponent.find('.monitor-side-panel').length
    ).toBe(1);
  });
});
