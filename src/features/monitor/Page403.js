import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Page403 extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="monitor-page-403">
        <FormattedMessage id="forbidden_403" />
      </div>
    );
  }
}
