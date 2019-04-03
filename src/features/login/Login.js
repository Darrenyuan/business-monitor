import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../monitor/redux/actions';
import { Form, Icon, Input, Button, Row } from 'antd';

export class Login extends Component {
  state = {
    username: '',
    password: '',
  };
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.monitor.loginData != this.props.monitor.loginData) {
      if (this.props.monitor.loginData) {
        this.props.history.push(`/monitor/projects/1`);
      }
    }
  }

  render() {
    let userNameMessage = '';
    let userNamePlaceHolder = '';
    let passwordMessage = '';
    let passwordPlaceHolder = '';
    let loginSubmitButtonText = '';
    let usernameLabel = '';
    let passwordLabel = '';

    if (this.props.monitor && 'en' == this.props.monitor.language) {
      userNameMessage = 'Please input your username!';
      userNamePlaceHolder = 'username';
      passwordMessage = 'Please input your Password!';
      passwordPlaceHolder = 'password';
      loginSubmitButtonText = 'login';
      usernameLabel = 'username';
      passwordLabel = 'password';
    } else {
      userNameMessage = '请输入你的用户名';
      userNamePlaceHolder = '用户名';
      passwordMessage = '请输入你的密码!';
      passwordPlaceHolder = '密码';
      loginSubmitButtonText = '登录';
      usernameLabel = '用户名';
      passwordLabel = '密码';
    }
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 18,
        },
      },
    };
    return (
      <div className="login-login">
        <div>
          <Row type="flex" align="middle" justify="center">
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                {...formItemLayout}
                label={usernameLabel}
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
                {...formItemLayout}
                label={passwordLabel}
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
              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >
                  {loginSubmitButtonText}
                </Button>
              </Form.Item>
            </Form>
          </Row>
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
)(Form.create()(Login));
