import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Icon, Input, Modal, Breadcrumb, Form, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { URL } from './axios/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { apiIssueDetail } from '../monitor/axios/api';
import 'react-sticky-header/styles.css';
import 'swiper/dist/css/swiper.min.css';
const { TabPane } = Tabs;

export class IssuesDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      issueDetail: '',
      visible: false,
      issueId: this.props.match.params.issueId,
      paths: null,
    };
  }

  componentDidMount() {
    this.fetchReply();
    this.issueDetail();
    this.fetchReplies();
  }
  fetchReply() {
    this.props.actions.fetchReplyList({
      issueId: this.state.issueId,
    });
  }
  fetchReplies() {
    this.props.actions.fetchRepliesList({
      issueId: this.state.issueId,
    });
  }
  issueDetail() {
    apiIssueDetail({
      issueId: this.state.issueId,
    }).then(res => {
      this.setState({
        issueDetail: res.data.data,
      });
    });
  }
  componentDidUpdate(prevProps, prevStatus) {
    if (prevProps.match.params.issueId !== this.props.match.params.issueId) {
      this.fetchReply();
      this.issueDetail();
      this.fetchReplies();
    }
  }

  handleOnClick(paths) {
    this.setState({
      visible: true,
      paths: paths,
    });
  }
  handleOk() {
    this.setState({
      visible: false,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  handleIssueStatus(status) {
    if (status === 1) {
      return (
        <div className="status">
          {this.props.intl.formatMessage({ id: 'issue_content_status_wait_feed_back' })}
        </div>
      );
    } else if (status === 2) {
      return (
        <div className="status status1">
          {this.props.intl.formatMessage({ id: 'issue_content_status_wait_confirm' })}
        </div>
      );
    } else {
      return (
        <div className="status status2">
          {this.props.intl.formatMessage({ id: 'issue_content_status_confirm' })}
        </div>
      );
    }
  }
  handlefeedbackStatus(status) {
    if (status === 2) {
      return (
        <div className="status">
          {this.props.intl.formatMessage({ id: 'issue_content_status_wait_confirm' })}
        </div>
      );
    } else if (status === 3) {
      return (
        <div className="status status2">
          {this.props.intl.formatMessage({ id: 'issue_content_status_confirm' })}
        </div>
      );
    }
  }
  handleNoData() {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', height: '240px' }}>
          <div className="dataImg" />
        </div>
        <div>{this.props.intl.formatMessage({ id: 'issue_content_noData' })}</div>
      </div>
    );
  }
  handleNoImg() {
    return (
      <div>
        <div style={{ position: 'relative', height: '260px' }}>
          <div className="noimg" />
        </div>
      </div>
    );
  }
  render() {
    const issueItem = this.state.issueDetail;
    const feedBackList = this.props.monitor.replyList.byId;
    const repliesList = this.props.monitor.repliesList.byId;
    let status = 0;
    let issueId;
    let issueFeedBackList = [];
    let whoseIusseFeedBack = [];
    let whoseIusseReplies = [];
    let issueImagePath = [];
    let issueRepliesList = [];
    let historyIusseFeedBack = [];
    let createTime = '';
    if (issueItem.createTime) {
      status = issueItem.status;
      issueId = issueItem.id;
      let time = issueItem.createTime;
      let stillUtc = moment.utc(time).toDate();
      createTime = moment(stillUtc)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
    }

    const paths = [];
    if (issueItem.imagePath) {
      issueImagePath = JSON.parse(issueItem.imagePath);
      issueImagePath.forEach(path => {
        paths.push({ url: `${URL}${path}` });
      });
    }
    if (feedBackList) {
      for (const key in feedBackList) {
        issueFeedBackList.unshift(feedBackList[key]);
      }

      whoseIusseFeedBack = issueFeedBackList.filter(item => {
        return item.issueId === issueId;
      });

      if (whoseIusseFeedBack.length !== 0) {
        whoseIusseFeedBack = whoseIusseFeedBack.map((item, i) => {
          let imagePath = [];
          let JsonImagePath = [];
          item.createTime = moment(item.createTime)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
          if (typeof item.imagePath === 'string') {
            JsonImagePath = JSON.parse(item.imagePath);
            JsonImagePath.forEach(path => {
              imagePath.push({ url: `${URL}${path}` });
            });
            item.imagePath = imagePath;
          }
          return item;
        });
      }
    }
    if (repliesList) {
      for (const key in repliesList) {
        issueRepliesList.unshift(repliesList[key]);
      }
      whoseIusseReplies = issueRepliesList.filter(item => {
        return item.issueId === issueId;
      });
    }
    let length;
    if (whoseIusseFeedBack.length === 0 && whoseIusseReplies.length === 0) {
      length = null;
    } else {
      length = whoseIusseFeedBack.length - whoseIusseReplies.length;
    }
    if ((status === 2 && length === 1) || status === 3) {
      let copy = JSON.parse(JSON.stringify(whoseIusseFeedBack));
      historyIusseFeedBack = copy.splice(1);
    } else if (status === 1 && length === 0) {
      historyIusseFeedBack = whoseIusseFeedBack;
    }

    if (
      this.props.monitor.issueList.fetchIssueListPending !== false ||
      this.props.monitor.repliesList.fetchRepliesListPending !== false ||
      this.props.monitor.replyList.fetchReplyListPending !== false
    ) {
      return <Spin size="large" />;
    } else {
      return (
        <div>
          <div className="title_Breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/monitor/issuesList/1">
                  {this.props.intl.formatMessage({ id: 'issue_content_h1' })}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {this.props.intl.formatMessage({ id: 'issue_content_issuesDetails' })}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div>
            <div className="title_Title">
              <h2 className="title">{issueItem.name}</h2>
              {this.handleIssueStatus(issueItem.status)}
            </div>

            <div className="title_Bottom">
              <div className="people">
                {this.props.intl.formatMessage({ id: 'issue_statisticsDetails_founder' })}：{' '}
                {issueItem.sponsorName}
              </div>
              <div className="time">
                {this.props.intl.formatMessage({ id: 'issue_statisticsDetails_creationTime' })}：{' '}
                {createTime}
              </div>
              <div>
                {this.props.intl.formatMessage({ id: 'issue_content_modalDropdown2' })}：{' '}
                {issueItem.handlerName}
              </div>
            </div>
          </div>

          <div className="content_Tabs">
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <Icon type="align-left" />
                    {this.props.intl.formatMessage({ id: 'issue_content_Details' })}
                  </span>
                }
                key="1"
              >
                <div>
                  <Form
                    labelCol={{ sm: { span: 8 }, xs: { span: 24 } }}
                    wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
                  >
                    <Form.Item
                      labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
                      wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
                      label={this.props.intl.formatMessage({ id: 'sidePanel_projectBelongs' })}
                    >
                      <Input
                        disabled={true}
                        className="content_input"
                        value={issueItem.projectName}
                      />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
                      wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
                      label={this.props.intl.formatMessage({ id: 'issue_table_title_description' })}
                    >
                      <div style={{ paddingTop: '12px' }}>
                        <div className="issue_img">
                          {paths.length === 0
                            ? this.handleNoImg()
                            : paths.map((item, i) => {
                                return (
                                  <div>
                                    <div
                                      key={i}
                                      className="imgs"
                                      onClick={() => {
                                        this.setState({
                                          visible: true,
                                          paths: item.url,
                                        });
                                      }}
                                    >
                                      <img className="img_item" alt="example" src={item.url} />
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                        <div className="issue_description">
                          <span>{issueItem.description}</span>
                        </div>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="notification" />
                    {this.props.intl.formatMessage({ id: 'issue_content_issueFeedback' })}
                  </span>
                }
                key="2"
              >
                {(whoseIusseFeedBack.length === 1 && whoseIusseReplies.length === 0) ||
                (status === 2 && length === 1) ||
                (status === 3 && whoseIusseFeedBack.length > 0) ? (
                  <div>
                    <div className="content_feedback">
                      <div className="time">
                        {this.props.intl.formatMessage({
                          id: 'issue_statisticsDetails_creationTime',
                        })}
                        :{whoseIusseFeedBack[0].createTime}
                      </div>
                      <div className="people">
                        {this.props.intl.formatMessage({
                          id: 'issue_statisticsDetails_feedbackStaff',
                        })}
                        ： {whoseIusseFeedBack[0].nickname}
                      </div>
                      <div className="feedback_status">
                        <div>
                          {this.props.intl.formatMessage({
                            id: 'issue_statisticsDetails_feedbackStatus',
                          })}
                          ：
                        </div>
                        {this.handlefeedbackStatus(issueItem.status)}
                      </div>
                    </div>
                    <Form>
                      <Form.Item
                        labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
                        wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
                        label={this.props.intl.formatMessage({
                          id: 'issue_table_title_description',
                        })}
                      >
                        <div style={{ paddingTop: '12px' }}>
                          <div className="issue_img">
                            {whoseIusseFeedBack[0].imagePath.length === 0
                              ? this.handleNoImg()
                              : whoseIusseFeedBack[0].imagePath.map((item, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="imgs"
                                      onClick={() => {
                                        this.setState({
                                          visible: true,
                                          paths: item.url,
                                        });
                                      }}
                                    >
                                      <img alt="example" src={item.url} className="img_item" />
                                    </div>
                                  );
                                })}
                          </div>
                          <div className="issue_description">
                            <span>{whoseIusseFeedBack[0].content}</span>
                          </div>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                ) : (
                  this.handleNoData()
                )}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="inbox" />
                    {this.props.intl.formatMessage({ id: 'issue_content_historyFeedback' })}
                  </span>
                }
                key="3"
              >
                <div className="minHeight">
                  {(whoseIusseFeedBack.length === 1 && whoseIusseReplies.length === 1) ||
                  (status === 1 && length === 0) ||
                  status === 3
                    ? historyIusseFeedBack.length !== 0
                      ? historyIusseFeedBack.map((items, i) => {
                          return (
                            <div key={i}>
                              <div className="content_feedback">
                                <div className="time">
                                  {this.props.intl.formatMessage({
                                    id: 'issue_statisticsDetails_creationTime',
                                  })}
                                  ：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {items.createTime}
                                </div>
                                <div className="people">
                                  {this.props.intl.formatMessage({
                                    id: 'issue_statisticsDetails_feedbackStaff',
                                  })}
                                  ： {items.nickname}
                                </div>
                                <div className="feedback_status">
                                  <div>
                                    {this.props.intl.formatMessage({
                                      id: 'issue_statisticsDetails_feedbackStatus',
                                    })}
                                    ：
                                  </div>
                                  <div className="status notpass">
                                    {this.props.intl.formatMessage({
                                      id: 'issue_statisticsDetails_notPass',
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Form>
                                <Form.Item
                                  labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
                                  wrapperCol={{ xs: { span: 24 }, sm: { span: 21 } }}
                                  label={this.props.intl.formatMessage({
                                    id: 'issue_table_title_description',
                                  })}
                                >
                                  <div style={{ paddingTop: '12px' }}>
                                    <div className="issue_img">
                                      {items.imagePath.length === 0
                                        ? this.handleNoImg()
                                        : items.imagePath.map((item, index) => {
                                            return (
                                              <div
                                                key={index}
                                                className="imgs"
                                                onClick={() => {
                                                  console.log(item);
                                                  console.log('yuyuyuyuy');
                                                  this.setState({
                                                    visible: true,
                                                    paths: item.url,
                                                  });
                                                }}
                                              >
                                                <img
                                                  className="img_item"
                                                  alt="example"
                                                  src={item.url}
                                                />
                                              </div>
                                            );
                                          })}
                                    </div>
                                    <div className="issue_description">
                                      <span>{items.content}</span>
                                    </div>
                                  </div>
                                </Form.Item>
                                <Form.Item
                                  labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
                                  wrapperCol={{ xs: { span: 24 }, sm: { span: 21 } }}
                                  label={this.props.intl.formatMessage({
                                    id: 'issue_content_cause',
                                  })}
                                >
                                  <div style={{ color: 'red' }}>
                                    {whoseIusseReplies[i].content ? (
                                      whoseIusseReplies[i].content
                                    ) : (
                                      <div />
                                    )}
                                  </div>
                                </Form.Item>
                              </Form>
                            </div>
                          );
                        })
                      : this.handleNoData()
                    : this.handleNoData()}
                </div>
              </TabPane>
            </Tabs>
          </div>
          <Modal
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleCancel.bind(this)}
            className="modal"
          >
            <img style={{ width: '472px' }} alt="example" src={this.state.paths} />
          </Modal>
        </div>
      );
    }
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
)(injectIntl(IssuesDetails));
