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
  apiGetAvailableProjects,
  apiIfUserNameExist,
  apiGetAvailableTitle,
} from '../monitor/axios/api';
const getItems = monitor => monitor.userList.items;
const getById = monitor => monitor.userList.byId;

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
      (prevPage !== page || pageSize !== prevPageSize) &&
      !this.props.monitor.userList.fetchIssueListPending
    ) {
      this.fetchData(page);
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
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_ProjectName' }),
        dataIndex: 'id',
        key: 'id',
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
      {
        title: this.props.intl.formatMessage({ id: 'establish_email' }),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: this.props.intl.formatMessage({ id: 'phone_number' }),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_full_name' }),
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_current_role' }),
        dataIndex: 'roles',
        key: 'roles',
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
        render: (text, record) => {
          return (
            <div className="operation">
              {record.status === 2 ? (
                <div className="abandoning" />
              ) : (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={this.handleDelete.bind(this, record.username)}
                >
                  <div className="abandoning">
                    {this.props.intl.formatMessage({ id: 'account_abandoning' })}
                  </div>
                </Popconfirm>
              )}

              <div
                className="abandoning edit"
                onClick={this.handleEdit.bind(this, record, roleMap)}
              >
                {this.props.intl.formatMessage({ id: 'edit' })}
              </div>
            </div>
          );
        },
      },
    ];
  }
  handleDelete(username) {
    let _this = this;
    console.log('ssssssssss');
    apiUserBlock({
      username: username,
    })
      .then(res => {
        _this.fetchData();
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
    console.log('创建账号');
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
    });
    this.fetchData(this.props.match.params.page || '1');
  };
  handleEdit(record, roleMap) {
    //console.log('record', record);
    // console.log('roleMap.get(record.roles[0].roleName)', roleMap.get(record.roles[0].roleName));
    const form = this.props.form;
    let projectId = record.projectVos.reduce((r, c, i) => {
      return [...r, c.id];
    }, []);
    console.log('record.projectVos', projectId);
    let roleName = '';
    if (record.roles[0] && record.roles[0].roleName) {
      roleName = record.roles[0].roleName;
    }
    let roles = roleMap.get(roleName);
    if ('admin' === roleName || 'leader' === roleName) {
      this.setState({
        visible: true,
        roles: roles,
        project: '',
        showPassword: true,
        showRoles: true,
        userId: record.userId,
        targetKeys: projectId,
      });
    } else {
      this.setState({
        visible: true,
        roles: roles,
        project: '',
        showPassword: true,
        showRoles: false,
        userId: record.userId,
        targetKeys: projectId,
      });
    }

    form.setFieldsValue({
      username: record.username,
      full_name: record.nickname,
      phone_number: record.phoneNumber,
      email: record.email,
    });
  }
  handleTypeProject(i, value) {
    this.setState({
      project: value.key,
    });
  }
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    saveuserListPageSize(pageSize);
    console.log('current', current);
    this.props.actions.fetchUserList({
      page: current,
      pageSize: pageSize,
      projectName: this.state.projectName,
      username: this.state.username,
      roleName: this.state.roleName,
      status: this.state.status,
    });
    this.forceUpdate();
  };
  handleEstablish() {
    this.setState({
      visible: true,
      showPassword: false,
      showRoles: false,
      targetKeys: [],
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
  handleSubmit = (roleMap, e) => {
    e.preventDefault();
    console.log('en', e);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.roles !== '') {
          if (this.state.disUserName) {
            if (this.state.showPassword) {
              console.log('5000', this.state.userId);
              apiUpdateAcciunt({
                username: values.username,
                nickname: values.full_name,
                roles: [{ roleName: roleMap.get(this.state.roles) }],
                phoneNumber: values.phone_number,
                email: values.email,
                userId: this.state.userId,
                status: 1,
                projectIds: this.state.targetKeys,
              })
                .then(res => {
                  if (res.data.status === 200) {
                    this.setState({
                      visible: false,
                    });
                  }
                })
                .catch(err => {
                  message.error(err);
                });
            } else {
              console.log('Received values of form: ', values);
              apiCreateAcciunt({
                username: values.username,
                nickname: values.full_name,
                roles: [{ roleName: roleMap.get(this.state.roles) }],
                phoneNumber: values.phone_number,
                email: values.email,
                password: values.password,
                status: 1,
                projectIds: this.state.targetKeys,
              })
                .then(res => {
                  if (res.data.status === 200) {
                    this.setState({
                      visible: false,
                    });
                  }
                })
                .catch(err => {
                  message.error(err);
                });
            }
          } else {
            message.warning(
              this.props.intl.formatMessage({ id: 'account_user_name_already_exists' }),
            );
          }

          console.log('wsaccxx=>>>>>>>>');
        } else {
          message.warning(this.props.intl.formatMessage({ id: 'account_please_choose_roles' }));
        }
      }
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
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  handledataToUsername = e => {
    let _this = this;
    const value = e.target.value;
    apiIfUserNameExist({
      username: value,
    })
      .then(res => {
        if (res.data.data === false) {
          _this.setState({
            disUserName: true,
          });
          message.success(this.props.intl.formatMessage({ id: 'account_user_names_can_be_used' }));
        } else {
          _this.setState({
            disUserName: false,
          });
          message.warning(
            this.props.intl.formatMessage({ id: 'account_user_name_already_exists' }),
          );
        }
      })
      .catch();
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.props.intl.formatMessage({ id: 'reset_passowrd_confirm_password_callbak' }));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  validateToNextPhone = e => {
    const value = e.target.value;
    // let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // let isvalue = mPattern.test(value);
    // this.setState({
    //   isvalue
    // })
    console.log('rule,value,callback', value);
  };
  validateToNextPhoneNumber = (rule, value, callback) => {
    let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let isvalue = mPattern.test(value);
    if (isvalue) {
      callback();
    } else {
      callback('请输入有效的手机号!');
    }
  };
  handleChange = (targetKeys, direction, moveKeys) => {
    console.log(targetKeys, direction, moveKeys);
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
  render() {
    if (this.props.monitor.userList.fetchUserListError) {
      return <div>{this.props.monitor.userList.fetchUserListError.error}</div>;
    }
    const formItemLayout = {
      labelCol: { sm: { span: 4 }, xs: { span: 24 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
    };
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
    const { getFieldDecorator } = this.props.form;
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
                <Button icon="user-add" onClick={this.handleEstablish.bind(this)}>
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
        <Modal
          title={this.props.intl.formatMessage({ id: 'sidePanel_account_link' })}
          visible={this.state.visible}
          width={620}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit.bind(this, roleMap)}>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_step4_table_username' })}
            >
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_username' }),
                  },
                  {
                    validator: this.validateToNextUsername,
                  },
                ],
              })(<Input onBlur={this.handledataToUsername} />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'account_full_name' })}
            >
              {getFieldDecorator('full_name', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_full_name' }),
                  },
                  {
                    validator: this.validateToNextFullname,
                  },
                ],
              })(<Input />)}
            </Form.Item>
            {this.state.showRoles ? (
              <div />
            ) : (
              <Form.Item
                {...formItemLayout}
                label={this.props.intl.formatMessage({ id: 'account_role' })}
              >
                <Select
                  value={
                    this.state.roles === ''
                      ? this.props.intl.formatMessage({ id: 'account_role' })
                      : this.state.roles
                  }
                  onChange={this.handleRolesChange}
                >
                  {this.state.titles.map(item => (
                    <Option key={item} value={item}>
                      {roleMap.get(item)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {this.state.showRoles ? (
              <div />
            ) : (
              <Form.Item
                labelCol={{ sm: { span: 3 }, xs: { span: 24 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 21 } }}
                label={this.props.intl.formatMessage({ id: 'sidePanel_project' })}
              >
                <Transfer
                  dataSource={this.state.dataSource}
                  listStyle={{
                    width: 207,
                    height: 300,
                  }}
                  operations={[
                    this.props.intl.formatMessage({ id: 'add' }),
                    this.props.intl.formatMessage({ id: 'remove' }),
                  ]}
                  targetKeys={this.state.targetKeys}
                  onChange={this.handleChange}
                  render={this.renderItem.bind(this)}
                />
              </Form.Item>
            )}

            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'phone_number' })}
            >
              {getFieldDecorator('phone_number', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_phonenumber' }),
                  },
                  {
                    validator: this.validateToNextPhoneNumber,
                  },
                ],
              })(<Input onBlur={this.validateToNextPhone} />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={this.props.intl.formatMessage({ id: 'establish_email' })}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: this.props.intl.formatMessage({ id: 'account_step4_valid_e_mail' }),
                  },
                  {
                    required: true,
                    message: this.props.intl.formatMessage({ id: 'account_step4_e_mail' }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            {this.state.showPassword ? (
              <div />
            ) : (
              <Form.Item
                {...formItemLayout}
                label={this.props.intl.formatMessage({ id: 'reset_password_password_label' })}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.formatMessage({
                        id: 'reset_password_password_message',
                      }),
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input type="password" />)}
              </Form.Item>
            )}
            {this.state.showPassword ? (
              <div />
            ) : (
              <Form.Item
                {...formItemLayout}
                label={this.props.intl.formatMessage({
                  id: 'reset_password_confirm_password_title',
                })}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.formatMessage({
                        id: 'reset_password_confirm_password_message',
                      }),
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </Form.Item>
            )}

            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
              <Button htmlType="submit" type="primary">
                {this.props.intl.formatMessage({ id: 'reset_password_button' })}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
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
