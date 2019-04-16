import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {
  apiEditProject,
  apiEnableProject,
  apiDisbleProject,
  apiCheckIfExist,
  apiFetchProject,
} from './axios/api';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Pagination,
  Table,
  Icon,
  message,
  Breadcrumb,
  InputNumber,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { loadProjectListPageSize, saveProjectListPageSize } from '../../common/sessionStorage';

const getItems = monitor => monitor.searchProjectList.items;
const getById = monitor => monitor.searchProjectList.byId;
const dataSourceSelector = createSelector(
  getItems,
  getById,
  (items, byId) => {
    if (!items) return [];
    return items.map(id => byId[id]);
  },
);
export class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      visible: false,
      name: '',
      startTime: '',
      endTime: '',
      editIsVisible: false,
      pageSize: loadProjectListPageSize(),
      currentData: null,
      submitIsable: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  success = info => {
    message.success(info);
  };

  error = info => {
    message.error(info);
  };

  resetForm() {
    this.props.form.resetFields();
  }
  _handleVisible = () => {
    this.setState({
      visible: true,
    });
  };
  _handleEditVisible = id => {
    apiFetchProject({ projectId: id }).then(res => {
      this.setState({
        editIsVisible: true,
        currentData: res.data.data,
      });
    });
  };
  _handleDisableProject = id => {
    apiDisbleProject({ projectId: id }).then(res => {
      if (res.data.status === 200) {
        const page = this.props.match.params.page || '1';
        this.fetchData(page);
      }
    });
  };

  _handleEnableProject = id => {
    apiEnableProject({ projectId: id }).then(res => {
      if (res.data.status === 200) {
        const page = this.props.match.params.page || '1';
        this.fetchData(page);
      }
    });
  };

  _handleHidden = () => {
    this.setState({
      visible: false,
    });
  };
  _handleEditHidden = () => {
    this.setState({
      editIsVisible: false,
    });
  };
  handleSubmit(evt) {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const timeArray = values.time;
      let args = _.omit(values, 'time');
      const startTime = timeArray[0];
      const endTime = timeArray[1];
      console.log('yuyuyuyuyuuuyu');
      console.log(args);
      this.props.actions
        .createProject({ ...args, startTime: startTime, endTime: endTime })
        .then(res => {
          if (res.data.status === 200) {
            this._handleHidden();
            this.searchProjects();
            this.success(this.props.intl.formatMessage({ id: 'project_creation_success_message' }));
          } else {
            this.error(this.props.intl.formatMessage({ id: 'project_creation_error_message' }));
          }
        });
    });
  }
  handleEditSubmit = evt => {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const timeArray = values.time;
      let args = _.omit(values, 'time');
      const startTime = timeArray[0];
      const endTime = timeArray[1];
      apiEditProject({
        ...args,
        startTime: startTime,
        endTime: endTime,
        id: this.state.currentData.id,
      }).then(res => {
        if (res.data.status === 200) {
          this.success(this.props.intl.formatMessage({ id: 'project_edit_success_message' }));
          this._handleEditHidden();
        } else {
          this.error(this.props.intl.formatMessage({ id: 'project_edit_error_message' }));
        }
      });
    });
  };
  searchProjects = () => {
    const page = this.props.match.params.page || '1';
    this.fetchData(page);
  };

  getDataSource = dataSourceSelector;

  componentDidMount() {
    const page = this.props.match.params.page || '1';
    if (
      page !== this.props.monitor.searchProjectList.page ||
      !this.getDataSource(
        this.props.monitor.searchProjectList,
        this.props.monitor.searchProjectList.byId,
      ).length ||
      this.props.monitor.searchProjectList.listNeedReload
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
      !this.props.monitor.searchProjectList.fetchProjectListPending
    ) {
      this.fetchData(page);
    }
  }

  handlePageChange = newPage => {
    this.props.history.push(`/monitor/projects/${newPage}`);
  };
  startTimeOnChange = (date, dateString) => {
    this.setState({
      startTime: dateString,
    });
  };
  endTimeOnChange = (date, dateString) => {
    this.setState({
      endTime: dateString,
    });
  };
  fetchData(page) {
    this.props.actions.fetchSeachProjectList({
      page: page,
      pageSize: this.state.pageSize,
      projectName: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });
  }

  verifiedCreateProjectName = () => {
    apiCheckIfExist({ projectName: this.props.form.getFieldValue('createProjectName') }).then(
      res => {
        if (res.data.data) {
          this.success(
            this.props.intl.formatMessage({ id: 'project_verfiedProjectName_success_message' }),
          );
          this.setState({
            submitIsable: true,
          });
        } else {
          this.setState({
            submitIsable: false,
          });
        }
      },
    );
  };

  resetSearch = () => {
    this.setState({
      name: '',
    });
    this.fetchData(this.props.match.params.page || '1');
  };

  handleSizeChange = (current, pageSize) => {
    this.setState({ ...this.state, pageSize: pageSize, page: current });

    saveProjectListPageSize(pageSize);
    this.props.actions.fetchSeachProjectList({
      page: current,
      pageSize: pageSize,
      projectName: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });
    this.forceUpdate();
  };
  _onchange = e => {
    this.setState({ name: e.target.value });
  };

  getColumns() {
    const columns = [
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          const path = `/monitor/project/${record.id}/issues/1`;
          return (
            <div className="color">
              <Link to={path}>{record.name}</Link>
            </div>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_duration' }),
        dataIndex: '',
        key: 'duration',
        align: 'center',
        render: record => {
          const stillUtc = moment.utc(record.startTime).toDate();
          const local = moment(stillUtc)
            .local()
            .format('YYYY-MM-DD');

          const stillUtc2 = moment.utc(record.endTime).toDate();
          const local2 = moment(stillUtc2)
            .local()
            .format('YYYY-MM-DD');
          return (
            <span>
              {local} ~ {local2}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_designUnit' }),
        dataIndex: 'designUnit',
        key: 'designUnit',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_monitorUnit' }),
        dataIndex: 'monitorUnit',
        key: 'monitorUnit',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_constructionUnit' }),
        dataIndex: 'constructionUnit',
        key: 'constructionUnit',
        align: 'center',
      },
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_status' }),
        dataIndex: '',
        key: 'status',
        align: 'center',
        render: record => {
          return record.complete == 1 ? (
            <span style={{ color: 'green' }}>
              <FormattedMessage id="projects_table_title_status_construction" />
            </span>
          ) : (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="projects_table_title_status_completion" />
            </span>
          );
        },
      },
    ];
    const loginData = this.props.monitor.loginData;
    if (loginData && loginData.roles) {
      loginData.roles.map(item => {
        if ('admin' === item.roleName) {
          columns.push({
            title: this.props.intl.formatMessage({ id: 'projects_table_title_operator' }),
            dataIndex: 'operatort',
            key: 'operator',
            render: (text, record) => {
              return (
                <div>
                  <div className="color" onClick={this._handleEditVisible.bind(this, record.id)}>
                    <FormattedMessage id="projects_table_title_edit" />
                  </div>
                </div>
              );
            },
          });
        }
      });
    }
    return columns;
  }

  render() {
    const currentData = this.state.currentData;
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const RangePicker = DatePicker.RangePicker;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2, offset: 3 },
        sm: { span: 4, offset: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: this.props.intl.formatMessage({
            id: 'project_creation_label_range_time_validation_message',
          }),
        },
      ],
    };
    let local1 = null;
    let local2 = null;
    if (currentData !== null) {
      const stillUtc1 = moment.utc(currentData.startTime).toDate();
      local1 = moment(stillUtc1).local();
      const stillUtc2 = moment.utc(currentData.endTime).toDate();
      local2 = moment(stillUtc2).local();
    }
    const { page, total, pageSize } = this.props.monitor.searchProjectList;
    const loginData = this.props.monitor.loginData;
    let showCreateLabel = false;
    if (loginData && loginData.roles) {
      loginData.roles.map(item => {
        if ('admin' === item.roleName) {
          showCreateLabel = true;
        }
      });
    }
    return (
      <div className="monitor-projects">
        <div className="projects-new-container">
          <span className="projects-new-left">
            <Breadcrumb className="title_Breadcrumb">
              <Breadcrumb.Item>
                {this.props.intl.formatMessage({ id: 'sidePanel_welcome_link' })}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {this.props.intl.formatMessage({ id: 'projects_table_title_list' })}
              </Breadcrumb.Item>
            </Breadcrumb>
          </span>

          {Boolean(showCreateLabel) && (
            <span className="projects-new-right" onClick={this._handleVisible}>
              <Icon type="plus" className="projects-new-right-img" />
              <span className="projects-new-right-text">
                <FormattedMessage id="projects_table_title_new" />
              </span>
            </span>
          )}
        </div>
        <div className="projects-search-container">
          <Input
            placeholder={this.props.intl.formatMessage({ id: 'projects_table_title_name' })}
            onChange={this._onchange}
            value={this.state.name}
            className="projects-new-name-search"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button icon="search" onClick={this.searchProjects}>
            <FormattedMessage id="projects_table_title_search" />
          </Button>
          &nbsp; &nbsp;
          <Button onClick={this.resetSearch}>
            <FormattedMessage id="project_creation_button_reset" />
          </Button>
        </div>
        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns()}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.projectList.fetchProjectListPending}
          scroll={{ x: true }}
        />
        <div className="projects_title_pagination">
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
        {this.state.visible && (
          <div className="projects_new_container">
            <div className="projects_new_mask" onClick={this._handleHidden} />
            <div className="projects_new_content">
              <div className="projects_new_header">
                <span className="projects_new_header_text">
                  <FormattedMessage id="projects_table_title_new" />
                </span>

                <Icon
                  type="close"
                  className="projects_new_header_icon"
                  onClick={this._handleHidden}
                />
              </div>
              <Form
                labelAlign="left"
                layout="horizontal"
                hideRequiredMark={true}
                onSubmit={this.handleSubmit}
              >
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_name' })}
                >
                  {getFieldDecorator('createProjectName', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input onBlur={this.verifiedCreateProjectName} />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_cost' })}
                >
                  {getFieldDecorator('cost', {
                    rules: [
                      {
                        pattern: new RegExp(/^[1-9]{1}[0-9]{0,19}$/, 'g'),
                        required: true,
                        message: this.props.intl.formatMessage({
                          id: 'projects_table_title_amount',
                        }),
                      },
                    ],
                  })(<InputNumber />)}
                  <FormattedMessage id="projects_table_title_amount_unit" />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_range_time' })}
                >
                  {getFieldDecorator('time', rangeConfig)(
                    <RangePicker format={'YYYY-MM-DD'} showTime />,
                  )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_location' })}
                >
                  {getFieldDecorator('location', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_design_unit',
                  })}
                >
                  {getFieldDecorator('designUnit', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_monitor_unit',
                  })}
                >
                  {getFieldDecorator('monitorUnit', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_construction_unit',
                  })}
                >
                  {getFieldDecorator('constructionUnit', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_overview' })}
                  className="projects_new_header_overview"
                >
                  {getFieldDecorator('overview', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 200,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_textareamessage',
                        }),
                      },
                    ],
                  })(<TextArea rows={3} />)}
                </Form.Item>
                <div className="projects_new_buttonGroup">
                  <Button
                    htmlType="submit"
                    className="projects_new_submit"
                    disabled={this.state.submitIsable}
                  >
                    <FormattedMessage id="project_creation_button_submit" />
                  </Button>
                  &nbsp; &nbsp;
                  <Button onClick={this.resetForm}>
                    <FormattedMessage id="project_creation_button_reset" />
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
        {this.state.editIsVisible && (
          <div className="project_new_container">
            <div className="projects_new_mask" onClick={this._handleEditHidden} />
            <div className="projects_new_content">
              <div className="projects_new_header">
                <span className="projects_new_header_text">
                  <FormattedMessage id="projects_table_title_edit_project" />
                </span>

                <Icon
                  type="close"
                  className="projects_new_header_icon"
                  onClick={this._handleEditHidden}
                />
              </div>
              <Form
                labelAlign="left"
                layout="horizontal"
                hideRequiredMark={true}
                onSubmit={this.handleEditSubmit}
              >
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_name' })}
                >
                  {getFieldDecorator('name', {
                    initialValue: currentData.name || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_cost' })}
                >
                  {getFieldDecorator('cost', {
                    initialValue: currentData.cost || null,
                    rules: [
                      {
                        pattern: new RegExp(/^[1-9]{1}[0-9]{0,19}$/, 'g'),
                        required: true,
                        message: this.props.intl.formatMessage({
                          id: 'projects_table_title_amount',
                        }),
                      },
                    ],
                  })(<InputNumber />)}
                  <FormattedMessage id="projects_table_title_amount_unit" />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_range_time' })}
                >
                  {getFieldDecorator('time', {
                    initialValue: [moment(local1, 'YYYY-MM-DD'), moment(local2, 'YYYY-MM-DD')],
                    rules: [
                      {
                        type: 'array',
                        required: true,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_range_time_validation_message',
                        }),
                      },
                    ],
                  })(<RangePicker format={'YYYY-MM-DD'} showTime />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_location' })}
                >
                  {getFieldDecorator('location', {
                    initialValue: currentData.location || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_design_unit',
                  })}
                >
                  {getFieldDecorator('designUnit', {
                    initialValue: currentData.designUnit || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_monitor_unit',
                  })}
                >
                  {getFieldDecorator('monitorUnit', {
                    initialValue: currentData.monitorUnit || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({
                    id: 'project_creation_label_construction_unit',
                  })}
                >
                  {getFieldDecorator('constructionUnit', {
                    initialValue: currentData.constructionUnit || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 50,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_overview' })}
                  className="projects_new_header_overview"
                >
                  {getFieldDecorator('overview', {
                    initialValue: currentData.overview || '',
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 200,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_textareamessage',
                        }),
                      },
                    ],
                  })(<TextArea rows={3} />)}
                </Form.Item>
                <div className="projects_new_buttonGroup">
                  {currentData && currentData.complete === 1 ? (
                    <Button
                      className="projects_new_submit"
                      onClick={this._handleDisableProject.bind(this, currentData.id)}
                    >
                      <FormattedMessage id="projects_table_title_disable" />
                    </Button>
                  ) : (
                    <Button
                      className="projects_new_submit"
                      onClick={this._handleEnableProject.bind(this, currentData.id)}
                    >
                      <FormattedMessage id="projects_table_title_enable" />
                    </Button>
                  )}

                  <Button htmlType="submit" className="projects_new_submit">
                    <FormattedMessage id="projects_table_title_submit" />
                  </Button>
                </div>
              </Form>
            </div>
          </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(injectIntl(Projects)));
