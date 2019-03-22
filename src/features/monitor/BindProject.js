import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage } from 'react-intl';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert, Modal } from 'antd';
import FormBuilder from './util/FormBuilder';
import { injectIntl } from 'react-intl';
import { apiIfUserNameExist } from './axios/api';
import { apiBindProject } from './axios/api';
const Option = Select.Option;
export class BindProject extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.getAvailableProjects();
  }

  handleSelect = value => {
    this.props.form.setFieldsValue({ project: value });
  };

  handleChange = event => {
    const username = event.target.value;

    this.props.form.setFieldsValue({ username: event.target.value });
  };

  handleSubmit = evt => {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, args) => {
      if (errors) {
        return;
      }
      console.log('Submit form: ', args);
      apiIfUserNameExist({ username: args.username }).then(res => {
        if (!res.data.data) {
          Modal.warn({ title: '用户名不存在' });
        } else {
          apiBindProject({ username: args.username, projectId: args.project }).then(res => {
            if (res.data.data) {
              Modal.info({ title: '绑定成功' });
            } else {
              Modal.warn({ title: '绑定失败' });
            }
          });
        }
      });
    });
  };

  render() {
    const projects = this.props.monitor.getAvailableProjectsData;
    if (!projects) {
      return <div />;
    }
    let projectOptions = [];
    const projectLength = projects.length;
    for (var i = 0; i < projectLength; i++) {
      let item = projects[i];
      projectOptions.push(
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>,
      );
    }
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 4,
        },
        sm: {
          span: 16,
          offset: 2,
        },
      },
    };
    return (
      <div>
        <Form labelAlign="left" layout="horizontal" onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'login_username' })}
          >
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  min: 1,
                  max: 200,
                  message: this.props.intl.formatMessage({
                    id: 'project_creation_label_validation_message',
                  }),
                },
              ],
            })(<Input onChange={this.handleChange} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'projects_table_title_name' })}
          >
            {getFieldDecorator('project', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={this.handleSelect}>{projectOptions}</Select>)}
          </Form.Item>
        </Form>
        <Button onClick={this.handleSubmit} type="primary">
          {' '}
          提交
        </Button>
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
const WrappedHorizontalLoginForm = Form.create({ name: 'bingProject' })(injectIntl(BindProject));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedHorizontalLoginForm);
