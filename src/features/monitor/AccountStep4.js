import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';

export class AccountStep4 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const stepState = this.props.monitor.stepState;
    return (
      <div className="monitor-account-step-4">
        <ul>
          <li>
            <label>username:</label>
            <span>{JSON.stringify(stepState)}</span>
          </li>
          <li>
            <label>title:</label>
          </li>
          <li>
            <label>projectKey:</label>
          </li>
        </ul>
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
)(injectIntl(AccountStep4));
