import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class WelComePage extends Component {
  static propTypes = {};
  onPanelChange(value, mode) {
    console.log(value, mode);
  }
  render() {
    return (
      <div className="monitor-wel-come-page">
        <h1>
          <FormattedMessage id="welcome_info" />
        </h1>
      </div>
    );
  }
}
