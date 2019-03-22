import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Divider,
  Modal,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { apiResetPassword } from './axios/api';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export class ResetPassword extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      apiResetPassword(values).then(res => {
        const responseData = res.data.data;
        if (responseData) {
          Modal.success({
            title: this.props.intl.formatMessage({ id: 'reset_password_modal_success' }),
          });
        } else {
          Modal.warn({ title: this.props.intl.formatMessage({ id: 'reset_password_modal_fail' }) });
        }
      });
      console.log('succuess');
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Two passwords that you enter is inconsistent!');
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
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 7,
          offset: 3,
        },
      },
    };

    const formatMessage = this.props.intl.formatMessage;
    return (
      <div className="monitor-reset-password">
        <h2 style={{ textAlign: 'left', margin: '0 40px' }} {...formItemLayout}>
          <FormattedMessage id="reset_password_header" />
        </h2>
        <Divider />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'reset_password_password_label' })}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'reset_password_password_message' }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'reset_password_new_password_label' })}
          >
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'reset_password_new_password_message' }),
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'reset_password_confirm_password_title' })}
          >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'reset_password_confirm_password_message' }),
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input type="password" onChange={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="reset_password_button" />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(injectIntl(ResetPassword)));
