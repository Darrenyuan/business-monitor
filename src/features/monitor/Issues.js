import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Table, Pagination, Input, Select, Button } from 'antd';
import { FormattedMessage, injectIntl, IntlMessageFormat } from 'react-intl';
import { URL } from './axios/api';
import moment from 'moment';
import { createSelector } from 'reselect';
import { loadIssueListPageSize } from '../../common/sessionStorage';

const pageSize = 10;
const getItems = monitor => monitor.issueList.items;
const getById = monitor => monitor.issueList.byId;
const dataSourceSelector = createSelector(
  getItems,
  getById,
  (items, byId) => {
    console.log('reselect: get data source');
    if (!items) return [];
    return items.map(id => byId[id]);
  },
);
const Option = Select.Option;
const dimensionDataList = [];
const keywordDataListList = [];

export class Issues extends Component {
  constructor(props) {
    super(props);
    this.initData();
    this.state = {
      search: '',
      projectId: this.props.match.params.projectId,
      keyword: 0,
      dimension: 0,
      keywordMapList: keywordDataListList[0],
      pageSize: loadIssueListPageSize(),
    };
    this.fetchData = this.fetchData.bind(this);
  }
  initData() {
    while (dimensionDataList.length > 0) {
      dimensionDataList.pop();
    }
    dimensionDataList.push({
      key: 1,
      value: this.props.intl.formatMessage({ id: 'issue_table_title_type' }),
    });
    dimensionDataList.push({
      key: 2,
      value: this.props.intl.formatMessage({ id: 'issue_table_title_status' }),
    });
    dimensionDataList.push({
      key: 3,
      value: this.props.intl.formatMessage({ id: 'issue_table_title_interaction' }),
    });
    while (keywordDataListList.length > 0) {
      keywordDataListList.pop();
    }
    keywordDataListList.push([
      { key: 1, value: this.props.intl.formatMessage({ id: 'issue_content_type_material' }) },
      { key: 2, value: this.props.intl.formatMessage({ id: 'issue_content_type_quality' }) },
      { key: 3, value: this.props.intl.formatMessage({ id: 'issue_content_type_security' }) },
      { key: 4, value: this.props.intl.formatMessage({ id: 'issue_content_type_other' }) },
    ]);
    keywordDataListList.push([
      {
        key: 1,
        value: this.props.intl.formatMessage({ id: 'issue_content_status_wait_feed_back' }),
      },
      { key: 2, value: this.props.intl.formatMessage({ id: 'issue_content_status_wait_confirm' }) },
      { key: 3, value: this.props.intl.formatMessage({ id: 'issue_content_status_confirm' }) },
    ]);
    keywordDataListList.push([
      { key: 1, value: this.props.intl.formatMessage({ id: 'issue_content_interaction_inner' }) },
      { key: 2, value: this.props.intl.formatMessage({ id: 'issue_content_interaction_outer' }) },
    ]);
  }

  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getDataSource = dataSourceSelector;

  componentDidMount() {
    const page = this.props.match.params.page || '1';
    if (
      page !== this.props.monitor.issueList.page ||
      !this.getDataSource(this.props.monitor.issueList, this.props.monitor.issueList.byId).length ||
      this.props.monitor.issueList.listNeedReload
    ) {
      this.fetchData(parseInt(page, 10));
    }
  }

