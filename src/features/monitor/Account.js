import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import FormBuilder from './util/FormBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

const Option = Select.Option;

export class Account extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.getAvailableTitle();
  }

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
      this.props.actions.createUser(values);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    if (
      typeof this.props.monitor.availvableTitleData === 'undefined' ||
      this.props.monitor.availvableTitleData === null
    ) {
      return (
        <div>
          <FormattedMessage id="account_wait_message" />
        </div>
      );
    }
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
          key: 'username',
          label: this.props.intl.formatMessage({ id: 'login_username' }),
          tooltip: this.props.intl.formatMessage({ id: 'login_username' }),
          widget: Input,
          required: true,
        },
        {
          key: 'title',
          label: this.props.intl.formatMessage({ id: 'account_title_label' }),
          widget: Select,
          children: titleOptions,
          required: true,
        },
      ],
    };

    const createUserSuccessMessage = this.props.intl.formatMessage({
      id: 'account_create_user_success_message',
    });
    const createUserSuccessDescription = this.props.intl.formatMessage({
      id: 'account_create_user_success_description',
    });
    const createUserErrorMessage = this.props.intl.formatMessage({
      id: 'account_create_user_error_message',
    });
    const createUserErrorDescription = this.props.intl.formatMessage({
      id: 'account_create_user_error_description',
    });

    return (
      <div className="monitor-account">
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ width: '400px' }}>
          <FormBuilder meta={formMeta} form={this.props.form} />
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="account_button_submit" />
            </Button>
            &nbsp; &nbsp;
            <Button onClick={this.resetForm}>
              <FormattedMessage id="account_button_reset" />
            </Button>
          </div>
        </Form>
        {Boolean(this.props.monitor.createUserDataId) && (
          <div>
            {' '}
            <Alert
              message={createUserSuccessMessage}
              description={createUserSuccessDescription}
              type="success"
              showIcon
              closable
            />
          </div>
        )}
        {Boolean(this.props.monitor.createUserError) && (
          <div>
            {' '}
            <Alert
              message={createUserErrorMessage}
              description={createUserErrorDescription}
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
