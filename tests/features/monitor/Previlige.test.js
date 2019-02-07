import React from 'react';
import { shallow } from 'enzyme';
import { Previlige } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Previlige />);
  expect(renderedComponent.find('.monitor-previlige').length).toBe(1);
});
