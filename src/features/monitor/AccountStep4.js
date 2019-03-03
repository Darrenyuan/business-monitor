import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table } from 'antd';

export class AccountStep4 extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const stepState = this.props.monitor.stepState;
    let id = 'title_' + stepState.title;
    let titleStr = this.props.intl.formatMessage({ id: id });
    const dataSource = [{ ...stepState, title: titleStr }];
    const intl = this.props.intl;
    const columns = [
      {
        title: intl.formatMessage({ id: 'account_step4_table_username' }),
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: intl.formatMessage({ id: 'account_step4_table_title' }),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: intl.formatMessage({ id: 'account_step4_table_project' }),
        dataIndex: 'projectName',
        key: 'projectName',
      },
    ];
    return (
      <div className="monitor-account-step-4">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
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
