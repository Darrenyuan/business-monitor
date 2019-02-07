import React from 'react';
import { shallow } from 'enzyme';
import { ToggleLanguage } from '../../../src/features/monitor/ToggleLanguage';

describe('monitor/ToggleLanguage', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ToggleLanguage {...props} />
    );

    expect(
      renderedComponent.find('.monitor-toggle-language').length
    ).toBe(1);
  });
});
