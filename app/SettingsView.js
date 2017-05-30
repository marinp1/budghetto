const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const globals = require('../server/globals.js');

import FontAwesome from 'react-fontawesome';

import NavElem from './NavElem.js';
import BankAccountView from './BankAccountView.js';

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentView: 'Bank accounts', accounts: [] };

    this.changeView = this.changeView.bind(this);
    this.hideMobileMenu = this.hideMobileMenu.bind(this);
  }

  changeView(target) {
    this.setState({ currentView: target });
  }

  hideMobileMenu() {
    // Intentionally empty block
    return null;
  }

  render() {
    return (
      <div id='settings-view'>
        <div id="sub-nav-elems">
          <NavElem text='Bank accounts' changeView={ this.changeView } hideMobileMenu={ this.hideMobileMenu } className={ this.state.currentView == 'Bank accounts' ? ' selected' : ''} icon={ <FontAwesome name='credit-card' /> }/>
          <NavElem text='Categories' changeView={ this.changeView } hideMobileMenu={ this.hideMobileMenu } className={ this.state.currentView == 'Categories' ? ' selected' : ''} icon={ <FontAwesome name='list'/> }/>
        </div>
        { this.state.currentView == 'Bank accounts' ? <BankAccountView/> : '' }
        { this.state.currentView == 'Categories' ? <p> NOT IMPLEMENTED </p> : '' }
      </div>
    );

  }
}
