import React from 'react';
import { shallow } from 'enzyme';
import { ProjectCreation } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ProjectCreation />);
  expect(renderedComponent.find('.monitor-project-creation').length).toBe(1);
});
