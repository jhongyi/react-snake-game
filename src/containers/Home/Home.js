import React, { Component } from 'react';
import Content from './components/Content.js';
import './Home.less';

export default class Home extends Component {
  render() {
    return (
      <div id="pageHome">
        <Content />
      </div>
    );
  }
}
