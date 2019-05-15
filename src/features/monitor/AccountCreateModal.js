import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Input, Select, Button, Modal, Form, Transfer, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import 'react-sticky-header/styles.css';
import roleConstants from './constants/roleConstants';
import {
  apiCreateAcciunt,
  apiIfUserNameExist,
  apiGetAvailableProjects,
  apiGetAvailableTitle,
} from '../monitor/axios/api';

export class AccountCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      role: '',
      dataSource: [],
      titles: [],
      targetKeys: [],
      confirm: '',
    };
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handledataToUsername = e => {
    let _this = this;
    const value = e.target.value;
    apiIfUserNameExist({
      username: value,
    })
      .then(res => {
        console.log('res.data', res.data);
        if (res.data.data === false) {
          _this.setState({
            disabled: false,
          });
          message.success(this.props.intl.formatMessage({ id: 'account_user_names_can_be_used' }));
        } else {
          _this.setState({
            disabled: true,
          });
          message.warning(
            this.props.intl.formatMessage({ id: 'account_user_name_already_exists' }),
          );
        }
      })
      .catch();
  };
  handleCreateSubmit = (roleMap, e) => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      apiCreateAcciunt({
        username: values.username,
        nickname: values.full_name,
        roles: [{ roleName: this.state.role }],
        phoneNumber: values.phone_number,
        email: 'abc@sce.com',
        password: values.password,
        status: 1,
        projectIds: _this.state.targetKeys,
      }).then(res => {
        if (res.data.status === 200) {
          _this.props.onCancel();
          _this.props.reload();
          this.props.form.setFieldsValue({
            username: '',
            full_name: '',
            role: '',
            phone_number: '',
            email: '',
            confirm: '',
          });
          this.setState({
            disabled: true,
            role: '',
            targetKeys: [],
          });
        }
      });
    });
  };

  handleRoleChange = (i, value) => {
    this.setState({
      role: value.key,
    });
  };
  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({ targetKeys });
  };

  renderItem(item) {
    const customLabel = <span key={item.id}>{item.name}</span>;
    return {
      label: customLabel,
      value: item.name,
    };
  }
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  componentDidMount() {
    apiGetAvailableTitle().then(res => {
      this.setState({ titles: res.data.data });
      apiGetAvailableProjects().then(res => {
        let dataSource = [];
        res.data.data.map((item, i) => {
          if (item.complete === 1) {
            item.key = item.id;
            dataSource.push(item);
          }
        });

        this.setState({
          dataSource: dataSource,
        });
      });
    });
  }

  validateToNextPhoneNumber = (rule, value, callback) => {
    let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let isvalue = mPattern.test(value);
    if (isvalue) {
      callback();
    } else {
      callback('请输入有效的手机号!');
    }
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

  render() {
    const formItemLayout = {
      labelCol: { sm: { span: 4 }, xs: { span: 24 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
    };
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const roleMap = roleConstants(this);
    console.log(this.state);
    return (
      <div className="monitor-account-create-modal">
        <Modal
          id="1112312"
          title={this.props.intl.formatMessage({ id: 'sidePanel_account_link' })}
          visible={this.props.visible}
          width={620}
          onCancel={this.props.onCancel}
          footer={null}
        >
          <Form>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_step4_table_username' })}
            >
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_username' }),
                  },
                ],
              })(<Input onBlur={this.handledataToUsername} />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_FullName' })}
            >
              {getFieldDecorator('full_name', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_full_name' }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_role' })}
            >
              <Select
                value={
                  this.state.role === ''
                    ? this.props.intl.formatMessage({ id: 'account_role' })
                    : this.state.role
                }
                onChange={this.handleRoleChange}
              >
                {this.state.titles.map(item => (
                  <Option key={item} value={item}>
                    {roleMap.get(item)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {!Boolean(this.state.role === 'admin' || this.state.role === 'leader') && (
              <Form.Item
                labelCol={{ sm: { span: 3 }, xs: { span: 24 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 21 } }}
                label={this.props.intl.formatMessage({ id: 'sidePanel_project' })}
              >
                <Transfer
                  dataSource={this.state.dataSource}
                  listStyle={{
                    width: 207,
                    height: 300,
                  }}
                  operations={[
                    this.props.intl.formatMessage({ id: 'add' }),
                    this.props.intl.formatMessage({ id: 'remove' }),
                  ]}
                  targetKeys={this.state.targetKeys}
                  onChange={this.handleChange}
                  render={this.renderItem.bind(this)}
                />
              </Form.Item>
            )}

            <Form.Item
              {...formItemLayout}
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
              })(<Input />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'establish_email' })}
            >
              {getFieldDecorator('establish_email', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_e_mail' }),
                  },
                  {
                    validator: this.validateToNextEmail,
                  },
                ],
              })(<span>abc@sec.com</span>)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'reset_password_password_label' })}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({
                      id: 'reset_password_password_message',
                    }),
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({
                id: 'reset_password_confirm_password_title',
              })}
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
              <Button
                type="primary"
                onClick={this.handleCreateSubmit.bind(this, roleMap)}
                disabled={this.state.disabled}
              >
                {this.props.intl.formatMessage({ id: 'reset_password_button' })}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
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
)(Form.create()(injectIntl(AccountCreateModal)));
