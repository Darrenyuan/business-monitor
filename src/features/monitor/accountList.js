import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Table, Pagination, Input, Select, Button,Modal,Breadcrumb,
  Form, message,Popconfirm,Transfer
} from 'antd';
import { FormattedMessage, injectIntl, IntlMessageFormat } from 'react-intl';
import { URL } from './axios/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createSelector } from 'reselect';
import { loadIssueListPageSize } from '../../common/sessionStorage';
import 'react-sticky-header/styles.css';
import Lightbox from 'react-images';
import roleConstants from './constants/roleConstants';
import roleLists from './constants/roleList';
import CreateAccount from "./Createacciunt";
import {apiCreateAcciunt,apiUpdateAcciunt,apiUserBlock,apiGetAvailableProjects} from '../monitor/axios/api'
const pageSize = 10;
const getItems = monitor =>  monitor.userList.items;
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
const dimensionDataList = [];
const keywordDataListList = [];

export class accounList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      projectId: this.props.match.params.projectId ?this.props.match.params.projectId:0,
      keywordMapList: keywordDataListList[0],
      pageSize: loadIssueListPageSize(),
      hasInteraction: this.hasInteraction(),
      imagePath: [],
      lightboxIsOpen: false,
      currentImage: 0,
      visible: false,
      disabled: true,
      isvalue: null,
      accountStatus: "",
      power: '',
      confirmDirty: false,
      project: '',
      roles: '',
      autoCompleteResult: [],
      showPassword: true,
      userId: 0
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
    apiGetAvailableProjects().then(res);
  }

  componentDidUpdate(prevProps,prevStatus) {
    const page = parseInt(this.props.match.params.page || 1, 10);
    const prevPage = parseInt(prevProps.match.params.page || 1, 10);
    if (prevPage !== page && !this.props.monitor.userList.fetchIssueListPending) {
      this.fetchData(page);
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/project/${this.state.projectId}/issues/${newPage}`);
  };

  fetchData(page) {
    this.props.actions.fetchUserList({
      page: 1,
      pageSize: 10
    })
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
      },{
        title: this.props.intl.formatMessage({ id: 'account_current_role' }),
        dataIndex: 'roles',
        key: 'roles',
        render: roles => {
          return (
            <span key={roles[0].roleName}>
              {roleMap.get(roles[0].roleName)}
            </span>
          );
        }
      },
      {
        title: this.props.intl.formatMessage({ id: 'account_status' }),
        dataIndex: 'status',
        key: 'status',
        render: status => {
          if(status === 1){

            return <span key='normal'>
              <FormattedMessage id="normal" />
            </span>

          }else{

            return <span key='prohibit'>
            <FormattedMessage id="prohibit" />
          </span>
          }
        }
      },
      
      {
        title: this.props.intl.formatMessage({ id: 'sidePanel_operation' }),
        dataIndex: 'id',
        key: 'id',
        render:(text, record)=> {
          return (
            <div className="operation">
              {
                record.status === 2 ?<div className="abandoning"/>:<Popconfirm title="Sure to delete?" onConfirm={this.handleDelete.bind(this,record.username)}>
                <div className="abandoning" onClick={()=>{console.log(11111);}}>{this.props.intl.formatMessage({ id: 'account_abandoning' })}
                </div> 
              </Popconfirm> 
              }
              
              <div className="abandoning edit" onClick={this.handleEdit.bind(this,record,roleMap)}>{ this.props.intl.formatMessage({ id: 'edit' })}</div>

            </div>
            )
        },
      },
    ];
  }
  handleDelete(username){
    let _this=this;
    console.log('ssssssssss');
    apiUserBlock({
      username: username
    }).then(res=>{
      _this.fetchData();
    }).catch(arr=>{

    })
  }
  handleStatusChange = value => {
    this.setState({
      accountStatus: value,
    });
  };
  handlePowerChange = value => {
    this.setState({
      power: value,
    });
  };
  handleSearch = () => {
    console.log("创建账号")
  };
  handleEdit(record,roleMap){
    console.log('record',record);
    console.log('roleMap.get(record.roles[0].roleName)',roleMap.get(record.roles[0].roleName));    const form = this.props.form;
    let roles = roleMap.get(record.roles[0].roleName);
    this.setState({
      visible: true,
      roles: roles,
      project: "",
      showPassword: true,
      userId: record.userId
    });
    form.setFieldsValue({
      username: record.username,
      full_name: record.nickname,
      phone_number: record.phoneNumber,
      email: record.email,
    })
  }
  handleTypeProject(i,value){
    this.setState({
      project: value.key,
    });
  }
  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });
    this.props.actions.fetchIssueList({
      page: current,
      pageSize: this.state.pageSize,
    });
    this.forceUpdate();
  };
  handleEstablish(){
    this.setState({
      visible: true,
      showPassword: false,
    });
  }
  handleCancel(){
    this.setState({
      visible: false,
    });
    this.props.form.resetFields(); 
  }
  handleRolesChange = (i,value) =>{
    this.setState({
      roles: value.key,
    });
  }
  handleSubmit = (roleMap,e) => {
    e.preventDefault();
    console.log("en",e);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.state.roles !== ''&& this.state.project !== '' ){
          // if(this.state.showPassword){
          //   console.log("5000",this.state.userId);
          //   apiUpdateAcciunt({
          //     username: values.username,
          //     nickname: values.full_name,
          //     roles: [{roleName:roleMap.get(this.state.roles)}],
          //     phoneNumber: values.phone_number,
          //     email: values.email,
          //     userId: this.state.userId,
          //     status: 1,
          //     projectIds: [1],
          //   }).then(res=>{
          //     if (res.data.status === 200) {
          //       this.setState({
          //         visible: false,
          //       });
          //     }
          //   }).catch(err=>{
          //     message.error(err);
          //   })   
          // }else{
          //   console.log('Received values of form: ', values);
          //   apiCreateAcciunt({
          //     username: values.username,
          //     nickname: values.full_name,
          //     roles: [{roleName:roleMap.get(this.state.roles)}],
          //     phoneNumber: values.phone_number,
          //     email: values.email,
          //     password: values.password,
          //     status: 1,
          //     projectIds: [1],
          //   }).then(res=>{
          //     if (res.data.status === 200) {
          //       this.setState({
          //         visible: false,
          //       });
          //     }
          //   }).catch(err=>{
          //     message.error(err);
          //   })
          // } 
          console.log('wsaccxx=>>>>>>>>');
        }else{
          message.warning('请选择角色和项目！');
        }
      }
    });
  }
  initData(){
    this.setState({
      accountStatus: "",
      power: '',
      username: '',
      project: '',
      roles: '',
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.props.intl.formatMessage({ id: 'reset_passowrd_confirm_password_callbak' }));
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  validateToNextPhone = (e)=>{
    const value = e.target.value
    // let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // let isvalue = mPattern.test(value);
    // this.setState({
    //   isvalue 
    // })
    console.log('rule,value,callback',value);
  }
  validateToNextPhoneNumber =(rule,value, callback)=>{
    let mPattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let isvalue = mPattern.test(value);
    if(isvalue){
      callback();
    }else{
      callback('请输入有效的手机号!');
    }
  }
  handleChange = (targetKeys, direction, moveKeys) => {
    console.log(targetKeys, direction, moveKeys);
    this.setState({ targetKeys });
  }

  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        {item.title} - {item.description}
      </span>
    );
  }
  render() {
    if (this.props.monitor.userList.fetchUserListError) {
      return <div>{this.props.monitor.userList.fetchUserListError.error}</div>;
    }
    console.log('thisissues',this);
    const roleMap = roleConstants(this);
    let { roleList,accountStatus } = roleLists(this);
    const { page, total } = this.props.monitor.issueList;
    const { byId } = this.props.monitor.projectList;
    let issueList = [];
    let project;
    if (byId) {
      for (const key in byId) {
        issueList.unshift(byId[key]);
      }
    }
    if(this.state.projectId === 0){
      project = issueList
    }else{
      project = byId[this.state.projectId];
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="monitor-project">
        <div className="title_Breadcrumb">
          <Breadcrumb>
          <Breadcrumb.Item>{this.props.intl.formatMessage({ id: 'sidePanel_welcome_link' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.intl.formatMessage({ id: 'account_List' })}</Breadcrumb.Item>
        </Breadcrumb>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="table_title">
                <label>
                  <Input placeholder={ this.props.intl.formatMessage({ id: 'account_Name' })}/>
                </label>
              </td>
              <td className="table_title">
                <Select
                  style={{ width: 160 }}
                  value={this.state.power === "" ? this.props.intl.formatMessage({ id: 'account_role' }) : this.state.power}
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
                  value={this.state.accountStatus === "" ? this.props.intl.formatMessage({ id: 'account_status' }) : this.state.accountStatus}
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
                <Button type="primary" icon="search" onClick={this.handleSearch}>
                  <FormattedMessage id="issue_search_label_search" />
                </Button>
              </td>
              <td className="establish">
                  <Button type="primary" icon="user-add" onClick={this.handleEstablish.bind(this)}>
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
        <Modal
          title={ this.props.intl.formatMessage({ id: 'sidePanel_account_link' })}
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
        <Form onSubmit={this.handleSubmit.bind(this, roleMap)} >
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'account_step4_table_username' })}
        >
          {getFieldDecorator('username', {
            rules: [ {
              required: true, message: this.props.intl.formatMessage({ id: 'account_step4_username' }),
            }, {
              validator: this.validateToNextUsername,
            }
          ],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'account_full_name' })}
        >
          {getFieldDecorator('full_name', {
            rules: [{
              required: true, message: this.props.intl.formatMessage({ id: 'account_step4_full_name' }),
            }, {
              validator: this.validateToNextFullname,
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'account_role' })}
        >
            <Select
              value={this.state.roles === '' ? this.props.intl.formatMessage({ id: 'account_role' }) : this.state.roles}
              onChange={this.handleRolesChange}
            >
              {roleList.map(typeMap => (
                <Option key={typeMap.value} value={typeMap.key}>
                  {typeMap.value}
                </Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'sidePanel_project' })}
        >
            <Transfer
              dataSource={this.state.mockData}
              listStyle={{
                width: 300,
                height: 300,
              }}
              targetKeys={this.state.targetKeys}
              onChange={this.handleChange}
              render={this.renderItem}
            />
        </Form.Item>
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'phone_number' })}
        >
          {getFieldDecorator('phone_number', {
            rules: [ {
              required: true, message: this.props.intl.formatMessage({ id: 'account_step4_phonenumber' }),
            },
            {
              validator: this.validateToNextPhoneNumber,
            }
          ],
          })(
            <Input onBlur={this.validateToNextPhone}/>
          )}
        </Form.Item>
        <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'establish_email' })}
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: this.props.intl.formatMessage({ id: 'account_step4_valid_e_mail' }),
            }, {
              required: true, message: this.props.intl.formatMessage({ id: 'account_step4_e_mail' }),
            }],
          })(
            <Input />
          )}
        </Form.Item>
        {
          this.state.showPassword?<div/>:(
            <Form.Item
          labelCol= {{sm:{span: 6},xs: { span: 24 }}}
          wrapperCol={{xs: { span: 24},sm: {span: 16}}}
          label={ this.props.intl.formatMessage({ id: 'reset_password_password_label' })}
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: this.props.intl.formatMessage({ id: 'reset_password_password_message' }),
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>
          )
        }
        {
          this.state.showPassword?<div/>:(
          <Form.Item
            labelCol= {{sm:{span: 6},xs: { span: 24 }}}
            wrapperCol={{xs: { span: 24},sm: {span: 16}}}
            label={ this.props.intl.formatMessage({ id: 'reset_password_confirm_password_title' })}
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: this.props.intl.formatMessage({ id: 'reset_password_confirm_password_message' }),
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </Form.Item>
          )
        }
       
        <Form.Item
          wrapperCol={{xs: { span: 24,offset: 0,},sm: {span: 13,offset:11,}}}
        >
          <Button type="primary" htmlType="submit">{ this.props.intl.formatMessage({ id: 'reset_password_button' })}</Button>
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
