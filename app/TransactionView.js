const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const globals = require('../server/globals.js');
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';

export default class TransactionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      from: '1970-01-01', to: '9999-12-31',
      addViewEnabled: false,
      selected: new Map()
    };

    this.valueChange = this.valueChange.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);

    let all = [];
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    request.get('/api/getCategories')
      .query({ who: globals.loggedInUserId })
      .end((err, res) => {
        const categoryMap = new Map();
        for(let i in res.body) {
          categoryMap.set(res.body[i].name, res.body[i]);
        }
        this.setState({ selected: categoryMap });
        this.all = new Map(categoryMap);
        this.getTransactions();
      });
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleCategory(event) {
    // Select category
    if (!this.state.selected.has(event.target.name)) {
      const newSituation = this.state.selected;
      newSituation.set(event.target.name, this.all.get(event.target.name));
      this.setState({ selected: newSituation });
    // Deselect
    } else {
      const newSituation = this.state.selected;
      newSituation.delete(event.target.name);
      this.setState({ selected: newSituation });
    }
  }

  // CategoryMap is map from category name to category object
  getTransactions() {
    // Only objects are thrown forward so that we have direct access to their ids.
    const categories = [];
    for(let category of this.state.selected.values()) {
      categories.push(category);
    }
    request.get('/api/getTransactions')
      .query({ from: this.state.from, to: this.state.to, who: globals.loggedInUserId, categories: categories })
      .end((err, res) => {
        this.setState({ transactions: res.body });
      });
  }

  //TODO: add account support
  render() {
    return (
      <div id='transaction-view'>
        <div id='left'>
          <div id='filter-bar'>
            <p>Displaying { this.state.transactions.length } transactions
                from { this.state.selected.size } categories
                in X accounts
                between { this.state.from } and { this.state.to }</p>
            <button id='filter-btn'>Filters</button>
          </div>
          <TransactionList transactions={ this.state.transactions } refresh={ this.getTransactions } categories={ this.all }/>
        </div>
        <div id='right'>
          <SearchForm valueChange={ this.valueChange } getTransactions={ this.getTransactions }/>
        </div>
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
      <div id='transaction-list'>
        <ScrollArea speed={0.8} horizontal={false} >
          <div id='transactions-wrapper'>
            { _.map(this.props.transactions, row =>
              <Transaction key={ row.id } data={ row } refresh={ this.props.refresh } categories={ this.props.categories }/>
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

    this.state = {
      date: this.props.data.date.slice(0,10),
      amount: this.props.data.amount,
      description: this.props.data.description,
      stakeholder: this.props.data.stakeholder,
      category: this.props.data.Category
    };
    this.delete = this.delete.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
  }

  delete() {
    request.get('/api/deleteTransaction')
      .query({ id: this.props.data.id })
      .end((res, err) => {
        this.toggleConfirm();
        this.props.refresh();
      });
  }

  update() {
    request.post('/api/updateTransaction')
      .set('Content-Type', 'application/json')
      .send(`{
        "id":"${ this.props.data.id }",
        "date":"${ this.state.date }",
        "amount":"${ this.state.amount }",
        "description":"${ this.state.description }",
        "stakeholder":"${ this.state.stakeholder }",
        "category":"${ this.state.category.id }",
        "who":"${ globals.loggedInUserId }"
      }`).end((err, res) => {
        this.toggleEdit();
        this.props.refresh();
      });
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  categoryChange(event) {
    this.setState({ category: this.props.categories.get(event.target.value) });
  }

  // TODO: Add account support
  render() {
    return (
      <div className='transaction'>
        <div className='first-block'>
          <p className='secondary'>{ this.props.data.date.slice(0,10) }</p>
          <p className='stakeholder'>{ this.props.data.stakeholder }</p>
        </div>
        <div className='second-block'>
          <p className='secondary'>BANKACCOUNT HERE</p>
          <p className='description'>{ this.props.data.description }</p>
        </div>
        <div className='third-block'>
          <p className='secondary'>{ this.props.data.Category.name }</p>
          <p className={ this.props.data.amount < 0 ? 'expense amount' : 'amount'}>
            { (this.props.data.amount > 0 ? '+' : '') + this.props.data.amount.toFixed(2) + ' €' }
          </p>
        </div>
        <div className='fourth-block'>
          <FontAwesome name='angle-right'/>
        </div>
      </div>
    );
  }
}

// TODO: add account support
class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { categories: []};
  }

  componentWillReceiveProps(newProps) {
    if(newProps.hasOwnProperty('categories') && newProps.categories != undefined) {
      this.setState({ categories: Array.from(newProps.categories.values()) });
    }
  }

  render() {
    return (
      <div id='search-form'>
        <h2>Filter transactions</h2>
        <div className='date-field'>
          <label>From:</label>
          <input type='date' name='from' onChange={ this.props.valueChange }/>
        </div>
        <div className='date-field'>
          <label>To:</label>
          <input type='date' name='to' onChange={ this.props.valueChange }/>
        </div>
        <button id='apply-filters' onClick={ () => this.props.getTransactions() }>Apply filters</button>
      </div>
    );
  }
}

class AddView extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getDefaults();
    this.valueChange = this.valueChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  categoryChange(event) {
    this.setState({ category: this.props.categories.get(event.target.value) });
  }

  getDefaults() {
    return { date: '', amount: 0, description: '', stakeholder: '', category: Array.from(this.props.categories.values())[0] };
  }

  close() {
    this.setState(this.getDefaults());
    this.props.disableAddView();
  }

  // TODO: Add bankaccount
  submit() {
    request.post('/api/createTransaction')
      .set('Content-Type', 'application/json')
      .send(`{
        "date":"${ this.state.date }",
        "amount":"${ this.state.amount }",
        "description":"${ this.state.description }",
        "stakeholder":"${ this.state.stakeholder }",
        "category":"${ this.state.category.id }",
        "who":"${ globals.loggedInUserId }"
      }`).end((err, res) => {
        this.close();
        this.props.refresh();
      });
  }

  render() {
    return (
      <div id='create-form'>
        <input type='date' onChange={ this.valueChange } name='date' id='date-field' />
        <input type='number' onChange={ this.valueChange } name='amount' id='amount-field' step='0.01'/>
        <input type='text' onChange={ this.valueChange } name='description' id='description-field' />
        <input type='text' onChange={ this.valueChange } name='stakeholder' id='stakeholder-field' />
        <CategorySelect category={ this.state.category } valueChange={ this.valueChange }
                        categories={ this.props.categories } categoryChange={ this.categoryChange }/>
        <button onClick={ () => this.submit() } id='confirm-btn'><FontAwesome name='check' /></button>
        <button onClick={ () => this.close() } id='cancel-btn'><FontAwesome name='close' /></button>
      </div>
    );
  }
}

/*
This could also be used as a general component
in all situations requiring confirmation
*/
class Confirm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='confirm'>
        <p>Are you sure?</p>
        <button id='delete-btn' onClick={ () => this.props.confirm() }>Confirm</button>
        <button id='delete-cancel' onClick={ () => this.props.cancel() }>Cancel</button>
      </div>
    );
  }
}

class CategorySelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <select className='categoryCol' value={ this.props.category.name } onChange={ this.props.categoryChange } name='category'>
        { _.map(Array.from(this.props.categories.values()), category =>
          <option key={ category.id } value={ category.name }>{ category.name }</option>
        )}
      </select>
    );
  }
}
