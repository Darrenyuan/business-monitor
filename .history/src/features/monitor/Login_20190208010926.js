import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button, Alert } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const onClose = e => {
  console.log(e, 'I was closed.');
};

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
    this.props.actions.login({ username: this.state.username, password: this.state.password });
  };
  handleClickLogout = () => {
    this.props.actions.logout();
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const userNamePlaceHolder = this.props.intl.formatMessage({ id: 'login_username' });
    const passwordPlaceHolder = this.props.intl.formatMessage({ id: 'login_password' });
    const userNameMessage = this.props.intl.formatMessage({ id: 'login_username_message' });
    const passwordMessage = this.props.intl.formatMessage({ id: 'login_password_message' });
    const alertMessage = this.props.intl.formatMessage({ id: 'login_alert_message' });
    const alertDescription = this.props.intl.formatMessage({ id: 'login_alert_description' });
    const hasLogIn =
      this.props.monitor.loginData && Boolean(this.props.monitor.loginData.authorized);
    return (
      <div className="monitor-login">
        <div>
          <div className="monitor-login-form-wrapper">
            {hasLogIn ? (
              <div>
                <div style="white-space:nowrap">
                  <label for="id1">label1:</label>
                  <input type="text" id="id1" />
                </div>

                <label>
                  {' '}
                  <FormattedMessage id="login_id" />
                </label>
                <Input value={this.props.monitor.loginData.userId} />
                <br />
                <label>
                  {' '}
                  <FormattedMessage id="login_userInfo_name" />
                </label>
                <Input value={this.props.monitor.loginData.username} disabled="true" />
                <br />
                <Button type="primary" onClick={this.handleClickLogout}>
                  <FormattedMessage id="logout" />
                </Button>
              </div>
            ) : (
              <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                  <Form.Item
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                  >
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: userNameMessage }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder={userNamePlaceHolder}
                        onChange={e => this.setState({ username: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: passwordMessage }],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder={passwordPlaceHolder}
                        onChange={e => this.setState({ password: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                      <FormattedMessage id="login_submit_value" />
                    </Button>
                  </Form.Item>
                </Form>
                {Boolean(this.props.monitor.loginPending) && (
                  <div>
                    <FormattedMessage id="login_pending_message" />
                  </div>
                )}
                {this.props.monitor.loginData && Boolean(this.props.monitor.loginData.authorized) && (
                  <div>
                    <FormattedMessage id="login_in_message" />
                  </div>
                )}
                {Boolean(this.props.monitor.loginError) && (
                  <div>
                    {' '}
                    <Alert
                      message={alertMessage}
                      description={alertDescription}
                      type="warning"
                      closable
                      onClose={onClose}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
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
const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(injectIntl(Login));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedHorizontalLoginForm);
