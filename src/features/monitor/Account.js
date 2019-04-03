import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Alert, Steps } from 'antd';
import FormBuilder from './util/FormBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import _ from 'lodash';

const Option = Select.Option;

export class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      nickname: '',
      roleName: '',
    };
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleSubmit(evt) {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      console.log('Submit form: ', values);
    });
  }

  render() {
    return (
      <div className="monitor-account">
        <Form />
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
)(Form.create()(injectIntl(Account)));
