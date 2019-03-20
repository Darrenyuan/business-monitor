import React from 'react';
import { shallow } from 'enzyme';
import { ModalAccountCreate } from '../../../src/features/monitor/ModalAccountCreate';

describe('monitor/ModalAccountCreate', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ModalAccountCreate {...props} />
    );

    expect(
      renderedComponent.find('.monitor-modal-account-create').length
    ).toBe(1);
  });
});
