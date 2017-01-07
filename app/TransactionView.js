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
    const name = event.target.name.toString();
    const value = event.target.value;
    this.setState({ name: value });
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
          <label>
            From:
            <input type='date' name='from' onChange={ this.valueChange }/>
          </label>
          <label>
            To:
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
          <h2>Date</h2>
          <h2>Amount</h2>
          <h2>Description</h2>
          <h2>Stakeholder</h2>
        </div>
        <ScrollArea
          speed={0.8}
          horizontal={false}
        >
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
      <div className='transaction'>
        <p>{ this.props.data.date }</p>
        <p>{ this.props.data.amount }</p>
        <p>{ this.props.data.description }</p>
        <p>{ this.props.data.category }</p>
        <p>{ this.props.data.stakeholder }</p>
      </div>
    );
  }
}
