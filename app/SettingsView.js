const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const globals = require('../server/globals.js');

import FontAwesome from 'react-fontawesome';

import NavElem from './NavElem.js';

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentView: 'Bank accounts', accounts: [] };

    this.changeView = this.changeView.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    request.get('/api/getAccounts')
      .query({ who: globals.loggedInUserId })
      .end((err, res) => {
        this.setState({ accounts: res.body });
      });
  }

  changeView(target) {
    this.setState({ currentView: target });
  }

  render() {
    return (
      <div id='settings-view'>
        <div id="sub-nav-elems">
          <NavElem text='Bank accounts' changeView={ this.changeView } hideMobileMenu={ function() {return null;} }className={ this.state.currentView == 'Bank accounts' ? ' selected' : ''} icon={ <FontAwesome name='credit-card' /> } />
        </div>
        <div id='account-list'>
          { _.map(this.state.accounts, account =>
            <BankAccount data={ account } key={ account.name } refresh={ this.render }/>
          )}
        </div>
      </div>
    );

  }
}

class BankAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.data.initialValue,
                   initialValue: this.props.data.initialValue,
                   name: this.props.data.name,
                   editEnabled: false,
                   confirmEnabled: false,
                   data: this.props.data };

    this.valueChange = this.valueChange.bind(this);
  }

  componentDidMount() {
    request.get('/api/getCategories')
      .query({ who: globals.loggedInUserId })
      .end((err, catRes) => {
          request.get('/api/getTransactions')
            .query({ from: '1970-01-01', to: '9999-12-31', who: globals.loggedInUserId, categories: catRes.body, accounts: this.props.data })
            .end((err, res) => {
              this.setState({ transactions: res.body });
              this.updateValue();
            });
        });
  }

  updateValue() {
    // Calculates current amount for given bank account
    let value = parseFloat(this.state.initialValue);
    for(let i = 0; i < this.state.transactions.length; i++) {
      value += this.state.transactions[i].amount;
    }
    this.setState({ value: value.toFixed(2) });
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submit() {
    request.post('/api/updateAccount')
      .set('Content-Type', 'application/json')
      .send(`{
        "name":"${ this.state.name }",
        "initialValue":"${ this.state.initialValue}",
        "id":"${ this.props.data.id }"
      }`).end((err, res) => {
        this.updateValue();
        this.setState({ editEnabled: false });
      });
  }

  //FIXME: doesn't work yet
  delete() {
    request.get('/api/deleteAccount')
      .query({ id: this.props.data.id })
      .end((err, res) => {
        this.props.refresh();
      });
  }

  // Fetch actual data from db to ensure that ui represents data state in db
  cancel() {
      request.get('/api/getAccounts')
        .query({ who: globals.loggedInUserId })
        .end((err, res) => {
          // Ghetto loop since direct findbyid with models
          // caused compilation problems
          for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].id === this.props.data.id) {
              this.setState({ editEnabled: false,
                              confirmEnabled: false,
                              initialValue: res.body[i].initialValue,
                              name: res.body[i].name });
            }
          }
        });
  }

  render() {
    return (
      <div>
        { !this.state.editEnabled ? <div>
          <p>{ this.state.name} ({ this.state.value })</p>
          { !this.state.confirmEnabled ?
            <div>
              <button onClick={ () => this.setState({ editEnabled: true, confirmEnabled: false }) }>Edit</button>
              <button onClick={ () => this.setState({ confirmEnabled: true, editEnabled: false }) }>Delete</button>
            </div>
          : ''}
          { this.state.confirmEnabled ?
            <div>
              <p>Are you sure?</p>
              <button onClick={ () => this.delete() }>Yes</button>
              <button onClick={ () => this.cancel() }>Cancel</button>
            </div>
          : '' }
        </div>
        : '' }
        { this.state.editEnabled ? <div>
          <div>
            <label>Account name:</label>
            <input type='text' name='name' onChange={ this.valueChange } value={ this.state.name }/>
          </div>
          <div>
            <label>Initial value</label>
            <input type='number' name='initialValue' step='0.01' onChange={ this.valueChange } value={ this.state.initialValue }/>
          </div>
          <button onClick={ () => this.submit() }>Save</button>
          <button onClick={ () => this.cancel() }>Cancel</button>
        </div>
        : '' }
      </div>
    );
  }
}
