import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Table, DatePicker, Pagination } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createSelector } from 'reselect';
import { loadProjectListPageSize, saveProjectListPageSize } from '../../common/sessionStorage';

const getItems = monitor => monitor.projectList.items;
const getById = monitor => monitor.projectList.byId;
const dataSourceSelector = createSelector(
  getItems,
  getById,
  (items, byId) => {
    console.log('reselect: get data source');
    if (!items) return [];
    return items.map(id => byId[id]);
  },
);
export class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      pageSize: loadProjectListPageSize(),
    };
    this.fetchData = this.fetchData.bind(this);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getDataSource = dataSourceSelector;

  componentDidMount() {
    const page = this.props.match.params.page || '1';
    if (
      page !== this.props.monitor.projectList.page ||
      !this.getDataSource(this.props.monitor.projectList, this.props.monitor.projectList.byId)
        .length ||
      this.props.monitor.projectList.listNeedReload
    ) {
      this.fetchData(parseInt(page, 10));
    }
  }
  componentDidUpdate(prevProps) {
    const page = parseInt(this.props.match.params.page || 1, 10);
    const prevPage = parseInt(prevProps.match.params.page || 1, 10);
    if (prevPage !== page && !this.props.monitor.projectList.fetchProjectListPending) {
      this.fetchData(page);
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/projects/${newPage}`);
    // this.props.fetchList(newPage);
  };
  fetchData(page) {
    this.props.actions.fetchProjectList({ page: page, pageSize: this.state.pageSize });
  }
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    saveProjectListPageSize(pageSize);
    this.props.actions.fetchProjectList({ page: current, pageSize: pageSize });
    this.forceUpdate();
  };
  getColumns() {
    return [
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_id' }),
      //   dataIndex: 'id',
      //   key: 'id',
      // },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          const path = `/monitor/project/${record.id}/issues/1`;
          return (
            <div>
              <Link to={path}>{record.name}</Link>
            </div>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_cost' }),
        dataIndex: 'cost',
        key: 'cost',
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
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_location' }),
      //   dataIndex: 'location',
      //   key: 'location',
      // },

      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_overview' }),
      //   dataIndex: 'overview',
      //   key: 'overview',
      // },
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_designUnit' }),
      //   dataIndex: 'designUnit',
      //   key: 'designUnit',
      // },
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_monitorUnit' }),
      //   dataIndex: 'monitorUnit',
      //   key: 'monitorUnit',
      // },
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_constructionUnit' }),
      //   dataIndex: 'constructionUnit',
      //   key: 'constructionUnit',
      // },
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
      // {
      //   title: this.props.intl.formatMessage({ id: 'projects_table_title_operator' }),
      //   dataIndex: 'id',
      //   key: 'operator',
      //   render: id => {
      //     const path = `/monitor/project/${id}/issues/1`;
      //     return (
      //       <div>
      //         <Link to={path}>
      //           <FormattedMessage id="projects_table_title_operator_value" />
      //         </Link>
      //       </div>
      //     );
      //   },
      // },
    ];
  }
  render() {
    if (this.props.monitor.projectList.fetchProjectListError) {
      return <div>{this.props.monitor.projectList.fetchProjectListError.error}</div>;
    }
    const { page, total, pageSize } = this.props.monitor.projectList;
    return (
      <div className="monitor-projects">
        <h1>
          <FormattedMessage id="projects_content_h1" />
        </h1>
        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns()}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.projectList.fetchProjectListPending}
        />
        <Pagination
          current={page}
          onChange={this.handlePageChange}
          total={total}
          pageSize={pageSize}
          onShowSizeChange={this.handleSizeChange}
          showSizeChanger={true}
          pageSizeOptions={['1', '2', '5', '10', '20', '30', '40']}
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
