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
      selectedCategories: 0,
      currentForm: 'Create',
      editData: {}
    };

    this.getTransactions = this.getTransactions.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.editTransaction = this.editTransaction.bind(this);

    this.categories = [];
  }

  componentDidMount() {
    request.get('/api/getCategories')
      .query({ who: globals.loggedInUserId })
      .end((err, res) => {
        for(let i in res.body) {
          this.categories.push(res.body[i]);
        }
        this.setState({ selectedCategories: this.categories.length });
        this.getTransactions({ from: this.state.from, to: this.state.to, selected: this.categories });
      });
  }

  getTransactions(filter) {
    request.get('/api/getTransactions')
      .query({ from: filter.from, to: filter.to, who: globals.loggedInUserId, categories: filter.selected })
      .end((err, res) => {
        this.setState({ transactions: res.body, from: filter.from, to: filter.to, selectedCategories: filter.selected.length });
      });
  }

  closeForm() {
    this.setState({ currentForm: 'Create', editData: {} });
  }

  editTransaction(data) {
    this.setState({ editData: data, currentForm: 'Edit' });
  }

  //TODO: add account support
  //TODO: Figure out some non-ghetto solution to mobile create form
  render() {
    return (
      <div id='transaction-view'>
        <div id='left'>
          <div id='filter-bar'>
            <p>Displaying { this.state.transactions.length } transactions
                from { this.state.selectedCategories } categories
                in X accounts
                between { this.state.from } and { this.state.to }</p>
            <button id='filter-btn' onClick={ () => this.setState({ currentForm: 'Search' }) }>Filters</button>
          </div>
          <TransactionList transactions={ this.state.transactions } refresh={ this.getTransactions } categories={ this.categories } editTransaction={ this.editTransaction }/>
          <button id='open-create' className='mobile-visible'>Create transaction</button>
        </div>
        <div id='right'>
          { this.state.currentForm == 'Create' ? <CreateForm getTransactions={ this.getTransactions } categories={ this.categories }/> : '' }
          { this.state.currentForm == 'Search' ? <SearchForm getTransactions={ this.getTransactions } categories={ this.categories } close={ this.closeForm }/> : '' }
          { this.state.currentForm == 'Edit' ? <EditForm data={ this.state.editData } getTransactions={ this.getTransactions } categories={ this.categories } close={ this.closeForm }/> : '' }
          <div id='copyright'>
            <FontAwesome name='copyright'/><p>Budghetto team 2017</p>
          </div>
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
              <Transaction key={ row.id } data={ row } refresh={ this.props.refresh } categories={ this.props.categories } edit={ this.props.editTransaction }/>
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
      id: this.props.data.id,
      date: this.props.data.date.slice(0,10),
      amount: this.props.data.amount,
      description: this.props.data.description,
      stakeholder: this.props.data.stakeholder,
      category: this.props.data.Category
    };
    this.delete = this.delete.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      date: newProps.data.date.slice(0,10),
      amount: newProps.data.amount,
      description: newProps.data.description,
      stakeholder: newProps.data.stakeholder,
      category: newProps.data.Category
    });
  }

  delete() {
    request.get('/api/deleteTransaction')
      .query({ id: this.props.data.id })
      .end((res, err) => {
        this.toggleConfirm();
        this.props.refresh();
      });
  }

  // TODO: Add account support
  render() {
    return (
      <div className='transaction' onClick={ () => this.props.edit(this.state) }>
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

    this.state = { from: '1970-01-01', to: '9999-12-31', selected: this.props.categories };
    this.valueChange = this.valueChange.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
  }

  valueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleCategory(event) {
    const newSelected = this.state.selected.filter( function(e) { return e.name != event.target.name; } );
    // Category was selected
    if (newSelected.length == this.state.selected.length) {
      const categoryObj = this.props.categories[this.props.categories.findIndex(function(e) { return e.name == event.target.name; })];
      newSelected.push(categoryObj);
    }
    this.setState({ selected: newSelected });
  }

  render() {
    return (
      <div id='search-form'>
        <h2>Filter transactions</h2>
        <div id='dates'>
          <div className='date-field'>
            <label>From:</label>
            <input type='date' name='from' onChange={ this.valueChange }/>
          </div>
          <div className='date-field'>
            <label>To:</label>
            <input type='date' name='to' onChange={ this.valueChange }/>
          </div>
        </div>
        <div id='categories'>
          <p>Categories:</p>
          <ScrollArea speed={0.8} horizontal={false} >
            { _.map(this.props.categories, category =>
              <div key={ category.id } className='category-selector'>
                <input type='checkbox' name={ category.name } defaultChecked onChange={ this.toggleCategory }/>
                <p>{ category.name }</p>
              </div>
            )}
          </ScrollArea>
        </div>
        <button id='apply-filters' onClick={ () => { this.props.getTransactions(this.state); this.props.close(); } }>Apply filters</button>
        <button id='close-search' onClick={ () => this.props.close() }>Cancel</button>
      </div>
    );
  }
}

