const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
import ScrollArea from 'react-scrollbar';

export default class TransactionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { transactions: [], from: '1970-01-01', to: '9999-12-31' };
    this.valueChange = this.valueChange.bind(this);
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

  render() {
    return (
      <div>
        <div id='dateform'>
          Showing transactions
          <label>
            from:
            <input type='date' name='from' onChange={ this.valueChange }/>
          </label>
          <label>
            to:
            <input type='date' name='to' onChange={ this.valueChange }/>
          </label>
          <button onClick={() => this.getTransactions() }>Search</button>
        </div>
        <TransactionList transactions={ this.state.transactions }/>
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
