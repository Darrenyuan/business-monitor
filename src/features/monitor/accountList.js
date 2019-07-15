import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {
  Table,
  Pagination,
  Input,
  Select,
  Button,
  Modal,
  Breadcrumb,
  Form,
  message,
  Popconfirm,
  Transfer,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { loaduserListPageSize, saveuserListPageSize } from '../../common/sessionStorage';
import 'react-sticky-header/styles.css';
import Lightbox from 'react-images';
import roleConstants from './constants/roleConstants';
import roleLists from './constants/roleList';
import {
  apiCreateAcciunt,
  apiUpdateAcciunt,
  apiUserBlock,
  apiUserUnBlock,
  apiUserDelete,
  apiGetAvailableProjects,
  apiIfUserNameExist,
  apiGetAvailableTitle,
  apiRestorePassword,
} from '../monitor/axios/api';
import AccountCreateModal from './AccountCreateModal';
import AccountEditModal from './AccountEditModal';
const getItems = monitor => monitor.userList.items;
const getById = monitor => monitor.userList.byId;

const dataSourceSelector = createSelector(
  getItems,
  getById,
  (items, byId) => {
    if (!items) return [];
    return items.map(id => byId[id]);
  },
);
const Option = Select.Option;
const keywordDataListList = [];

export class accounList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      projectId: this.props.match.params.projectId ? this.props.match.params.projectId : 0,
      keywordMapList: keywordDataListList[0],
      pageSize: loaduserListPageSize(),
      hasInteraction: this.hasInteraction(),
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
      dataSource: [],
      targetKeys: [],
      visible: false,
      createAccountModalVisible: false,
      editAccountModalVisible: false,
      disUserName: true,
      isvalue: null,
      accountStatus: '',
      power: '',
      confirmDirty: false,
      project: '',
      roles: '',
      autoCompleteResult: [],
      showPassword: true,
      showRoles: true,
      userId: 0,
      projectName: '',
      username: '',
      roleName: '',
      status: '',
      inputValue: '',
      nickname: '',
      editData: {},
      needReload: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleCreateModal = this.handleCreateModal.bind(this);
    this.handleCreateModalCancel = this.handleCreateModalCancel.bind(this);
    this.handleEditModalCancel = this.handleEditModalCancel.bind(this);
    this.forceReload = this.forceReload.bind(this);
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
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getDataSource = dataSourceSelector;

  componentDidMount() {
    const page = this.props.match.params.page || '1';
    if (
      page !== this.props.monitor.userList.page ||
      !this.getDataSource(this.props.monitor.userList, this.props.monitor.userList.byId).length ||
      this.props.monitor.userList.listNeedReload
    ) {
      this.fetchData(parseInt(page, 10));
    }
    apiGetAvailableProjects().then(res => {
      let dataSource = res.data.data.map((item, i) => {
        item.key = item.id;
        return item;
      });

      this.setState({
        dataSource: dataSource,
      });
    });
    apiGetAvailableTitle().then(res => {
      this.setState({ titles: res.data.data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const page = parseInt(this.props.match.params.page || 1, 10);
    const prevPage = parseInt(prevProps.match.params.page || 1, 10);
    const pageSize = parseInt(this.state.pageSize || 5, 10);
    const prevPageSize = parseInt(prevState.pageSize || 5, 10);
    if (
      (prevPage !== page || pageSize !== prevPageSize || this.state.needReload) &&
      !this.props.monitor.userList.fetchUserList
    ) {
      this.fetchData(page);
      this.setState({ needReload: false });
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/accountList/${newPage}`);
  };

  fetchData(page) {
    this.props.actions.fetchUserList({
      page: page,
      pageSize: this.state.pageSize,
      projectName: this.state.projectName,
      username: this.state.username,
      roleName: this.state.roleName,
      status: this.state.status,
      nickname: this.state.nickname,
    });
  }
  closeLightbox = () => {
    this.setState({
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
    });
  };

  gotoPrevLightboxImage = () => {
    this.setState({ currentImage: this.state.currentImage > 0 ? this.state.currentImage - 1 : 0 });
  };
  gotoNextLightboxImage = () => {
    this.setState({ currentImage: this.state.currentImage + 1 });
  };
  getColumns(roleMap) {
    return [
      {
        title: this.props.intl.formatMessage({ id: 'account_Name' }),
        dataIndex: 'username',
        key: 'username',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_ProjectName' }),
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, record) => {
          if (record.hasAllProjectPrivilege) {
            return (
              <span>
                <FormattedMessage id="account_list_project_all" />
              </span>
            );
          } else if (record.projectVos && record.projectVos.length > 0) {
            let items = [];
            record.projectVos.map(item => {
              items.push(item.name);
            });
            return <span>{items.join()}</span>;
          }

          return '';
        },
      },
      // {
      //   title: this.props.intl.formatMessage({ id: 'establish_email' }),
      //   dataIndex: 'email',
      //   key: 'email',
      //   align: 'center',
      // },
      {
        title: this.props.intl.formatMessage({ id: 'phone_number' }),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_FullName' }),
        dataIndex: 'nickname',
        key: 'nickname',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_current_role' }),
        dataIndex: 'roles',
        key: 'roles',
        align: 'center',
        render: roles => {
          let roleName = '';
          if (roles && roles[0] && roles[0].roleName) {
            roleName = roles[0].roleName;
          }

          return <span key={roleName}>{roleMap.get(roleName)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_status' }),
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: status => {
          if (status === 1) {
            return (
              <span key="normal">
                <FormattedMessage id="normal" />
              </span>
            );
          } else {
            return (
              <span key="prohibit">
                <FormattedMessage id="prohibit" />
              </span>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'sidePanel_operation' }),
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, record) => {
          return (
            <div className="operation">
              {record.status === 1 ? (
                <Popconfirm
                  title={this.props.intl.formatMessage({ id: 'account_disable_message' })}
                  onConfirm={this.handleDisable.bind(this, record.username)}
                >
                  <div className="itemSpan">
                    {this.props.intl.formatMessage({ id: 'account_disable' })}
                  </div>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title={this.props.intl.formatMessage({ id: 'account_enable_message' })}
                  onConfirm={this.handleEnable.bind(this, record.username)}
                >
                  <div className="itemSpan">
                    {this.props.intl.formatMessage({ id: 'account_enable' })}
                  </div>
                </Popconfirm>
              )}

              <Popconfirm
                title={this.props.intl.formatMessage({ id: 'account_delete_message' })}
                onConfirm={this.handleDelete.bind(this, record.username)}
                className="leftSpan"
              >
                <div className="itemSpan">
                  {this.props.intl.formatMessage({ id: 'account_delete' })}
                </div>
              </Popconfirm>
              <div className="itemSpan" onClick={this.handleEdit.bind(this, record, roleMap)}>
                {this.props.intl.formatMessage({ id: 'edit' })}
              </div>
              <Popconfirm
                title={this.props.intl.formatMessage({ id: 'account_reset_message' })}
                onConfirm={this.handleResetPwd.bind(this, record.userId)}
                className="leftSpan"
              >
                <div className="itemSpan">
                  {this.props.intl.formatMessage({ id: 'account_reset' })}
                </div>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }
  handleDisable(username) {
    let _this = this;
    apiUserBlock({
      username: username,
    })
      .then(res => {
        this.forceReload();
      })
      .catch(arr => {});
  }

  handleEnable(username) {
    let _this = this;
    apiUserUnBlock({
      username: username,
    })
      .then(res => {
        this.forceReload();
      })
      .catch(arr => {});
  }

  handleDelete(username) {
    let _this = this;
    apiUserDelete({
      username: username,
    })
      .then(res => {
        _this.forceReload();
      })
      .catch(arr => {});
  }

  handleResetPwd(userId) {
    let _this = this;
    apiRestorePassword({
      userId: userId,
    })
      .then(res => {
        _this.forceReload();
      })
      .catch(arr => {});
  }

  handleStatusChange = (value, e) => {
    let status = 0;
    if (e.key === '正常') {
      status = 1;
    } else {
      status = 2;
    }
    this.setState({
      accountStatus: value,
      status: status,
    });
  };
  handlePowerChange = (value, e) => {
    let roleMap = roleConstants(this);
    console.log('value', value, e);
    let roleName = roleMap.get(e.key);
    console.log('value', roleName);
    this.setState({
      power: value,
      roleName: roleName,
    });
  };
  handleSearch = () => {
    this.fetchData(this.props.match.params.page || '1');
  };
  handleReset = () => {
    this.setState({
      username: '',
      roleName: '',
      status: '',
      accountStatus: '',
      power: '',
      inputValue: '',
      nickname: '',
      projectName: '',
      needReload: true,
    });
  };
  handleEdit(record, roleMap) {
    this.setState({ editData: record, editAccountModalVisible: true });
  }
  handleTypeProject(i, value) {
    this.setState({
      project: value.key,
    });
  }
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    saveuserListPageSize(pageSize);
    this.props.actions.fetchUserList({
      page: current,
      pageSize: pageSize,
      projectName: this.state.projectName,
      username: this.state.username,
      roleName: this.state.roleName,
      status: this.state.status,
    });
    this.forceUpdate();
    this.props.history.push(`/monitor/accountList/1`);
  };
  handleEstablish() {
    this.setState({
      SowCrreatevisible: true,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  }
  handleRolesChange = (i, value) => {
    this.setState({
      roles: value.key,
    });
  };

  initData() {
    this.setState({
      accountStatus: '',
      power: '',
      username: '',
      project: '',
      roles: '',
    });
  }
  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({ targetKeys });
  };
  inputChange(e) {
    this.setState({
      username: e.target.value,
      inputValue: e.target.value,
    });
  }
  renderItem(item) {
    const customLabel = <span key={item.id}>{item.name}</span>;
    return {
      label: customLabel,
      value: item.name,
    };
  }

  handleCreateModal() {
    this.setState({ createAccountModalVisible: true });
  }

  forceReload() {
    this.setState({ needReload: true });
  }
  handleCreateModalCancel() {
    this.setState({ createAccountModalVisible: false });
  }
  handleEditModalCancel() {
    this.setState({ editAccountModalVisible: false });
  }

  render() {
    if (this.props.monitor.userList.fetchUserListError) {
      return <div>{this.props.monitor.userList.fetchUserListError.error}</div>;
    }
    const roleMap = roleConstants(this);
    let { roleList, accountStatus } = roleLists(this);
    const { page, total, pageSize } = this.props.monitor.userList;
    const { byId } = this.props.monitor.userList;
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
    return (
      <div className="monitor-project">
        <div className="title_Breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>
              {this.props.intl.formatMessage({ id: 'sidePanel_welcome_link' })}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.props.intl.formatMessage({ id: 'account_List' })}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="table_title">
                <label>
                  <Input
                    value={this.state.inputValue}
                    onChange={this.inputChange.bind(this)}
                    placeholder={this.props.intl.formatMessage({ id: 'account_Name' })}
                    key="1"
                  />
                </label>
              </td>
              <td className="table_title">
                <label>
                  <Input
                    value={this.state.projectName}
                    onChange={e => {
                      this.setState({ projectName: e.target.value });
                    }}
                    placeholder={this.props.intl.formatMessage({ id: 'account_ProjectName' })}
                    key="2"
                  />
                </label>
              </td>
              <td className="table_title">
                <label>
                  <Input
                    value={this.state.nickname}
                    onChange={e => {
                      this.setState({ nickname: e.target.value });
                    }}
                    placeholder={this.props.intl.formatMessage({ id: 'account_FullName' })}
                    key="3"
                  />
                </label>
              </td>
              <td className="table_title">
                <Select
                  style={{ width: 160 }}
                  value={
                    this.state.power === ''
                      ? this.props.intl.formatMessage({ id: 'account_role' })
                      : this.state.power
                  }
                  onChange={this.handlePowerChange}
                  key="4"
                >
                  {roleList.map(typeMap => (
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
                    this.state.accountStatus === ''
                      ? this.props.intl.formatMessage({ id: 'account_status' })
                      : this.state.accountStatus
                  }
                  onChange={this.handleStatusChange}
                  key="5"
                >
                  {accountStatus.map(accountStatus => (
                    <Option key={accountStatus.value} value={accountStatus.key}>
                      {accountStatus.value}
                    </Option>
                  ))}
                </Select>
              </td>
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
              <td className="establish">
                <Button icon="user-add" onClick={this.handleCreateModal}>
                  <FormattedMessage id="sidePanel_account_link" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns(roleMap)}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.userList.fetchIssueListPending}
          scroll={{ x: true }}
        />
        <div className="account_pagination">
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
        <AccountCreateModal
          ref="myCreateModal"
          visible={this.state.createAccountModalVisible}
          onCancel={this.handleCreateModalCancel}
          reload={this.forceReload}
        />
        {Boolean(this.state.editAccountModalVisible) && (
          <AccountEditModal
            ref="myEditModal"
            onCancel={this.handleEditModalCancel}
            visible={this.state.editAccountModalVisible}
            data={this.state.editData}
            reload={this.forceReload}
          />
        )}
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
const accounListForm = Form.create({ name: 'register' })(accounList);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(accounListForm));
