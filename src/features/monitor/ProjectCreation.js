import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

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
      console.log('Submit form: ', values);
      this.props.actions.createProject(values);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formMeta = {
      colon: true,
      columns: 1,
      elements: [
        {
          key: 'name',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_name' }),
          widget: Input,
          required: true,
        },
        {
          key: 'startTime',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_start_time' }),
          widget: DatePicker,
        },
        {
          key: 'endTime',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_end_time' }),
          widget: DatePicker,
        },
        {
          key: 'location',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_location' }),
          widget: Input,
        },
        {
          key: 'overview',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_overview' }),
          widget: Input,
        },
        {
          key: 'designUnit',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_design_unit' }),
          widget: Input,
        },
        {
          key: 'monitorUnit',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_monitor_unit' }),
          widget: Input,
        },
        {
          key: 'constructionUnit',
          label: this.props.intl.formatMessage({ id: 'project_creation_label_construction_unit' }),
          widget: Input,
        },
      ],
    };
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
    return (
      <div className="monitor-project-creation">
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ width: '400px' }}>
          <FormBuilder meta={formMeta} form={this.props.form} />
          <div style={{ textAlign: 'center' }}>
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
