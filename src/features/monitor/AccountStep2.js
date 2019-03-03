import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';
import { injectIntl, FormattedMessge } from 'react-intl';

const Option = Select.Option;
export class AccountStep2 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    this.props.actions.getAvailableTitle();
    const stepState = this.props.monitor.stepState;
    const form = this.props.form;
    form.setFieldsValue(this.props.allValues);
    form.setFieldsValue({ title: stepState.title });
  }
  handleChange = value => {
    const stepState = this.props.monitor.stepState;
    this.props.form.setFieldsValue({ title: value });
    this.props.actions.syncStepState({ ...stepState, title: value });
  };
  render() {
    const titles = this.props.monitor.availvableTitleData;
    if (!titles) {
      return <div />;
    }
    let titleOptions = [];
    const titleLength = titles.length;
    for (var i = 0; i < titleLength; i++) {
      let item = titles[i];
      let id = 'title_' + item;
      let optionStr = this.props.intl.formatMessage({ id: id });
      titleOptions.push(
        <Option key={item} value={item}>
          {optionStr}
        </Option>,
      );
    }
    const formMeta = {
      colon: true,
      columns: 1,
      elements: [
        {
          key: 'title',
          label: this.props.intl.formatMessage({ id: 'account_title_label' }),
          widget: Select,
          children: titleOptions,
          required: true,
          widgetProps: { onChange: this.handleChange },
        },
      ],
    };
    return (
      <div className="monitor-account-step-2">
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
)(injectIntl(AccountStep2));
