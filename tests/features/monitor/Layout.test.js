import React from 'react';
import { shallow } from 'enzyme';
import { Layout } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Layout />);
  expect(renderedComponent.find('.monitor-layout').length).toBe(1);
});
