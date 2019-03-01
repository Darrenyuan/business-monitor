import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { apiIfUserNameExist } from './axios/api';
import FormBuilder from './util/FormBuilder';

const Option = Select.Option;

export class AccountStep1 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.allValues);
  }
  checkUsernameExisit = (rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      const message = this.props.intl.formatMessage({ id: 'account_step1_usernmae_exsit' });
      apiIfUserNameExist({ username: value })
        .then(res => (res.data.data ? callback(message) : callback()))
        .catch(err => callback(err));
    }
    callback();
  };

  render() {
    const formMeta = {
      colon: true,
      columns: 1,
      elements: [
        {
          key: 'username',
          label: this.props.intl.formatMessage({ id: 'login_username' }),
          widget: Input,
          rules: [{ validator: this.checkUsernameExisit }],
        },
      ],
    };
    return (
      <div className="monitor-account-step-1">
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
)(injectIntl(AccountStep1));
