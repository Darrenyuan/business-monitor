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

const { TabPane } = Tabs;

export class IssueDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlerDetail: {},
      sponsorDetail: {},
      issueDetail: {},
      repliesList: [],
      fetching: false,
      uris: [],
      index: 0,
      modalVisible: false,
      //issueId: this.props.match.params.id,
    };
  }
  
  async componentDidMount() {
    this.setState({ fetching: true });
    let resDetail = await apiIssueDetail({
      issueId: this.props.match.params.issueId,
    });
    let resComments = await apiFetchCommentList({
      issueId: this.props.match.params.issueId,
    });
    this.setState({
      issueDetail: resDetail.data.data,
      repliesList: resComments.data.data === null ? [] : resComments.data.data.reverse(),
      fetching: false,
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
    let timeStr =
      issueDetail === null ||
      issueDetail.createTime === null ||
      issueDetail.createTime === undefined
        ? Date().toString()
        : issueDetail.createTime;
    let timeline1 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('YYYY-MM-DD');
    let timeline2 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('HH:mm:ss');
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
        {this.renderCommonHeader(title, subTitle, timeline1, timeline2)}
        {this.renderContent(detail, uris)}
      </div>
    );
  };

  renderCommonHeader = (title, subTitle, timeline1, timeline2) => {
    return (
      <div>
        <div>
          <span >{title}</span>
          <span >{subTitle}</span>
        </div>
        <div>
          <span>{timeline1}</span>
          <span>{timeline2}</span>
        </div>
      </div>
    );
  };

  showImageView = (uris, index) => {
    let all = [];
    uris.map(uri => all.push({ url: `${URL}${uri}` }));
    this.setState({
      uris: all,
      index: index,
      modalVisible: true,
    });
  };

  handleModelHidden = () => {
    this.setState({ modalVisible: false, uris: [], index: 0 });
  };

  renderContent = (detail, uris) => {
    console.log('uris', JSON.stringify(uris));
    return (
      <div>
        <span>{detail}</span>
        {Boolean(uris !== undefined) && (
          <div style={{ paddingTop: '12px' }}>
            <span className="issue_img">
            {uris.length !== 0 &&
              uris.map((item, index) => {
                let uri = `${URL}${item}`;
                return (
                    <div key={index} className="imgs">
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
    if ('zh' == moment.locale()) {
      indexWord = index.toLocaleString('zh-Hans-CN-u-nu-hanidec');
    }
    console.log('indexword=', indexWord);
    let result = `${prefix} (${indexWord})`;
    return result;
  };

  renderComment = comment => {
    console.log('render comment=', JSON.stringify(comment));
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
    let timeStr =
      comment === null || comment.createTime === null || comment.createTime === undefined
        ? Date().toString()
        : comment.createTime;
    let timeline1 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('YYYY/MM/DD');
    let timeline2 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('HH:mm:ss');
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
        {this.renderCommonHeader(title, subTitle, timeline1, timeline2)}
        {this.renderContent(detail, uris)}
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
    let timeStr =
      issueDetail === null ||
      issueDetail.lastUpdateTime === null ||
      issueDetail.lastUpdateTime === undefined
        ? Date().toString()
        : issueDetail.lastUpdateTime;
    let timeline1 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('YYYY/MM/DD');
    let timeline2 = moment(moment.utc(timeStr).toDate())
      .local()
      .format('HH:mm:ss');
    let detail = this.props.intl.formatMessage({ id: 'issue_repliesList_content_confirm' });
    
    return (
      <div>
        {this.renderCommonHeader(title, subTitle, timeline1, timeline2)}
        {this.renderContent(detail, [])}
      </div>
    );
  };

  renderBreadcrumb = () => {
    return (
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
    )
  }

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
      </div>
    )
  }

  renderIssueDetail = () => {
    let { issueDetail } = this.state;
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
              value={issueDetail.projectName}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ sm: { span: 2 }, xs: { span: 24 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
            label={this.props.intl.formatMessage({ id: 'issue_table_title_description' })}
          >
            {this.renderContent(detail, uris)}
          </Form.Item> 
        </Form>
      </div>
    )
  }

  renderReplies = () => {
    let _this = this;
    return (   
      <div>
        {this.renderBreadcrumb()}
        {this.renderTitleBottom()}
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
              {this.renderIssueDetail}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <Icon type="inbox" />
                  {this.props.intl.formatMessage({ id: 'issue_content_historyFeedback' })}
                </span>
              }
              key="2"
            >
              {this.renderIssue()}
              {this.state.repliesList.map((item, index) => {
                return _this.renderComment(item);
              })}
              {this.renderConfirm()}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  };

  renderModal = () => {
    return (
      <div>
        <Modal
          visible={this.state.modalVisible}
          footer={null}
          className="modal"
          onCancel={this.handleModelHidden}
        >
          <img
            style={{ width: '472px' }}
            src={this.state.uris}
            index={this.state.index}
            onClick={this.handleModelHidden}
          />
        </Modal>
      </div>
    );
  };

  render() {
    let _this = this;
    if (this.state.sponsorDetail === {} || this.state.issueDetail === {} || this.state.fetching) {
      return <div />;
    } else if (this.state.modalVisible) {
      return this.renderModal();
    } else 
      return this.renderReplies();
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
)(injectIntl(IssueDetail));
