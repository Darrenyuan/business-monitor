import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { apiEditProject } from './axios/api';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Alert,
  Pagination,
  Table,
  Icon,
  message,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { apiFetchProject } from './axios/api';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { loadProjectListPageSize, saveProjectListPageSize } from '../../common/sessionStorage';
import Lightbox from 'react-images';

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
    };
    // const query_params = new URLSearchParams(this.props.location.search);
    // const pagesize = query_params.get('pagesize');
    // console.log(this.state.pageSize,pagesize);
    // console.log('iiiiiiiiiiiiiii')

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
      console.log('kkkkkkkkkkkkkkkkkkk');
      console.log(this.state.currentData);
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
      this.props.actions
        .createProject({ ...args, startTime: startTime, endTime: endTime })
        .then(res => {
          if (res.data.status === 200) {
            this.success(this.props.intl.formatMessage({ id: 'project_creation_success_message' }));
            this._handleHidden();
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
      console.log('oooooooooooooo');
      console.log(startTime, endTime);
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
    return [
      {
        title: this.props.intl.formatMessage({ id: 'projects_table_title_name' }),
        dataIndex: 'name',
        key: 'name',
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
        title: this.props.intl.formatMessage({ id: 'projects_table_title_operator' }),
        dataIndex: 'operatort',
        key: 'operator',
        render: (text, record) => {
          return (
            <div className="color" onClick={this._handleEditVisible.bind(this, record.id)}>
              <FormattedMessage id="projects_table_title_edit" />
            </div>
          );
        },
      },
    ];
  }

  render() {
    const currentData = this.state.currentData;
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const RangePicker = DatePicker.RangePicker;
    // const createProjectSuccessMessage = this.props.intl.formatMessage({
    //   id: 'project_creation_success_message',
    // });
    // const createProjectSuccessDescription = this.props.intl.formatMessage({
    //   id: 'project_creation_success_description',
    // });
    // const createProjectErrorMessage = this.props.intl.formatMessage({
    //   id: 'project_creation_error_message',
    // });
    // const createProjectErrorDescription = this.props.intl.formatMessage({
    //   id: 'project_creation_error_description',
    // });

    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 20,
    //       offset: 4,
    //     },
    //     sm: {
    //       span: 16,
    //       offset: 2,
    //     },
    //   },
    // };
    // if (currentData !== null) {
    //   const stillUtc1 = moment.utc(currentData.startTime).toDate();
    //   const local1 =
    //     moment(stillUtc1)
    //       .local()
    //       .format('YYYY-MM-DD') || null;
    //   const stillUtc2 = moment.utc(currentData.endTime).toDate();
    //   const local2 =
    //     moment(stillUtc2)
    //       .local()
    //       .format('YYYY-MM-DD') || null;
    // }
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
      const stillUtc2 = moment.utc(currentData.startTime).toDate();
      local2 = moment(stillUtc2).local();
    }
    const { page, total, pageSize } = this.props.monitor.searchProjectList;
    return (
      <div className="monitor-projects">
        <div className="projects-new-container">
          <span className="projects-new-left">
            <FormattedMessage id="projects_table_title_list" />
          </span>
          <span className="projects-new-right" onClick={this._handleVisible}>
            <Icon type="plus" className="projects-new-right-img" />
            <span className="projects-new-right-text">
              <FormattedMessage id="projects_table_title_new" />
            </span>
          </span>
        </div>
        <div className="projects-search-container">
          <Input
            placeholder={this.props.intl.formatMessage({ id: 'projects_table_title_name' })}
            onChange={this._onchange}
            className="projects-new-name-search"
          />

          <DatePicker
            placeholder={this.props.intl.formatMessage({ id: 'projects_table_title_start_time' })}
            onChange={(date, dateString) => {
              this.setState({
                startTime: dateString,
              });
            }}
          />
          <DatePicker
            placeholder={this.props.intl.formatMessage({ id: 'projects_table_title_end_time' })}
            onChange={(date, dateString) => {
              this.setState({
                endTime: dateString,
              });
            }}
          />

          <Button icon="search" onClick={this.searchProjects}>
            <FormattedMessage id="projects_table_title_search" />
          </Button>
        </div>
        <Table
          dataSource={this.getDataSource(this.props.monitor)}
          columns={this.getColumns()}
          rowKey="id"
          pagination={false}
          loading={this.props.monitor.projectList.fetchProjectListPending}
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
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: 200,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_message',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_cost' })}
                >
                  {getFieldDecorator('cost', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={1} style={{ float: 'left' }} max={100000000000} />)}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={this.props.intl.formatMessage({ id: 'project_creation_label_range_time' })}
                >
                  {getFieldDecorator('time', rangeConfig)(
                    <RangePicker style={{ float: 'left' }} showTime />,
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
                        max: 200,
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
                        max: 200,
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
                        max: 200,
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
                        max: 200,
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
                        max: 2000,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_textareamessage',
                        }),
                      },
                    ],
                  })(<TextArea rows={3} />)}
                </Form.Item>
                <div className="projects_new_buttonGroup">
                  <Button type="primary" htmlType="submit" className="projects_new_submit">
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
          <div className="projects_new_container">
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
                        max: 200,
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
                        required: true,
                      },
                    ],
                  })(<InputNumber min={1} style={{ float: 'left' }} max={100000000000} />)}
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
                        max: 200,
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
                        max: 200,
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
                        max: 200,
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
                        max: 200,
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
                        max: 2000,
                        message: this.props.intl.formatMessage({
                          id: 'project_creation_label_validation_textareamessage',
                        }),
                      },
                    ],
                  })(<TextArea rows={3} />)}
                </Form.Item>
                <div className="projects_new_buttonGroup">
                  <Button type="primary" htmlType="submit" className="projects_new_submit">
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
