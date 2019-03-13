import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actions from '../monitor/redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button, Alert, Layout as AntLayout, Menu, Breadcrumb } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';
import enMessages from '../monitor/locale/en';
import zhMessages from '../monitor/locale/zh';
import { connect } from 'react-redux';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_GB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const onClose = e => {
  console.log(e, 'I was closed.');
};

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
    
    return (
      <div className="monitor-login">
        <IntlProvider locale={this.props.monitor.language} messages={message}>
          <div>
            <AntLayout style={{ minHeight: '100vh', background: '#fff' }}>
              <AntLayout>
                <Content style={{ margin: '0 16px' }}>
                  <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <div className="monitor-page-container">
                      <h1>12312312313</h1>
                      <div>
                        <div className="monitor-login-form-wrapper">
                          {hasLogIn ? (
                            <div>
                              <Form>
                                <Form.Item {...formItemLayout} label={loginIdLable}>
                                  <Input
                                    value={this.props.monitor.loginData.userId}
                                    disabled={true}
                                  />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={userNameLable}>
                                  <Input
                                    value={this.props.monitor.loginData.username}
                                    disabled={true}
                                  />
                                </Form.Item>
                                <Button type="primary" onClick={this.handleClickLogout}>
                                  <FormattedMessage id="logout" />
                                </Button>
                              </Form>
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
                                      prefix={
                                        <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                                      }
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
                                      prefix={
                                        <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                                      }
                                      type="password"
                                      placeholder={passwordPlaceHolder}
                                      onChange={e => this.setState({ password: e.target.value })}
                                    />,
                                  )}
                                </Form.Item>
                                <Form.Item>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={hasErrors(getFieldsError())}
                                  >
                                    <FormattedMessage id="login_submit_value" />
                                  </Button>
                                </Form.Item>
                              </Form>
                              {Boolean(this.props.monitor.loginPending) && (
                                <div>
                                  <FormattedMessage id="login_pending_message" />
                                </div>
                              )}
                              {this.props.monitor.loginData &&
                                Boolean(this.props.monitor.loginData.authorized) && (
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
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Copyright © 2008 - 2019 中建三局第一建设工程有限责任公司
                </Footer>
              </AntLayout>
            </AntLayout>
          </div>
        </IntlProvider>
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
