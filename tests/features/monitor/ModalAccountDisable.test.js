import React from 'react';
import { shallow } from 'enzyme';
import { ModalAccountDisable } from '../../../src/features/monitor';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModalAccountDisable />);
  expect(renderedComponent.find('.monitor-modal-account-disable').length).toBe(1);
});
