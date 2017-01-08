const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
import ScrollArea from 'react-scrollbar';

export default class TransactionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      from: '1970-01-01', to: '9999-12-31',
      addViewEnabled: false
    };
    this.valueChange = this.valueChange.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.disableAddView = this.disableAddView.bind(this);
    this.getTransactions();
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getTransactions() {
    request.get('/api/getTransactions')
      .query({ from: this.state.from, to: this.state.to })
      .end((err, res) => {
        this.setState({ transactions: res.body });
      });
  }

  enableAddView() {
    this.setState({ addViewEnabled: true });
  }

  disableAddView() {
    this.setState({ addViewEnabled: false });
  }

  render() {
    return (
      <div>
        <SearchForm valueChange={ this.valueChange } getTransactions={ this.getTransactions }/>
        <button onClick={ () => this.enableAddView() } >Create new</button>
        { this.state.addViewEnabled ? <AddView disableAddView={ this.disableAddView } refresh={ this.getTransactions }/> : '' }
        <TransactionList transactions={ this.state.transactions }/>
      </div>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='dateform'>
        Showing transactions
        <label>
          from:
          <input type='date' name='from' onChange={ this.props.valueChange }/>
        </label>
        <label>
          to:
          <input type='date' name='to' onChange={ this.props.valueChange }/>
        </label>
        <button onClick={() => this.props.getTransactions() }>Search</button>
      </div>
    );
  }
}

class AddView extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getDefaults();
    this.valueChange = this.valueChange.bind(this);
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getDefaults() {
    return { date: '', amount: 0, description: '', stakeholder: '' };
  }

  close() {
    this.setState(this.getDefaults());
    this.props.disableAddView();
  }

  submit() {
    request.post('/api/addTransaction')
      .set('Content-Type', 'application/json')
      .send(`{
        "date":"${ this.state.date }",
        "amount":"${ this.state.amount }",
        "description":"${ this.state.description }",
        "stakeholder":"${ this.state.stakeholder }"
      }`).end((err, res) => {
        this.close();
        this.props.refresh();
      });
  }

  render() {
    return (
      <div>
        <input type='date' onChange={ this.valueChange } name='date' />
        <input type='number' onChange={ this.valueChange } name='amount' />
        <input type='text' onChange={ this.valueChange } name='description' />
        <input type='text' onChange={ this.valueChange } name='stakeholder' />
        <button onClick={ () => this.submit() }>Confirm</button>
        <button onClick={ () => this.close() }>Cancel</button>
      </div>
    );
  }
}

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='transactions'>
        <div id='titles'>
          <h2 id='dateTitle'>Date</h2>
          <h2 id='amountTitle'>Amount</h2>
          <h2 id='descriptionTitle'>Description</h2>
          <h2 id='stakeholderTitle'>Stakeholder</h2>
        </div>
        <ScrollArea speed={0.8} horizontal={false} >
          <div>
            { _.map(this.props.transactions, row =>
              <Transaction data={ row } />
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
}

class Transaction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ (this.props.data.amount > 0 ? 'income': 'expense') + ' transaction' }>
        <p className='dateCol'>{ this.props.data.date.slice(0,10) }</p>
        <p className='amountCol'>{ (this.props.data.amount > 0 ? '+' : '') + this.props.data.amount.toFixed(2) + ' €' }</p>
        <p className='descriptionCol'>{ this.props.data.description }</p>
        <p className='stakeholderCol'>{ this.props.data.stakeholder }</p>
      </div>
    );
  }
}
