import React from 'react';
import { shallow } from 'enzyme';
import { AccountCreateModal } from '../../../src/features/monitor/AccountCreateModal';

describe('monitor/AccountCreateModal', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AccountCreateModal {...props} />
    );

    expect(
      renderedComponent.find('.monitor-account-create-modal').length
    ).toBe(1);
  });
});
