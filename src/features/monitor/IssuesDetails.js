import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Icon, Input, Modal, Breadcrumb, Form, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { URL ,apiIssueDetail,apiFetchCommentList,apiFetchUserInformation} from './axios/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'react-sticky-header/styles.css';
import 'swiper/dist/css/swiper.min.css';
import Utils from './util/ChineseNumber';

const { TabPane } = Tabs;

export class IssuesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlerDetail: {},
      sponsorDetail: {},
      issueDetail: {},
      repliesList:[],
      fetching: false,
      visible: false,
      modalVisible: false,
      index: 0,
      issueId: this.props.match.params.issueId,
      paths: null,
      uris: [],
    };
  }

  componentDidMount() {
    this.fetchReply();
    this.issueDetail();
    this.fetchReplies();
    this.commentList();
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
  commentList() {
    apiFetchCommentList({
      issueId: this.state.issueId,
    }).then(res => {
      this.setState({
        repliesList: res.data.data === null? [] : res.data.data.reverse(),
      });
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.issueDetail !== this.state.issueDetail) {
      this.setState({ fetching: true });
      if (this.state.issueDetail !== null && this.state.issueDetail.sponsorId !== null) {
        let sponsorDetail = await apiFetchUserInformation({
          userId: this.state.issueDetail.sponsorId,
        });
        this.setState({ sponsorDetail: sponsorDetail.data.data });
      }
      if (this.state.issueDetail !== null && this.state.issueDetail.handlerId !== null) {
        let handlerDetail = await apiFetchUserInformation({
          userId: this.state.issueDetail.handlerId,
        });
        this.setState({ handlerDetail: handlerDetail.data.data });
      }
      this.setState({ fetching: false });
    }
  }

  createTitle = comment => {
    if (comment === null || comment.username === null || comment.username === undefined) {
      return '';
    }
    if (
      this.state.repliesList === null ||
      this.state.repliesList === undefined ||
      this.state.repliesList.length === 0
    ) {
      return '';
    }
    if (
      this.state.sponsorDetail === null ||
      this.state.sponsorDetail === {} ||
      this.state.sponsorDetail.username === null ||
      this.state.sponsorDetail.username === undefined
    ) {
      return '';
    }
    if (
      this.state.handlerDetail === null ||
      this.state.handlerDetail === {} ||
      this.state.handlerDetail.username === null ||
      this.state.handlerDetail.username === undefined
    ) {
      return '';
    }
    let comments = this.state.repliesList;
    let feedBackComments = [];
    let replyComments = [];
    let sponserName = this.state.sponsorDetail.username;
    let handlerName = this.state.handlerDetail.username;
    let username = comment.username;
    comments.map((item, index) => {
      if (item.username === handlerName) {
        feedBackComments.push(item);
      } else if (item.username === sponserName) {
        replyComments.push(item);
      }
    });
    let index = -1;
    let prefix = '';
    let indexWord = '';
    if (username === handlerName) {
      index = feedBackComments.indexOf(comment);
      if (index >= 0) {
        index++;
      }
      prefix = this.props.intl.formatMessage({ id: 'issue_repliesList_content_prefix_feedBack' });
      
    }
    if (username === sponserName) {
      index = replyComments.indexOf(comment);
      if (index >= 0) {
        index++;
      }
      prefix = this.props.intl.formatMessage({ id: 'issue_repliesList_content_prefix_reply' });     
    }
    console.log('locale---------', moment.locale());
    if('zh' === this.props.monitor.language) {
      let number = new Number(index);
      indexWord = Utils.numberToChinese(number);
    } else {
      indexWord = index;
    }
    let result = `${prefix} (${indexWord})`;
    return result;
  };

  renderComment = comment => {
    console.log('render comment=11111', comment);
    let nickname = comment === null ? '' : comment.nickname;
    let roleName =
      comment === null ||
      comment.roleVos === null ||
      comment.roleVos === undefined ||
      comment.roleVos.length === 0
        ? ''
        : comment.roleVos[0].roleName;
    let title = this.createTitle(comment);
    let displayRoleName = this.props.intl.formatMessage({id:`character_${roleName}`});
    let subTitle = `${nickname}(${displayRoleName})`;
    let timeline1 = moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')
    let detail =
      comment === null || comment.content === null || comment.content === undefined
        ? ''
        : comment.content;

    let urisStr =
      comment === null || comment.imagePath === null || comment.imagePath === undefined
        ? '[]'
        : comment.imagePath;

    let uris = JSON.parse(urisStr);

    return (
      <div>
        {this.renderCommonHeader(title, subTitle, timeline1)}
        {this.renderContent(detail, uris)}
      </div>
    );
  };

  renderCommonHeader = (title, subTitle, timeline1) => {
    return (
      <div className="content_feedback">
        <div>
          <span className="people">{title}:{subTitle}</span>  
          <span style={{position:'absolute',left:'300px'}}>{timeline1}</span>
        </div>
      </div>
    );
  };

 

  renderContent = (detail, uris) => {
    console.log('uris', JSON.stringify(uris));
    return (
      <div style={{backgroundColor: '#EFEFEF'}}>
        
        <span style={{fontSize:'150%',fontWeight:'600'}}>{detail}</span>
        {Boolean(uris !== undefined && uris !== null && uris.length > 0) && (
          <div style={{ paddingTop: '12px' }}>
            <span className="issue_img">
            {uris.length !== 0 &&
              uris.map((item, index) => {
                let uri = `${URL}${item}`;
                return (
                    <div key={index} className="imgs" onClick={() => {this.setState({ visible: true,paths: uri })}}>
                      <img
                        className="img_item"
                        src={uri}
                      />
                    </div>           
                );
              })}
            </span>
          </div>
        )}
       
      </div>
    );
  };


  renderConfirm = () => {
    let { sponsorDetail, issueDetail } = this.state;
    if (
      issueDetail === null ||
      issueDetail.status === null ||
      issueDetail.status === undefined ||
      issueDetail.status !== 3
    ) {
      return <div />;
    }
    let sponserName = sponsorDetail === null ? '' : sponsorDetail.nickname;
    let roleName =
      sponsorDetail === null ||
      sponsorDetail.roles === null ||
      sponsorDetail.roles === undefined ||
      sponsorDetail.roles.length === 0
        ? ''
        : sponsorDetail.roles[0].roleName;
    let title = this.props.intl.formatMessage({ id: 'issue_repliesList_header_confirm' });
    let displayRoleName = this.props.intl.formatMessage({id:`character_${roleName}`});
    let subTitle = `${sponserName}(${displayRoleName})`;
    let timeline1 = moment(issueDetail.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss')
    let detail = this.props.intl.formatMessage({ id: 'issue_repliesList_content_confirm' });
    return (
      <div>
        {this.renderCommonHeader(title, subTitle, timeline1)}
        {this.renderContent(detail, [])}
      </div>
    );
  };

  renderIssue = () => {
    let { sponsorDetail, issueDetail } = this.state;

    let sponserName = sponsorDetail === null ? '' : sponsorDetail.nickname;
    let roleName =
      sponsorDetail === null ||
      sponsorDetail.roles === null ||
      sponsorDetail.roles === undefined ||
      sponsorDetail.roles.length === 0
        ? ''
        : sponsorDetail.roles[0].roleName;
    let title = this.props.intl.formatMessage({ id: 'issue_repliesList_header_create' });
    let displayRoleName = this.props.intl.formatMessage({id:`character_${roleName}`});
    let subTitle = `${sponserName}(${displayRoleName})`;
    let timeline1 = moment(issueDetail.createTime).format('YYYY-MM-DD HH:mm:ss')
    let detail =
      issueDetail === null ||
      issueDetail.description === null ||
      issueDetail.description === undefined
        ? ''
        : issueDetail.description;
    let urisStr =
      issueDetail === null || issueDetail.imagePath === null || issueDetail.imagePath === undefined
        ? '[]'
        : issueDetail.imagePath;

    let uris = JSON.parse(urisStr);

    return (
      <div>
        {this.renderCommonHeader(title, subTitle, timeline1)}
        {this.renderContent(detail, uris)}
      </div>
    );
  };

  renderTitleBottom = () => {
    let { sponsorDetail, issueDetail } = this.state;
    let roleName =
      sponsorDetail === null ||
      sponsorDetail.roles === null ||
      sponsorDetail.roles === undefined ||
      sponsorDetail.roles.length === 0
        ? ''
        : sponsorDetail.roles[0].roleName;
    return (
      
      <div className="title_Bottom">
        <div className="people">
          {this.props.intl.formatMessage({ id: 'issue_statisticsDetails_founder' })}：{' '}
          {issueDetail.sponsorName}
          ({this.props.intl.formatMessage({id: `character_${roleName}`})})
        </div>
        <div className="time">
          {this.props.intl.formatMessage({ id: 'issue_statisticsDetails_creationTime' })}：{' '}
          {moment(issueDetail.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div>
          {this.props.intl.formatMessage({ id: 'issue_content_modalDropdown2' })}：{' '}
          {issueDetail.handlerName}
          ({this.props.intl.formatMessage({id: 'character_professionalForeman'})})
        </div>
        <div style={{marginLeft:'50px'}}>
            {this.props.intl.formatMessage({ id: 'issue_table_title_status' })}：{' '}
        </div>
          <div>
          {this.handleIssueStatus(issueDetail.status)}
          </div>
      </div>
      
      
    )
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  handleIssueStatus=(status)=> {
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
    let _this = this;
    const issueItem = this.state.issueDetail;
    const CommentItems = this.state.repliesList;
    const feedBackList = this.props.monitor.replyList.byId;
    const repliesList = this.props.monitor.repliesList.byId;
    let status = 0;
    let issueId;
    let issueFeedBackList = [];
    let whoseIusseFeedBack = [];
    let whoseIusseReplies = [];
    let issueImagePath = [];
    let issueRepliesList = [];
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

    const _path = [];
    let CommentPath = [];
    if (CommentItems.imagePath) {
      CommentPath = JSON.parse(CommentItems.imagePath);
      CommentPath.forEach(path => {
        _path.push({ url: `${URL}${path}` });
      });
    }

    if(CommentItems.length !== 0) {
      
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
    let historyIusseFeedBack = [];
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
      //页面渲染部分
      return (
        //header内容
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
          {/* <div>
            {this.handleIssueStatus(issueItem.status)}
          </div> */}
          <div>
          {this.renderTitleBottom()}          
          </div>
          
          <div className="content_Tabs">
            <Tabs defaultActiveKey="1">

              {/* 问题详情Tab */}
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

              {/* 历史反馈记录Tab */}
              <TabPane
                tab={
                  <span>
                    <Icon type="inbox" />
                    {this.props.intl.formatMessage({ id: 'issue_content_historyFeedback' })}
                  </span>
                }
                key="2"
              >
                <div>

                  {this.renderIssue()}

                  {this.state.repliesList.map((item, index) => {
                    return _this.renderComment(item);
                  })} 

                  {this.renderConfirm()} 

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