class CreateForm extends React.Component {
  constructor(props) {
    super(props);

    // Initial values to prevent changing from uncontrolled input to controlled input warnings
    // Will be overwritten on getDefaults()
    this.state = {date: '', amount: 0, description: '', stakeholder: '', category: {}};
    this.valueChange = this.valueChange.bind(this);
  }

  componentWillReceiveProps() {
    this.getDefaults();
  }

  valueChange(event) {
    if (event.target.name === 'category') {
      const category = this.props.categories.filter(function(c) { return c.name == event.target.value; })[0];
      this.setState({ category: category });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  getDefaults() {
    this.setState({ date: new Date(Date.now()).toISOString().slice(0,10), amount: 0, description: '', stakeholder: '', category: this.props.categories[0] });
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
        this.props.getTransactions({ from: '1970-01-01', to: '9999-12-31', selected: this.props.categories });
        this.getDefaults();
      });
  }

  render() {
    return (
      <div id='create-form'>
        <h2>Create new transaction</h2>
        <div>
          <label>Date:</label>
          <input type='date' name='date' onChange={ this.valueChange } value={ this.state.date }/>
        </div>
        <div>
          <label>Amount:</label>
          <input type='number' step='0.01' name='amount' onChange={ this.valueChange } value={ this.state.amount }/>
        </div>
        <div>
          <label>Description:</label>
          <input type='text' name='description' onChange={ this.valueChange } value={ this.state.description }/>
        </div>
        <div>
          <label>Stakeholder:</label>
          <input type='text' name='stakeholder' onChange={ this.valueChange } value={ this.state.stakeholder }/>
        </div>
        <div>
          <label>Category:</label>
          { this.props.categories.length > 0 ? <CategorySelect categories={ this.props.categories } selected={ this.state.category } valueChange={ this.valueChange }/> : '' }
        </div>
        <button id='create' onClick={ () => this.submit() }>Create</button>
        <button id='cancel-create' onClick={ () => this.getDefaults() }>Clear</button>
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
        <select className='categorySelector' value={ this.props.selected.name } onChange={ this.props.valueChange } name='category'>
          { _.map(Array.from(this.props.categories), category =>
            <option key={ category.id } value={ category.name }>{ category.name }</option>
          )}
        </select>
    );
  }
}

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: this.props.data.date.slice(0, 10),
                  amount: this.props.data.amount,
                  description: this.props.data.description,
                  stakeholder: this.props.data.stakeholder,
                  category: this.props.data.category};
    this.valueChange = this.valueChange.bind(this);
  }

  valueChange(event) {
    if (event.target.name === 'category') {
      const category = this.props.categories.filter(function(c) { return c.name == event.target.value; })[0];
      this.setState({ category: category });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  // TODO: add bankaccount
  submit() {
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
        this.props.getTransactions({ from: '1970-01-01', to: '9999-12-31', selected: this.props.categories });
        this.props.close();
      });
  }

  render() {
    return (
      <div id='edit-form'>
        <h2>Edit transaction</h2>
        <div>
          <label>Date:</label>
          <input type='date' name='date' onChange={ this.valueChange } value={ this.state.date }/>
        </div>
        <div>
          <label>Amount:</label>
          <input type='number' step='0.01' name='amount' onChange={ this.valueChange } value={ this.state.amount }/>
        </div>
        <div>
          <label>Description:</label>
          <input type='text' name='description' onChange={ this.valueChange } value={ this.state.description }/>
        </div>
        <div>
          <label>Stakeholder:</label>
          <input type='text' name='stakeholder' onChange={ this.valueChange } value={ this.state.stakeholder }/>
        </div>
        <div>
          <label>Category:</label>
          <CategorySelect categories={ this.props.categories } selected={ this.state.category } valueChange={ this.valueChange }/>
        </div>
        <button id='save' onClick={ () => this.submit() }>Save changes</button>
        <button id='cancel-edit' onClick={ () => this.props.close() }>Cancel</button>
      </div>
    );
  }
}
