const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const Favicon = require('react-favicon');

import TransactionView from './TransactionView.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <img src={ require('./Assets/logo.png') } id='logo' />
        <h1>Budghetto</h1>
      </header>
    );
  }
}

class NavElem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onClick={ () => this.props.changeView(this.props.text) } className={ this.props.className }>
        <p>{ this.props.text }</p>
      </div>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elements: [
        'Transactions', 'test'
      ]
    };
  }

  render() {
    return (
      <navBar>
        {
          _.map(this.state.elements, elem =>
            <NavElem text={ elem } changeView={ this.props.changeView } className={ this.props.currentView == elem ? 'selected' : ''}/>
          )
        }
      </navBar>
    );
  }
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer>
        <p>Copyright: Budghetto team 2017</p>
      </footer>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
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
        <Favicon url='./Assets/favicon.ico' />
        <Header/>
        <NavBar changeView={ this.changeView } currentView={ this.state.currentView }/>
        { this.state.currentView == 'Transactions' && <TransactionView/> }
        <Footer />
      </div>
    );
  }
}
