import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layout as AntLayout, Menu, Icon } from 'antd';

export class SidePanel extends Component {
  static propTypes = {
    monitor: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    collapse: false,
  };

  _onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  render() {
    const { Sider } = AntLayout;
    const SubMenu = Menu.SubMenu;
    return (
      <div className="monitor-side-panel">
        <div className="logo" />
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this._onCollapse}
          theme="light"
        >
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="4">
              <Icon type="project" />
              <span>
                <Link to="/monitor/projects/1">
                  <FormattedMessage id="sidePanel_projects_link" />
                </Link>
              </span>
            </Menu.Item>

            <Menu.Item key="issuesList">
              <Icon type="issues-close" />
              <span>
                <Link to="/monitor/issuesList">
                  <FormattedMessage id="sidePanel_issueManagement" />
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="accountList">
              <Icon type="team" />
              <span>
                <Link to="/monitor/accountList">
                  <FormattedMessage id="account_List" />
                </Link>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
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
)(injectIntl(SidePanel));
