import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Alert, Steps } from 'antd';
import FormBuilder from './util/FormBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import _ from 'lodash';
import AccountStep1 from './AccountStep1';
import AccountStep2 from './AccountStep2';
import AccountStep3 from './AccountStep3';
import AccountStep4 from './AccountStep4';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { apiCreateStepUser } from './axios/api';

const Option = Select.Option;

export class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allValues: {},
      mockPath: '/monitor/account/create/step/1',
      previousButtonRef: React.createRef(),
      nextButtonRef: React.createRef(),
    };
  }
  pushUrl(path) {
    this.setState({ ...this.state, mockPath: path });
    this.forceUpdate();
  }

  handleNext = () => {
    this.setState({
      allValues: {
        ...this.state.allValues,
        ...this.props.form.getFieldsValue(),
      },
    });
    const currentStep = this.getCurrentStep();
    if (currentStep < this.getSteps().length - 1) {
      this.pushUrl(this.getSteps()[currentStep + 1].path);
    } else {
      const stepState = this.props.monitor.stepState;
      apiCreateStepUser({ ...stepState }).then(res => {
        const responseData = res.data.data;
        if (responseData) {
          Modal.success({
            title: '提交成功',
          });
        } else {
          Modal.warn({ title: '提交失败' });
        }
      });
    }
  };

  handleBack = () => {
    console.log('form values: ', this.props.form.getFieldsValue());
    this.setState({
      allValues: {
        ...this.state.allValues,
        ...this.props.form.getFieldsValue(),
      },
    });
    const currentStep = this.getCurrentStep();
    if (currentStep > 0) {
      this.pushUrl(this.getSteps()[currentStep - 1].path);
    }
  };

  getCurrentStep() {
    const currentPath = this.state.mockPath;
    return _.findIndex(this.getSteps(), { path: currentPath });
  }

  getSteps() {
    return [
      { title: '创建用户名', path: '/monitor/account/create/step/1', component: AccountStep1 },
      { title: '创建角色', path: '/monitor/account/create/step/2', component: AccountStep2 },
      { title: '绑定项目', path: '/monitor/account/create/step/3', component: AccountStep3 },
      { title: '完成', path: '/monitoraccount/create/step/4', component: AccountStep4 },
    ];
  }
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  renderComponent = () => {
    const StepComponent = this.getSteps()[this.getCurrentStep()].component;
    return <StepComponent form={this.props.form} allValues={this.state.allValues} />;
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
    if (!/^\/monitor\/account\/create\/step/.test(document.location.pathname)) {
      return (
        <Button type="primary" onClick={() => this.pushUrl('/monitor/account/create/step/1')}>
          创建账号
        </Button>
      );
    }
    const currentStep = this.getCurrentStep();
    return (
      <div className="monitor-account">
        <Form>
          <div style={{ width: '600px' }}>
            <h1>创建账号</h1>
            <Steps current={this.getCurrentStep()}>
              {this.getSteps().map(step => (
                <Steps.Step title={step.title} key={step.title} />
              ))}
            </Steps>
            <div className="step-container" style={{ margin: '40px 0' }}>
              {0 === currentStep && (
                <AccountStep1
                  form={this.props.form}
                  allValues={this.state.allValues}
                  previousButtonRef={this.state.previousButtonRef}
                  nextButtonRef={this.state.nextButtonRef}
                />
              )}
              {1 === currentStep && (
                <AccountStep2
                  form={this.props.form}
                  allValues={this.state.allValues}
                  previousButtonRef={this.state.previousButtonRef}
                  nextButtonRef={this.state.nextButtonRef}
                />
              )}
              {2 === currentStep && (
                <AccountStep3
                  form={this.props.form}
                  allValues={this.state.allValues}
                  previousButtonRef={this.state.previousButtonRef}
                  nextButtonRef={this.state.nextButtonRef}
                />
              )}
              {3 === currentStep && (
                <AccountStep4
                  form={this.props.form}
                  allValues={this.state.allValues}
                  previousButtonRef={this.state.previousButtonRef}
                  nextButtonRef={this.state.nextButtonRef}
                />
              )}
            </div>
            <div>
              <Button
                disabled={this.getCurrentStep() === 0}
                onClick={this.handleBack}
                style={{ marginRight: '20px' }}
                ref={this.state.previousButtonRef}
              >
                上一步
              </Button>

              <Button onClick={this.handleNext} type="primary" ref={this.state.nextButtonRef}>
                {this.getCurrentStep() === this.getSteps().length - 1 ? '完成' : '下一步'}
              </Button>
            </div>
          </div>
        </Form>
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
