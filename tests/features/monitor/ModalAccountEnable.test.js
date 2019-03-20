import React from 'react';
import { shallow } from 'enzyme';
import { ModalAccountEnable } from '../../../src/features/monitor/ModalAccountEnable';

describe('monitor/ModalAccountEnable', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ModalAccountEnable {...props} />
    );

    expect(
      renderedComponent.find('.monitor-modal-account-enable').length
    ).toBe(1);
  });
});
