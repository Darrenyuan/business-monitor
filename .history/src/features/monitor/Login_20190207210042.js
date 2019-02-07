import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';

export class Login extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static state = {
    username: '',
    password: '',
  };

  _handleClick = () => {
    this.props.actions.login({ username: this.state.username, password: this.state.password });
  };
  render() {
    return (
      <div className="monitor-login">
        <div>
          <div className="monitor-login-form-wrapper">
            <label>
              {' '}
              <FormattedMessage id="login_username" />
            </label>
            <input
              type="text"
              name="username"
              onChange={e => this.setState({ username: e.target.value })}
            />
            <label>
              {' '}
              <FormattedMessage id="login_password" />
            </label>
            <input
              type="password"
              name="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            <button onClick={this._handleClick}>
              {' '}
              <FormattedMessage id="login_submit_value" />
            </button>
          </div>
          {Boolean(this.props.monitor.loginPending) && <div>please wait!</div>}
          {this.props.monitor.loginData && Boolean(this.props.monitor.loginData.authorized) && (
            <div>welcome back</div>
          )}
          {Boolean(this.props.monitor.loginError) && <div>{this.props.monitor.loginError}</div>}
        </div>
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
)(injectIntl(Login));
