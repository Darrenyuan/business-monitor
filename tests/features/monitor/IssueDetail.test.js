import React from 'react';
import { shallow } from 'enzyme';
import { IssueDetail } from '../../../src/features/monitor/IssueDetail';

describe('monitor/IssueDetail', () => {
  it('renders node with correct class name', () => {
    const props = {
      monitor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <IssueDetail {...props} />
    );

    expect(
      renderedComponent.find('.monitor-issue-detail').length
    ).toBe(1);
  });
});
