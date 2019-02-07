import React, { Component } from 'react';
import SidePanel from './SidePanel';
import { IntlProvider, addLocaleData } from 'react-intl';
import enMessages from './locale/en';
import zhMessages from './locale/zh';
import { connect } from 'react-redux';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';
import { Layout as AntLayout, Menu, Breadcrumb, Icon } from 'antd';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_GB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

export class Layout extends Component {
  consturctor(props) {
    this._onChange = this._onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
  }
  static propTypes = {};

  render() {
    const messages = [enMessages, zhMessages];
    const message = 'zh' !== this.props.monitor.language ? messages[0] : messages[1];
    const antLocale = 'zh' !== this.props.monitor.language ? en_GB : zh_CN;
    const antLanguage = 'zh' !== this.props.monitor.language ? 'en-gb' : 'zh-cn';
    moment.locale(antLanguage);
    const { Header, Footer, Sider, Content } = AntLayout;
    return (
      <div className="monitor-layout">
        <LocaleProvider locale={antLocale}>
          <IntlProvider locale={this.props.monitor.language} messages={message}>
            <div>
              <AntLayout style={{ minHeight: '100vh', background: '#fff' }}>
                <SidePanel />
                <AntLayout>
                  <Header style={{ background: '#fff', padding: 0 }} />
                  <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                      <div className="monitor-page-container">{this.props.children}</div>
                    </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                  </Footer>
                </AntLayout>
              </AntLayout>
            </div>
          </IntlProvider>
        </LocaleProvider>
      </div>
    );
  }
}

addLocaleData([...en, ...zh]);
/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    monitor: state.monitor,
  };
}

export default connect(mapStateToProps)(Layout);
