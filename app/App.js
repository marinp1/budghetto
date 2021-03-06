const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const globals = require('../server/globals.js');
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';

import TransactionView from './TransactionView.js';
import SettingsView from './SettingsView';
import NavElem from './NavElem.js';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = { mobileMenu: false };
    this.hideMobileMenu = this.hideMobileMenu.bind(this);
  }

  logout() {
    globals.loggedInUserId = '';
    browserHistory.push('/');
  }

  toggleMobileMenu() {
    this.setState({ mobileMenu: !this.state.mobileMenu });
  }

  // Used to hide menu when user clicks navigation element
  hideMobileMenu() {
    this.setState({ mobileMenu: false });
  }

  render() {
    return (
      <header>
        <h1>Budghetto</h1>
          <div id="nav-elems" className={ this.state.mobileMenu ? 'mobile-visible' : 'mobile-hidden'}>
            <NavElem text='Transactions' changeView={ this.props.changeView } hideMobileMenu={ this.hideMobileMenu } className={ this.props.currentView == 'Transactions' ? ' selected' : ''} icon={ <FontAwesome name='exchange' /> } />
            <NavElem text='Settings' changeView={ this.props.changeView } hideMobileMenu={ this.hideMobileMenu } className={ this.props.currentView == 'Settings' ? ' selected' : ''} icon={ <FontAwesome name='gears' /> } />
            <div id="loggedInAs" className={ this.state.mobileMenu ? 'mobile-visible' : 'mobile-hidden'}>
              <div>
                <p id="logged-text">Logged in as:</p>
                <p className="mobile-hidden">{ globals.loggedInUserId }</p>
              </div>
              <button id="logoutButton" onClick={ () => this.logout() }>Log out</button>
            </div>
          </div>
        <FontAwesome name="bars" id="mobile-menu" onClick={ () => this.toggleMobileMenu() }/>
      </header>
    );
  }
}



export default class App extends React.Component {

  constructor(props) {
    if (globals.loggedInUserId == '') {
      browserHistory.push('/');
    }

    super(props);

    this.state = { currentView: 'Transactions' };
    this.changeView = this.changeView.bind(this);
  }

  changeView(target) {
    this.setState({ currentView: target });
  }

  render() {
    return (
      <div>
        <Header changeView={ this.changeView } currentView={ this.state.currentView }/>
        { this.state.currentView == 'Transactions' && <TransactionView/> }
        { this.state.currentView == 'Settings' && <SettingsView/> }
      </div>
    );
  }
}
