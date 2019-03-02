import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage } from 'react-intl';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';
import { injectIntl } from 'react-intl';
const Option = Select.Option;
export class AccountStep3 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const form = this.props.form;
    if ('admin' !== form.getFieldValue('title')) {
      this.props.actions.getAvailableProjects();
    }
  }
  handleSelect = value => {
    this.props.form.setFieldsValue({ project: value });
    const stepState = this.props.monitor.stepState;
    const projects = this.props.monitor.getAvailableProjectsData;
    for (var i = 0; i < projects.length; i++) {
      let item = projects[i];
      if (value === item.id) {
        this.props.actions.syncStepState({
          ...stepState,
          projectId: value,
          projectName: item.name,
        });
      }
    }
  };

  render() {
    const form = this.props.form;
    if ('admin' == form.getFieldValue('title')) {
      return (
        <div>
          <FormattedMessage id="account_step3_no_need_bind" />
        </div>
      );
    }
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

    const formMeta = {
      colon: true,
      columns: 1,
      elements: [
        {
          key: 'project',
          label: this.props.intl.formatMessage({ id: 'projects_table_title_name' }),
          widget: Select,
          children: projectOptions,
          required: true,
          widgetProps: { onSelect: this.handleSelect },
        },
      ],
    };
    return (
      <div className="monitor-account-step-3">
        <FormBuilder meta={formMeta} form={this.props.form} />
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
)(injectIntl(AccountStep3));
