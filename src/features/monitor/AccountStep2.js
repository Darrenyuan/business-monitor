import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';

const Option = Select.Option;
export class AccountStep2 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    this.props.actions.getAvailableTitle();
  }
  render() {
    const titles = this.props.monitor.availvableTitleData;
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
)(AccountStep2);
