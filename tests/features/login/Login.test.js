import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../../src/features/login/Login';
import Provider from 'react-redux';
import { Form } from 'antd';

describe('login/Login', () => {
  it('renders node with correct class name', () => {
    const props = {
      login: {},
      actions: {},
    };
    const WrappedComponent = Form.create()(Login);
    const renderedComponent = shallow(<WrappedComponent {...props} />).dive();
    console.log(renderedComponent.html());
    expect(renderedComponent.find('.login-login').length).toBe(1);
  });
});
