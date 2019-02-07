import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export class Login extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  static state = {
    username: '',
    password: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  _handleClick = () => {
    this.props.actions.login({ username: this.state.username, password: this.state.password });
  };
  handleSubmit = () => {
    this.props.actions.login({ username: this.state.username, password: this.state.password });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    return (
      <div className="monitor-login">
        <div>
          <div className="monitor-login-form-wrapper">
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                    onChange={e => this.setState({ email: e.target.value })}
                  />,
                )}
              </Form.Item>
              <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
          {Boolean(this.props.monitor.loginPending) && <div>please wait!</div>}
          {this.props.monitor.loginData && Boolean(this.props.monitor.loginData.authorized) && (
            <div>welcome back</div>
          )}
          {Boolean(this.props.monitor.loginError) && <div>{this.props.monitor.loginError}</div>}
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    monitor: state.monitor,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(Login));
