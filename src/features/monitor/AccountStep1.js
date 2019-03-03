import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { apiIfUserNameExist } from './axios/api';
import FormBuilder from './util/FormBuilder';

const Option = Select.Option;

export class AccountStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameExist: false,
    };
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const form = this.props.form;
    const stepState = this.props.monitor.stepState;
    form.setFieldsValue(this.props.allValues);
    form.setFieldsValue({ username: stepState.username });
  }
  checkUsernameExisit = () => {
    const form = this.props.form;
    const message = this.props.intl.formatMessage({ id: 'account_step1_usernmae_exsit' });
    let result = true;
    let username = form.getFieldValue('username');
    let responseData;
    apiIfUserNameExist({ username: username }).then(res => {
      responseData = res.data.data;
      this.setState({ ...this.state, nameExist: res.data.data });
      const stepState = this.props.monitor.stepState;
      if (responseData) {
        this.props.actions.syncStepState({ ...stepState, nameExist: true });
        Modal.warn({ title: '重名' });
      } else {
        this.props.actions.syncStepState({ ...stepState, nameExist: false });
        Modal.success({ title: '没有重名' });
      }
    });
  };
  handleChange = event => {
    let stepState = this.props.monitor.stepState;
    this.props.form.setFieldsValue({ username: event.target.value });
    this.props.actions.syncStepState({
      ...stepState,
      username: event.target.value,
    });
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
          required: true,
          widgetProps: { onChange: this.handleChange },
        },
      ],
    };
    return (
      <div className="monitor-account-step-1">
        <table>
          <tbody>
            <tr>
              <td>
                <FormBuilder meta={formMeta} form={this.props.form} />
              </td>
            </tr>
            <tr>
              <td>
                <Button onClick={this.checkUsernameExisit} type="primary">
                  <FormattedMessage id="account_step1_username_button_check" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
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
