import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Table, Pagination, Input, Select, Button, DatePicker, Breadcrumb } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { URL } from './axios/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createSelector } from 'reselect';
import { loadIssueListPageSize, saveIssueListPageSize } from '../../common/sessionStorage';
import 'react-sticky-header/styles.css';
import Lightbox from 'react-images';
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

export class IssuesList extends Component {
  constructor(props) {
    super(props);
    this.initData();
    this.state = {
      search: '',
      projectId: this.props.match.params.projectId ? this.props.match.params.projectId : 0,
      type: 0,
      status: 0,
      interaction: 0,
      projectName: '',
      issueName: '',
      startTime: '',
      endTime: '',
      keywordMapList: keywordDataListList[0],
      pageSize: loadIssueListPageSize(),
      hasInteraction: this.hasInteraction(),
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
    };

    this.fetchData = this.fetchData.bind(this);
  }
  hasInteraction = () => {
    const loginData = this.props.monitor.loginData;
    const interactionRoleList = [
      'admin',
      'projectManager',
      'leader',
      'projectDirector',
      'produceDirector',
      'professionalForeman',
      'securityGuard',
      'qualityInspector',
      'materialStaff',
    ];
    let result = false;
    if (loginData) {
      const { roles } = loginData;
      roles.forEach(function(item, index, array) {
        const roleName = item.roleName;
        if (interactionRoleList.includes(roleName)) {
          result = true;
        }
      });
    }
    return result;
  };

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

