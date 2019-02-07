import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class ToggleLanguage extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="monitor-toggle-language">
        <button
          onClick={this.props.actions.languageSetZh}
          disabled={this.props.monitor.language === 'zh'}
        >
          中文
        </button>
        <button
          onClick={this.props.actions.languageSetEn}
          disabled={this.props.monitor.language === 'en'}
        >
          english
        </button>
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
)(ToggleLanguage);
