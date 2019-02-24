import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Table, DatePicker } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';

export class Projects extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.actions.getAvailableProjectsSize();
  }

  componentDidMount() {
    this.props.actions.getAvailableProjects();
  }

  handleChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }
  render() {
    if (
      !Boolean(this.props.monitor.getAvailableProjectsSizeData) ||
      !Boolean(this.props.monitor.getAvailableProjectsData)
    ) {
      return <div> loading data</div>;
    }
    const total = this.props.monitor.getAvailableProjectsSizeData;
    const columns = [
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_id' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_startTime' }),
        dataIndex: 'startTime',
        key: 'startTime',
        render: startTime => {
          var stillUtc = moment.utc(startTime).toDate();
          var local = moment(stillUtc)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
          return <span>{local}</span>;
        },
      },

      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_endTime' }),
        dataIndex: 'endTime',
        key: 'endTime',
        render: endTime => {
          var stillUtc = moment.utc(endTime).toDate();
          var local = moment(stillUtc)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
          return <span>{local}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_location' }),
        dataIndex: 'location',
        key: 'location',
      },

      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_overview' }),
        dataIndex: 'overview',
        key: 'overview',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_designUnit' }),
        dataIndex: 'designUnit',
        key: 'designUnit',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_monitorUnit' }),
        dataIndex: 'monitorUnit',
        key: 'monitorUnit',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_constructionUnit' }),
        dataIndex: 'constructionUnit',
        key: 'constructionUnit',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_createTime' }),
        dataIndex: 'createTime',
        key: 'createTime',
        render: createTime => {
          var stillUtc = moment.utc(createTime).toDate();
          var local = moment(stillUtc)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
          return <span>{local}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_operator' }),
        dataIndex: 'id',
        key: 'operator',
        render: id => {
          const path = '/monitor/project/' + id;
          return (
            <div>
              <Link to={path}>
                <FormattedMessage id="projects_table_title_operator_value" />
              </Link>
            </div>
          );
        },
      },
    ];
    const data = [];
    this.props.monitor.getAvailableProjectsData.map((item, index) => {
      data.push({ ...item, key: '' + index });
    });
    return (
      <div className="monitor-projects">
        <Table
          pagination={{ defaultCurrent: 1, total: total }}
          dataSource={data}
          columns={columns}
          onChange={this.handleChange}
        />
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
)(injectIntl(Projects));