  componentDidUpdate(prevProps, prevState) {
    const page = parseInt(this.props.match.params.page || 1, 10);
    const prevPage = parseInt(prevProps.match.params.page || 1, 10);
    const pageSize = parseInt(this.state.pageSize || 5, 10);
    const prevPageSize = parseInt(prevState.pageSize || 5, 10);
    if (
      (prevPage !== page || pageSize !== prevPageSize) &&
      !this.props.monitor.issueList.fetchIssueListPending
    ) {
      this.fetchData(page);
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/issuesList/${newPage}`);
    // this.props.fetchList(newPage);
  };

  fetchData(page) {
    this.props.actions.fetchIssueList({
      page: page,
      pageSize: this.state.pageSize,
      projectId: this.state.projectId,
      type: this.state.type,
      status: this.state.status,
      interaction: this.state.interaction,
      projectName: this.state.projectName,
      issueName: this.state.issueName,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });
  }
  closeLightbox = () => {
    this.setState({
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
    });
  };

  handleClick = paths => {
    const imageObjectList = [];
    paths.forEach(path => {
      const obj = { src: URL + path };
      imageObjectList.push(obj);
    });
    this.setState({
      imagePath: imageObjectList,
      lightboxIsOpen: true,
    });
  };
  gotoPrevLightboxImage = () => {
    this.setState({ currentImage: this.state.currentImage > 0 ? this.state.currentImage - 1 : 0 });
  };
  gotoNextLightboxImage = () => {
    this.setState({ currentImage: this.state.currentImage + 1 });
  };
  getColumns() {
    return [
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          const path = `/monitor/issuesList/issuesDetail/${record.id}`;
          return <div>{<Link to={path}>{record.name}</Link>}</div>;
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'sidePanel_projectBelongs' }),
        dataIndex: 'projectName',
        key: 'projectName',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_type' }),
        dataIndex: 'type',
        key: 'type',
        render: type => {
          switch (type) {
            case 1:
              return (
                <span key={1}>
                  <FormattedMessage id="issue_content_type_material" />
                </span>
              );
            case 2:
              return (
                <span key={2}>
                  <FormattedMessage id="issue_content_type_quality" />
                </span>
              );
            case 3:
              return (
                <span key={3}>
                  <FormattedMessage id="issue_content_type_security" />
                </span>
              );
              break;
            case 4:
              return (
                <span key={4}>
                  <FormattedMessage id="issue_content_type_other" />
                </span>
              );
            default:
              return <span key={0} />;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_status' }),
        dataIndex: 'status',
        key: 'status',
        render: status => {
          switch (status) {
            case 1:
              return (
                <span style={{ color: 'red' }} key={5}>
                  <FormattedMessage id="issue_content_status_wait_feed_back" />
                </span>
              );
            case 2:
              return (
                <span style={{ color: 'blue' }} key={6}>
                  <FormattedMessage id="issue_content_status_wait_confirm" />
                </span>
              );
            case 3:
              return (
                <span style={{ color: 'green' }} key={7}>
                  <FormattedMessage id="issue_content_status_confirm" />
                </span>
              );

            default:
              return <span key={8} />;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_sponsorName' }),
        dataIndex: 'sponsorName',
        key: 'sponsorName',
      },
      {
        title: this.props.intl.formatMessage({ id: 'issue_table_title_interaction' }),
        dataIndex: 'interaction',
        key: 'interaction',
        render: interaction => {
          switch (interaction) {
            case 1:
              return (
                <span key={11}>
                  <FormattedMessage id="issue_content_interaction_inner" />
                </span>
              );
            case 2:
              return (
                <span key={12}>
                  <FormattedMessage id="issue_content_interaction_outer" />
                </span>
              );
            default:
              return <span key={13} />;
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
  handleStatusChange = value => {
    this.setState({
      status: value,
    });
  };
  handleTypeChange = value => {
    this.setState({
      type: value,
    });
  };
  handleInteractionChange = value => {
    this.setState({
      interaction: value,
    });
  };
  handleSearch = () => {
    this.fetchData(this.props.match.params.page || '1');
  };
  handleReset = () => {
    this.setState({
      type: 0,
      status: 0,
      interaction: 0,
      projectName: '',
      issueName: '',
    });
    this.fetchData(this.props.match.params.page || '1');
  };
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    saveIssueListPageSize(pageSize);
    this.props.actions.fetchIssueList({
      page: current,
      pageSize: pageSize,
      projectId: this.state.projectId,
      type: this.state.type,
      status: this.state.status,
      interaction: this.state.interaction,
      projectName: this.state.projectName,
      issueName: this.state.issueName,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });

    this.forceUpdate();
  };
  render() {
    if (this.props.monitor.issueList.fetchIssueListError) {
      return <div>{this.props.monitor.issueList.fetchIssueListError.error}</div>;
    }
    console.log('thisissues', this);
    const { page, total, pageSize } = this.props.monitor.issueList;
    const { byId } = this.props.monitor.issueList;
    let issueList = [];
    let project;
    if (byId) {
      for (const key in byId) {
        issueList.unshift(byId[key]);
      }
    }
    if (this.state.projectId === 0) {
      project = issueList;
    } else {
      project = byId[this.state.projectId];
    }
    const typeList = [];
    typeList.push({
      key: 1,
      value: this.props.intl.formatMessage({ id: 'issue_content_type_material' }),
    });
    typeList.push({
      key: 2,
      value: this.props.intl.formatMessage({ id: 'issue_content_type_quality' }),
    });
    typeList.push({
      key: 3,
      value: this.props.intl.formatMessage({ id: 'issue_content_type_security' }),
    });
    typeList.push({
      key: 4,
      value: this.props.intl.formatMessage({ id: 'issue_content_type_other' }),
    });
    const statusList = [
      {
        key: 1,
        value: this.props.intl.formatMessage({ id: 'issue_content_status_wait_feed_back' }),
      },
      { key: 2, value: this.props.intl.formatMessage({ id: 'issue_content_status_wait_confirm' }) },
      { key: 3, value: this.props.intl.formatMessage({ id: 'issue_content_status_confirm' }) },
    ];
    const interactionList = [
      { key: 1, value: this.props.intl.formatMessage({ id: 'issue_content_interaction_inner' }) },
      { key: 2, value: this.props.intl.formatMessage({ id: 'issue_content_interaction_outer' }) },
    ];
    console.log('============>hasInteraction=' + this.state.hasInteraction);
    return (
      <div className="monitor-project">
        <div className="title_Breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>
              {this.props.intl.formatMessage({ id: 'sidePanel_welcome_link' })}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.props.intl.formatMessage({ id: 'issue_content_h1' })}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <table>
          <tbody>
            <tr>
              <td className="table_title">
                <label>
                  <Input
                    placeholder={this.props.intl.formatMessage({ id: 'sidePanel_issueTitle' })}
                    onChange={e => {
                      this.setState({ issueName: e.target.value });
                    }}
                    value={this.state.issueName}
                  />
                </label>
              </td>
              <td className="table_title">
                <label>
                  <Input
                    placeholder={this.props.intl.formatMessage({ id: 'sidePanel_projectBelongs' })}
                    onChange={e => {
                      this.setState({ projectName: e.target.value });
                    }}
                    value={this.state.projectName}
                  />
                </label>
              </td>
              <td className="table_title">
                <Select
                  style={{ width: 120 }}
                  value={
                    this.state.type === 0
                      ? this.props.intl.formatMessage({ id: 'sidePanel_issueType' })
                      : this.state.type
                  }
                  onChange={this.handleTypeChange}
                >
                  {typeList.map(typeMap => (
                    <Option key={typeMap.value} value={typeMap.key}>
                      {typeMap.value}
                    </Option>
                  ))}
                </Select>
              </td>
              <td className="table_title">
                <Select
                  style={{ width: 120 }}
                  value={
                    this.state.status === 0
                      ? this.props.intl.formatMessage({ id: 'sidePanel_issueStatus' })
                      : this.state.status
                  }
                  onChange={this.handleStatusChange}
                >
                  {statusList.map(statusMap => (
                    <Option key={statusMap.value} value={statusMap.key}>
                      {statusMap.value}
                    </Option>
                  ))}
                </Select>
              </td>
              {Boolean(this.state.hasInteraction) && (
                <td className="table_title">
                  <Select
                    style={{ width: 120 }}
                    value={
                      this.state.interaction === 0
                        ? this.props.intl.formatMessage({ id: 'sidePanel_issueInteraction' })
                        : this.state.interaction
                    }
                    onChange={this.handleInteractionChange}
                  >
                    {interactionList.map(interactionMap => (
                      <Option key={interactionMap.value} value={interactionMap.key}>
                        {interactionMap.value}
                      </Option>
                    ))}
                  </Select>
                </td>
              )}
              <td className="table_title">
                <Button icon="search" onClick={this.handleSearch}>
                  <FormattedMessage id="issue_search_label_search" />
                </Button>
              </td>
              <td className="table_title">
                <Button icon="reload" onClick={this.handleReset}>
                  <FormattedMessage id="issue_search_label_reset" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns()}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.issueList.fetchIssueListPending}
          scroll={{ x: true }}
        />
        <div className="issue_pagination">
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

        <Lightbox
          images={this.state.imagePath}
          isOpen={this.state.lightboxIsOpen}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevLightboxImage}
          onClickNext={this.gotoNextLightboxImage}
          currentImage={this.state.currentImage}
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
)(injectIntl(IssuesList));
