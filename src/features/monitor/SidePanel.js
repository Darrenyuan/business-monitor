import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layout as AntLayout, Menu, Breadcrumb, Icon } from 'antd';

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
    const { Header, Content, Footer, Sider } = AntLayout;
    const SubMenu = Menu.SubMenu;
    return (
      <div className="monitor-side-panel">
        <div className="logo" />
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          theme="light"
        >
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>
                <Link to="/monitor/welcompage">
                  <FormattedMessage id="sidePanel_welcome_link" />
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>
                <Link to="/monitor/login">
                  <FormattedMessage id="sidePanel_login_link" />
                </Link>
              </span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>
                    <FormattedMessage id="sidePanel_project" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="3">
                <Link to="/monitor/project/action/create">
                  <FormattedMessage id="sidePanel_project_create_link" />
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/monitor/projects/1">
                  <FormattedMessage id="sidePanel_projects_link" />
                </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>
                    <FormattedMessage id="sidePanel_previlige" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="5">
                <Link to="/monitor/account/create/step">
                  <FormattedMessage id="sidePanel_account_link" />
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/monitor/account/reset">
                  <FormattedMessage id="sidePanel_reset_password_link" />
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="7">
              <Icon type="file" />
              <span>
                <Link to="/monitor/togglelanguage">
                  <FormattedMessage id="sidePanel_toggle_language_link" />
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
