import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Input, Select, Button, Form, message } from 'antd';
import { injectIntl } from 'react-intl';
import 'react-sticky-header/styles.css';
import roleLists from './constants/roleList';
const Option = Select.Option;
export class createAcciunt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      lightboxIsOpen: false,
      currentImage: 0,
      visible: false,
      disabled: true,
      isvalue: null,
      accountStatus: '',
      power: '',
      confirmDirty: false,
      username: '',
      project: '',
      roles: '',
      status: true,
      autoCompleteResult: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.status !== this.props.status) {
      this.setState({
        status: this.props.status,
      });
    }
  }
  handleTypeProject(i, value) {
    this.setState({
      project: value.key,
    });
  }
  handleRolesChange = (i, value) => {
    this.setState({
      roles: value.key,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log('en');
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.roles !== '' && this.state.project !== '') {
          console.log('Received values of form: ', values);
          this.props.history.replace('/monitor/accountList');
        } else {
          message.warning('请选择角色和项目！');
        }
      }
    });
  };
  initData() {
    this.setState({
      accountStatus: '',
      power: '',
      username: '',
      project: '',
      roles: '',
    });
  }
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.props.intl.formatMessage({ id: 'reset_passowrd_confirm_password_callbak' }));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  validateToNextPhone = e => {
    const value = e.target.value;
    // let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // let isvalue = mPattern.test(value);
    // this.setState({
    //   isvalue
    // })
    console.log('rule,value,callback', value);
  };
  validateToNextPhoneNumber = (rule, value, callback) => {
    let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let isvalue = mPattern.test(value);
    if (isvalue) {
      callback();
    } else {
      callback('请输入有效的手机号!');
    }
  };
  render() {
    if (this.props.monitor.userList.fetchUserListError) {
      return <div>{this.props.monitor.userList.fetchUserListError.error}</div>;
    }
    console.log('thisissues', this);
    let { roleList } = roleLists(this);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="monitor-project">
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'account_step4_table_username' })}
          >
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({ id: 'account_step4_username' }),
                },
                {
                  validator: this.validateToNextUsername,
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'account_full_name' })}
          >
            {getFieldDecorator('full_name', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({ id: 'account_step4_full_name' }),
                },
                {
                  validator: this.validateToNextFullname,
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'account_role' })}
          >
            <Select
              value={
                this.state.roles === ''
                  ? this.props.intl.formatMessage({ id: 'account_role' })
                  : this.state.roles
              }
              onChange={this.handleRolesChange}
            >
              {roleList.map(typeMap => (
                <Option key={typeMap.value} value={typeMap.key}>
                  {typeMap.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'sidePanel_project' })}
          >
            <Select
              value={
                this.state.project === ''
                  ? this.props.intl.formatMessage({ id: 'sidePanel_project' })
                  : this.state.project
              }
              onChange={this.handleTypeProject.bind(this)}
            >
              {roleList.map(typeMap => (
                <Option key={typeMap.value} value={typeMap.key}>
                  {typeMap.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'phone_number' })}
          >
            {getFieldDecorator('phone_number', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({ id: 'account_step4_phonenumber' }),
                },
                {
                  validator: this.validateToNextPhoneNumber,
                },
              ],
            })(<Input onBlur={this.validateToNextPhone} />)}
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'establish_email' })}
          >
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: this.props.intl.formatMessage({ id: 'account_step4_valid_e_mail' }),
                },
                {
                  required: true,
                  message: this.props.intl.formatMessage({ id: 'account_step4_e_mail' }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'reset_password_password_label' })}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({ id: 'reset_password_password_message' }),
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 6 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            label={this.props.intl.formatMessage({ id: 'reset_password_confirm_password_title' })}
          >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({
                    id: 'reset_password_confirm_password_message',
                  }),
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
            <Button type="primary" htmlType="submit">
              {this.props.intl.formatMessage({ id: 'reset_password_button' })}
            </Button>
          </Form.Item>
        </Form>
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
const createAcciuntForm = Form.create({ name: 'createAcciunt' })(createAcciunt);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(createAcciuntForm));
