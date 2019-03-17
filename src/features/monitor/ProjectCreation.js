import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import _ from 'lodash';

export class ProjectCreation extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  resetForm() {
    this.props.form.resetFields();
  }

  handleSubmit(evt) {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const timeArray = values.time;
      let args = _.omit(values, 'time');
      const startTime = timeArray[0];
      const endTime = timeArray[1];

      console.log('Submit form: ', values);
      this.props.actions.createProject({ ...args, startTime: startTime, endTime: endTime });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const RangePicker = DatePicker.RangePicker;
    const createProjectSuccessMessage = this.props.intl.formatMessage({
      id: 'project_creation_success_message',
    });
    const createProjectSuccessDescription = this.props.intl.formatMessage({
      id: 'project_creation_success_description',
    });
    const createProjectErrorMessage = this.props.intl.formatMessage({
      id: 'project_creation_error_message',
    });
    const createProjectErrorDescription = this.props.intl.formatMessage({
      id: 'project_creation_error_description',
    });

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
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: this.props.intl.formatMessage({
            id: 'project_creation_label_range_time_validation_message',
          }),
        },
      ],
    };
    return (
      <div className="monitor-project-creation">
        <Form labelAlign="left" layout="horizontal" onSubmit={this.handleSubmit}>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_name' })}
          >
            {getFieldDecorator('name', {
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_cost' })}
          >
            {getFieldDecorator('cost', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<InputNumber min={1} style={{ float: 'left' }} max={100000000000} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_range_time' })}
          >
            {getFieldDecorator('time', rangeConfig)(
              <RangePicker style={{ float: 'left' }} showTime />,
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_location' })}
          >
            {getFieldDecorator('location', {
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_overview' })}
          >
            {getFieldDecorator('overview', {
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_design_unit' })}
          >
            {getFieldDecorator('designUnit', {
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'project_creation_label_monitor_unit' })}
          >
            {getFieldDecorator('monitorUnit', {
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={this.props.intl.formatMessage({
              id: 'project_creation_label_construction_unit',
            })}
          >
            {getFieldDecorator('constructionUnit', {
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
            })(<Input />)}
          </Form.Item>
          <div {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="project_creation_button_submit" />
            </Button>
            &nbsp; &nbsp;
            <Button onClick={this.resetForm}>
              <FormattedMessage id="project_creation_button_reset" />
            </Button>
          </div>
        </Form>
        {Boolean(this.props.monitor.createProjectDataId) && (
          <div>
            {' '}
            <Alert
              message={createProjectSuccessMessage}
              description={createProjectSuccessDescription}
              type="success"
              showIcon
              closable
            />
          </div>
        )}
        {Boolean(this.props.monitor.createProjectError) && (
          <div>
            {' '}
            <Alert
              message={createProjectErrorMessage}
              description={createProjectErrorDescription}
              type="warning"
              showIcon
              closable
            />
          </div>
        )}
      </div>
    );
  }
}

/_ istanbul ignore next _/;
function mapStateToProps(state) {
  return {
    monitor: state.monitor,
  };
}

/_ istanbul ignore next _/;
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(injectIntl(ProjectCreation)));
