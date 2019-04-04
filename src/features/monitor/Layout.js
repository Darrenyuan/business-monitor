import React, { Component } from 'react';
import SidePanel from './SidePanel';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import enMessages from './locale/en';
import zhMessages from './locale/zh';
import { connect } from 'react-redux';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';
import { Layout as AntLayout, Row, Col, LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_GB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import 'react-sticky-header/styles.css';
import LanguageIcon from '@material-ui/icons/Language';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

export class Layout extends Component {
  consturctor(props) {
    this._onChange = this._onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
  }

  static propTypes = {};

  handleHome = () => {
    this.props.history.push(`/monitor/home`);
  };

  render() {
    const messages = [enMessages, zhMessages];
    const message = 'zh' !== this.props.monitor.language ? messages[0] : messages[1];
    const antLocale = 'zh' !== this.props.monitor.language ? en_GB : zh_CN;
    const antLanguage = 'zh' !== this.props.monitor.language ? 'en-gb' : 'zh-cn';
    moment.locale(antLanguage);
    const { Header, Footer, Content } = AntLayout;

    return (
      <div className="monitor-layout">
        <LocaleProvider locale={antLocale}>
          <IntlProvider locale={this.props.monitor.language} messages={message}>
            <div>
              <AntLayout style={{ minHeight: '100vh', background: '#fff' }}>
                <SidePanel />
                <AntLayout>
                  <Row style={{ 'background-color': '#0197E3', padding: 0 }}>
                    <Col span={8}>
                      <Header style={{ 'background-color': '#0197E3', 'font-size': '1.5em' }}>
                        <Typography variant="h6" className="grow">
                          <FormattedMessage id="header_info" />
                        </Typography>
                      </Header>
                    </Col>
                    <Col span={4} offset={12} style={{ color: '#fff', 'font-size': '1.5em' }}>
                      <IconButton color="inherit" className="menuButton" onClick={this.handleHome}>
                        <LanguageIcon />
                      </IconButton>
                      <IconButton color="inherit" className="menuButton" onClick={this.handleHome}>
                        <HomeIcon color="inherit" />
                      </IconButton>
                      <span>123123123</span>
                    </Col>
                  </Row>

                  <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                      <div className="monitor-page-container">{this.props.children}</div>
                    </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>
                    Copyright © 2008 - 2019 中建三局第一建设工程有限责任公司
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