  componentDidUpdate(prevProps) {
    const page = parseInt(this.props.match.params.page || 1, 10);
    const prevPage = parseInt(prevProps.match.params.page || 1, 10);
    if (prevPage !== page && !this.props.monitor.issueList.fetchIssueListPending) {
      this.fetchData(page);
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/project/${this.state.projectId}/issues/${newPage}`);
    // this.props.fetchList(newPage);
  };

  fetchData(page) {
    this.props.actions.fetchIssueList({
      page: page,
      pageSize: this.state.pageSize,
      projectId: this.state.projectId,
      keyword: this.state.keyword,
      dimension: this.state.dimension,
    });
  }

  getColumns() {
    return [
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_id' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_type' }),
        dataIndex: 'type',
        key: 'type',
        render: type => {
          switch (type) {
            case 1:
              return (
                <span>
                  <FormattedMessage id="issue_content_type_material" />
                </span>
              );
            case 2:
              return (
                <span>
                  <FormattedMessage id="issue_content_type_quality" />
                </span>
              );
            case 3:
              return (
                <span>
                  <FormattedMessage id="issue_content_type_security" />
                </span>
              );
              break;
            case 4:
              return (
                <span>
                  <FormattedMessage id="issue_content_type_security" />
                </span>
              );
            default:
              return <span />;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_imagePath' }),
        dataIndex: 'imagePath',
        key: 'imagePath',
        render: imagePath => {
          let path = URL + '/resources/' + imagePath;
          return (
            <div>
              <img src={path} alt="image" height="100" width="100" />
            </div>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_description' }),
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_status' }),
        dataIndex: 'status',
        key: 'status',
        render: status => {
          switch (status) {
            case 1:
              return (
                <span>
                  <FormattedMessage id="issue_content_status_wait_feed_back" />
                </span>
              );
            case 2:
              return (
                <span>
                  <FormattedMessage id="issue_content_status_wait_confirm" />
                </span>
              );
            case 3:
              return (
                <span>
                  <FormattedMessage id="issue_content_status_confirm" />
                </span>
              );

            default:
              return <span />;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_sponsorName' }),
        dataIndex: 'sponsorName',
        key: 'sponsorName',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_handlerName' }),
        dataIndex: 'handlerName',
        key: 'handlerName',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_interaction' }),
        dataIndex: 'interaction',
        key: 'interaction',
        render: interaction => {
          switch (interaction) {
            case 1:
              return (
                <span>
                  <FormattedMessage id="issue_content_interaction_inner" />
                </span>
              );
            case 2:
              return (
                <span>
                  <FormattedMessage id="issue_content_interaction_outer" />
                </span>
              );
            default:
              return <span />;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_createTime' }),
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
      //   title: this.props.intl.formatMessage({ id: 'issue_table_title_lastUpdateTime' }),
      //   dataIndex: 'lastUpdateTime',
      //   key: 'lastUpdateTime',
      //   render: lastUpdateTime => {
      //     var stillUtc = moment.utc(lastUpdateTime).toDate();
      //     var local = moment(stillUtc)
      //       .local()
      //       .format('YYYY-MM-DD HH:mm:ss');
      //     return <span>{local}</span>;
      //   },
      // },
    ];
  }
  handleDimensionChange = value => {
    this.setState({
      dimension: value,
      keyword: 0,
      keywordMapList: keywordDataListList[value - 1],
    });
  };
  handleKeywordChange = value => {
    this.setState({
      keyword: value,
    });
  };
  handleSearch = () => {
    this.fetchData(this.props.match.params.page || '1');
  };
  handleReset = () => {
    this.setState({
      dimension: 0,
      keyword: 0,
    });
    this.fetchData(this.props.match.params.page || '1');
  };

  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    this.props.actions.fetchIssueList({
      page: current,
      pageSize: this.state.pageSize,
      projectId: this.state.projectId,
      keyword: this.state.keyword,
      dimension: this.state.dimension,
    });
    this.forceUpdate();
  };
  render() {
    if (this.props.monitor.issueList.fetchIssueListError) {
      return <div>{this.props.monitor.issueList.fetchIssueListError.error}</div>;
    }

    const { page, total } = this.props.monitor.issueList;

    return (
      <div className="monitor-project">
        <table>
          <tr>
            <td>
              <label>
                <FormattedMessage id="issue_search_label_dimension" />
              </label>
            </td>
            <td>
              <Select
                style={{ width: 120 }}
                value={this.state.dimension === 0 ? '' : this.state.dimension}
                onChange={this.handleDimensionChange}
              >
                {dimensionDataList.map(dimensionMap => (
                  <Option key={dimensionMap.value} value={dimensionMap.key}>
                    {dimensionMap.value}
                  </Option>
                ))}
              </Select>
            </td>
            <td>
              <label>
                <FormattedMessage id="issue_search_label_keyword" />
              </label>
            </td>
            <td>
              <Select
                style={{ width: 120 }}
                value={this.state.keyword === 0 ? '' : this.state.keyword}
                onChange={this.handleKeywordChange}
              >
                {this.state.keywordMapList.map(map => (
                  <Option key={map.value} value={map.key}>
                    {map.value}
                  </Option>
                ))}
              </Select>
            </td>
            <td>
              <Button type="primary" icon="search" onClick={this.handleSearch}>
                <FormattedMessage id="issue_search_label_search" />
              </Button>
            </td>
            <td>
              <Button type="primary" icon="reload" onClick={this.handleReset}>
                <FormattedMessage id="issue_search_label_reset" />
              </Button>
            </td>
          </tr>
        </table>
        <br />

        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns()}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.issueList.fetchIssueListPending}
        />
        <Pagination
          current={page}
          onChange={this.handlePageChange}
          total={total}
          pageSize={this.state.pageSize}
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
)(injectIntl(Issues));
