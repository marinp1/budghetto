const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const globals = require('../server/globals.js');

import FontAwesome from 'react-fontawesome';

export default class BankAccountView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [], createEnabled: false };
    this.getAccounts = this.getAccounts.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.getAccounts();
  }

  getAccounts() {
    request.get('/api/getAccounts')
      .query({ who: globals.loggedInUserId })
      .end((err, res) => {
        this.setState({ accounts: res.body });
      });
  }

  createAccount(data) {
    request.post('/api/createAccount')
      .set('Content-Type', 'application/json')
      .send(`{
        "name":"${ data.name }",
        "initialValue":"${ data.initialValue }",
        "who":"${ globals.loggedInUserId }"
      }`).end((err, res) => {
        this.getAccounts();
        this.cancel();
      });
  }

  cancel() {
    this.setState({ createEnabled: false });
  }

  render() {
    return (
      <div id='account-view'>
        { !this.state.createEnabled ?
        <div id='create-account'>
          <button onClick={ () => this.setState({ createEnabled: true }) }>Create new account</button>
        </div>
        :
        <EditForm name='' initialValue='0' submit={ this.createAccount } cancel={ this.cancel }/>}
        <div id='account-list'>
          { _.map(this.state.accounts, account =>
            <BankAccount data={ account } key={ account.name } refresh={ this.getAccounts }/>
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
                   name: this.props.data.name,
                   editEnabled: false,
                   confirmEnabled: false,
                   data: this.props.data };

    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);

  }

  componentDidMount() {
    request.get('/api/getCategories')
      .query({ who: globals.loggedInUserId })
      .end((err, catRes) => {
          request.get('/api/getTransactions')
            .query({ from: '1970-01-01', to: '9999-12-31', who: globals.loggedInUserId, categories: catRes.body, accounts: this.props.data })
            .end((err, res) => {
              this.setState({ transactions: res.body });
              this.updateValue(this.props.data);
            });
        });
  }

  updateValue(data) {
    // Calculates current amount for given bank account
    let value = parseFloat(data.initialValue);
    for(let i = 0; i < this.state.transactions.length; i++) {
      value += this.state.transactions[i].amount;
    }
    this.setState({ name: data.name, initialValue: data.initialValue, value: value.toFixed(2) });
  }



  submit(data) {
    if (data.name === '') data.name = this.state.name;
    if (data.initialValue === '') data.initialValue = 0;
    request.post('/api/updateAccount')
      .set('Content-Type', 'application/json')
      .send(`{
        "name":"${ data.name }",
        "initialValue":"${ data.initialValue }",
        "id":"${ this.props.data.id }"
      }`).end((err, res) => {
        this.updateValue(data);
        this.setState({ editEnabled: false });
      });
  }

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
      <div className='bank-account'>
        { !this.state.editEnabled ? <div>
          <p>{ this.state.name } ({ this.state.value } €)</p>
          { !this.state.confirmEnabled ?
            <div className='buttons'>
              <button onClick={ () => this.setState({ editEnabled: true, confirmEnabled: false }) }>Edit</button>
              <button onClick={ () => this.setState({ confirmEnabled: true, editEnabled: false }) } className='cancel'>Delete</button>
            </div>
          : ''}
          { this.state.confirmEnabled ?
            <div className='confirm'>
              <p>Are you sure? This will delete all transactions in this account as well.</p>
              <button onClick={ () => this.delete() }>Yes</button>
              <button onClick={ () => this.cancel() } className='cancel'>Cancel</button>
            </div>
          : '' }
        </div>
        : '' }
        { this.state.editEnabled ? <EditForm name={ this.state.name } initialValue={ this.state.initialValue } submit={ this.submit } cancel={ this.cancel }/>
        : '' }
      </div>
    );
  }
}

class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      initialValue: this.props.initialValue
    };

    this.valueChange = this.valueChange.bind(this);
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className='edit-form'>
        <div>
          <label className='name-label'>Account name</label>
          <input type='text' name='name' onChange={ this.valueChange } value={ this.state.name }/>
        </div>
        <div>
          <label>Initial value</label>
          <input type='number' name='initialValue' step='0.01' onChange={ this.valueChange } value={ this.state.initialValue }/>
        </div>
        <button onClick={ () => this.props.submit(this.state) }>Save</button>
        <button onClick={ () => this.props.cancel() } className='cancel'>Cancel</button>
      </div>
    );
  }

}
