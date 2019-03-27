import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class IssueDetail extends Component {
  constructor(props) {
    super(props);
    // this.initData();
    this.state = {
      search: '',
      issueId: this.props.match.params.id,
    };
  }
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    // this.props.actions.
  }

  render() {
    return <div className="monitor-issue-detail">Page Content: monitor/IssueDetail1111</div>;
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
)(IssueDetail);
