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
  apiUpdateAcciunt,
} from '../monitor/axios/api';

export class AccountEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      role: '',
      dataSource: [],
      titles: [],
      targetKeys: [],
      showRoles: false,
      userId: 0,
    };
    console.log(this.props);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleUpdateSubmit = (roleMap, e) => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('Received values of form: ', values);
      apiUpdateAcciunt({
        username: values.username,
        nickname: values.full_name,
        roles: [{ roleName: this.state.role }],
        phoneNumber: values.phone_number,
        email: values.email,
        userId: this.state.userId,
        status: 1,
        projectIds: this.state.targetKeys,
      }).then(res => {
        if (res.data.status === 200) {
          _this.props.onCancel();
          _this.props.reload();
          _this.props.form.setFieldsValue({
            username: '',
            full_name: '',
            role: '',
            phone_number: '',
            email: '',
          });
          _this.setState({
            disabled: true,
            role: '',
            dataSource: [],
            titles: [],
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
    console.log(targetKeys, direction, moveKeys);
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
    let role = '';
    if (this.props.data.roles && this.props.data.roles.length > 0) {
      role = this.props.data.roles[0].roleName;
    }
    let targetKeys = [];
    if (this.props.data.projectVos && this.props.data.projectVos.length > 0) {
      this.props.data.projectVos.map(item => {
        targetKeys.push(item.id);
      });
    }
    this.setState({ userId: this.props.data.userId });
    this.setState({ targetKeys: targetKeys, role: role });
    this.props.form.setFieldsValue({
      username: Boolean(!this.props.data.username) ? '' : this.props.data.username,
      full_name: Boolean(!this.props.data.nickname) ? '' : this.props.data.nickname,
      phone_number: Boolean(!this.props.data.phoneNumber) ? '' : this.props.data.phoneNumber,
      email: Boolean(!this.props.data.email) ? '' : this.props.data.email,
    });
    apiGetAvailableTitle().then(res => {
      let titles = res.data.data;
      this.setState({ titles: titles });
      if (titles.includes(role)) {
        this.setState({ showRoles: true });
      } else {
        this.setState({ showRoles: false });
      }
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
          title={this.props.intl.formatMessage({ id: 'sidePanel_account_edit' })}
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
              })(<Input disabled={true} />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_full_name' })}
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
            {Boolean(this.state.showRoles) && (
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
            )}

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
            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
              <Button type="primary" onClick={this.handleUpdateSubmit.bind(this, roleMap)}>
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
)(Form.create()(injectIntl(AccountEditModal)));
