import React from 'react';
import { shallow } from 'enzyme';
import { WelComePage } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<WelComePage />);
  expect(renderedComponent.find('.monitor-wel-come-page').length).toBe(1);
});
