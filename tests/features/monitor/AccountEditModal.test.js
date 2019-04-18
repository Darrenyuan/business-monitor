import React from 'react';
import { shallow } from 'enzyme';
import { AccountEditModal } from '../../../src/features/monitor/AccountEditModal';

describe('monitor/AccountEditModal', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountEditModal {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-edit-modal').length
    ).toBe(1);
  });
});
