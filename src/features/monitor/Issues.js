import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Pagination, Input, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { URL } from './axios/api';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import { loadIssueListPageSize, saveIssueListPageSize } from '../../common/sessionStorage';
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
const dimensionDataList = [];
const keywordDataListList = [];

export class Issues extends Component {
  constructor(props) {
    super(props);
    this.initData();
    this.state = {
      search: '',
      projectId: this.props.match.params.projectId ? this.props.match.params.projectId : 0,
      type: 0,
      status: 0,
      interaction: 0,
      keywordMapList: keywordDataListList[0],
      pageSize: loadIssueListPageSize(),
      hasInteraction: this.hasInteraction(),
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
      visible: false,
      projectName: '',
      issueName: '',
      startTime: '',
      endTime: '',
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

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/project/${this.state.projectId}/issues/${newPage}`);
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
          console.log(text, record);
          const path = `/monitor/issues/${record.id}`;
          return <div>{<Link to={path}>{record.name}</Link>}</div>;
        },
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
            case 4:
              return (
                <span>
                  <FormattedMessage id="issue_content_type_other" />
                </span>
              );
            default:
              return <span />;
          }
        },
      },
      // {
      //   title: this.props.intl.formatMessage({ id: 'issue_table_title_imagePath' }),
      //   dataIndex: 'imagePath',
      //   key: 'imagePath',
      //   render: imagePath => {
      //     var paths = JSON.parse(imagePath);
      //     return <Button onClick={() => this.handleClick(paths)}>查看</Button>;
      //   },
      // },
      // {
      //   title: this.props.intl.formatMessage({ id: 'issue_table_title_description' }),
      //   dataIndex: 'description',
      //   key: 'description',
      // },
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
      // {
      //   title: this.props.intl.formatMessage({ id: 'issue_table_title_createTime' }),
      //   dataIndex: 'createTime',
      //   key: 'createTime',
      //   render: createTime => {
      //     var stillUtc = moment.utc(createTime).toDate();
      //     var local = moment(stillUtc)
      //       .local()
      //       .format('YYYY-MM-DD HH:mm:ss');
      //     return <span>{local}</span>;
      //   },
      // },
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
    });
    this.fetchData(this.props.match.params.page || '1');
  };
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    saveIssueListPageSize(pageSize);
    this.fetchData();
    // this.props.history.push(`/monitor/project/${this.state.projectId}/issues/${current}`);
    this.forceUpdate();
  };
  render() {
    if (this.props.monitor.issueList.fetchIssueListError) {
      return <div>{this.props.monitor.issueList.fetchIssueListError.error}</div>;
    }

    const TabPane = Tabs.TabPane;
    const { TextArea } = Input;
    const { page, total } = this.props.monitor.issueList;
    const { byId } = this.props.monitor.searchProjectList;
    const project = byId[this.state.projectId];
    const typeList = [];
    const calculate = () => {
      return project.startTime.split('T')[0] + ' ~ ' + project.endTime.split('T')[0];
    };
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
    return (
      <div className="monitor-project">
        <div className="issues-header">
          <div>{project.name}</div>
          <span>
            <FormattedMessage id="projects_table_title_createTime" />
            &nbsp;&nbsp;{project.createTime.split('T')[0]}
          </span>
        </div>
        <Tabs defaultActiveKey="1" className="tabs">
          <TabPane
            tab={this.props.intl.formatMessage({ id: 'projects_table_title_detail' })}
            key="1"
          >
            <div className="detail_row">
              <div className="detail_row_itemLeft">
                <label className="detail_row_item_name">
                  <FormattedMessage id="projects_table_title_duration" />
                </label>
                <Input disabled className="detail_row_item_text" placeholder={calculate()} />
              </div>
              <div className="detail_row_itemRight">
                <label className="detail_row_item_name">
                  <FormattedMessage id="projects_table_title_designUnit" />
                </label>
                <Input disabled placeholder={project.designUnit} className="detail_row_item_text" />
              </div>
            </div>
            <div className="detail_row">
              <div className="detail_row_itemLeft">
                <label className="detail_row_item_name">
                  <FormattedMessage id="projects_table_title_cost" />
                </label>
                <Input disabled placeholder={project.cost} className="detail_row_item_text" />
              </div>
              <div className="detail_row_itemRight">
                <label className="detail_row_item_name">
                  <FormattedMessage id="projects_table_title_monitorUnit" />
                </label>
                <Input
                  disabled
                  placeholder={project.monitorUnit}
                  className="detail_row_item_text"
                />
              </div>
              <div className="detail_row">
                <div className="detail_row_itemLeft">
                  <label className="detail_row_item_name">
                    <FormattedMessage id="projects_table_title_location" />
                  </label>
                  <Input disabled placeholder={project.location} className="detail_row_item_text" />
                </div>
                <div className="detail_row_itemRight">
                  <label className="detail_row_item_name">
                    <FormattedMessage id="projects_table_title_constructionUnit" />
                  </label>
                  <Input
                    disabled
                    placeholder={project.constructionUnit}
                    className="detail_row_item_text"
                  />
                </div>
              </div>
              <div className="detail_row_final">
                <label>
                  <FormattedMessage id="projects_table_title_overview" />
                </label>
                <TextArea
                  rows={5}
                  disabled
                  className="detail_row_final_text"
                  placeholder={project.overview}
                />
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={this.props.intl.formatMessage({ id: 'projects_table_title_operator_issue' })}
            key="2"
          >
            <Table
              dataSource={this.getDataSource(this.props.monitor)}
              columns={this.getColumns()}
              pagination={false}
              loading={this.props.monitor.issueList.fetchIssueListPending}
              className="issues_table"
            />
            <div className="projects_title_pagination">
              <Pagination
                current={page}
                onChange={this.handlePageChange}
                total={total}
                pageSize={this.state.pageSize}
                onShowSizeChange={this.handleSizeChange}
                showSizeChanger={true}
                pageSizeOptions={['1', '2', '5', '10', '20', '30', '40']}
              />
              <Lightbox
                images={this.state.imagePath}
                isOpen={this.state.lightboxIsOpen}
                onClose={this.closeLightbox}
                onClickPrev={this.gotoPrevLightboxImage}
                onClickNext={this.gotoNextLightboxImage}
                currentImage={this.state.currentImage}
              />
            </div>
          </TabPane>
        </Tabs>
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
