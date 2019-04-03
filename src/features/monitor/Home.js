import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { injectIntl } from 'react-intl';
import { List, Card, Avatar } from 'antd';
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const mineData = this.props.monitor.loginData;
    const data = [
      {
        title: this.props.intl.formatMessage({ id: 'mine_nickname' }),
        content: mineData.nickname,
      },
      {
        title: this.props.intl.formatMessage({ id: 'mine_username' }),
        content: mineData.username,
      },
      {
        title: this.props.intl.formatMessage({ id: 'mine_userId' }),
        content: mineData.userId,
      },
      {
        title: this.props.intl.formatMessage({ id: 'mine_permission' }),
        content: this.props.intl.formatMessage({ id: `character_${mineData.roles[0].roleName}` }),
      },
    ];

    return (
      <div className="monitor-home">
        <Avatar size={64} icon="user" />
        <br />
        <br />
        <br />
        <br />
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.title}>{item.content}</Card>
            </List.Item>
          )}
        />
        ,
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
)(injectIntl(Home));