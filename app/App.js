const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const globals = require('../server/globals.js');
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';

import TransactionView from './TransactionView.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <h1>Budghetto</h1>
        <div id="nav-elems">
          <NavElem text='Transactions' changeView={ this.props.changeView } className={ this.props.currentView == 'Transactions' ? ' selected' : ''} icon={ <FontAwesome name='exchange' /> } />
          <NavElem text='Menu2' changeView={ this.props.changeView } className={ this.props.currentView == 'Transactions2' ? ' selected' : ''} icon={ <FontAwesome name='bell' /> } />
        </div>
        <div id="loggedInAs">
          <div>
            <p id="logged-text">Logged in as:</p>
            <p>{ globals.loggedInUserId }</p>
          </div>
          <button id="logoutButton" onClick={ () => this.logout() }>Log out</button>
        </div>
      </header>
    );
  }

  logout() {
    globals.loggedInUserId = '';
    browserHistory.push('/');
  }
}

class NavElem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onClick={ () => this.props.changeView(this.props.text) } className={'nav' + this.props.className }>
        { this.props.icon }
        <p>{ this.props.text }</p>
      </div>
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
      </div>
    );
  }
}
