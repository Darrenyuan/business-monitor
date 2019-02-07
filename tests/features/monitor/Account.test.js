import React from 'react';
import { shallow } from 'enzyme';
import { Account } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Account />);
  expect(renderedComponent.find('.monitor-account').length).toBe(1);
});
