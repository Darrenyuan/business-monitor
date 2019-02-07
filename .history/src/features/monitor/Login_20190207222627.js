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

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const userNamePlaceHolder = this.props.intl.formatMessage({ id: 'login_username' });
    const passwordPlaceHolder = this.props.intl.formatMessage({ id: 'login_password' });
    const userNameMessage = this.props.intl.formatMessage({ id: 'login_username_message' });
    const passwordMessage = this.props.intl.formatMessage({ id: 'login_password_message' });
    const loginSubmitValue = this.props.intl.formatMessage({ id: 'login_submit_value' });

    return (
      <div className="monitor-login">
        <div>
          <div className="monitor-login-form-wrapper">
            const hasLogIn=(this.props.monitor.loginData &&
            Boolean(this.props.monitor.loginData.authorized)); if(hasLogIn)
            {
              <div>
                <button>logout</button>
              </div>
            }
            else
            {
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
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
                <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
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
                {Boolean(this.props.monitor.loginPending) && <div>please wait!</div>}
          {this.props.monitor.loginData && Boolean(this.props.monitor.loginData.authorized) && (
            <div>welcome back</div>
          )}
          {Boolean(this.props.monitor.loginError) && (
            <div>
              {' '}
              <Alert
                message="Error Text"
                description="Error Description Error Description Error Description Error Description Error Description Error Description"
                type="error"
                closable
                onClose={onClose}
              />
            </div>
          )}
            }
            <div />
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
