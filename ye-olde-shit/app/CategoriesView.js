const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const globals = require('../server/globals.js');

import FontAwesome from 'react-fontawesome';

export default class CategoriesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { categories: [], createEnabled: false };
    this.getCategories = this.getCategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories() {
    request.get('/api/getCategories')
      .query({ who: globals.loggedInUserId })
      .end((err, res) => {
        this.setState({ categories: res.body });
      });
  }

  createCategory(data) {
    request.post('/api/createCategory')
      .set('Content-Type', 'application/json')
      .send(`{
        "name":"${ data.name }",
        "who":"${ globals.loggedInUserId }"
      }`).end((err, res) => {
        this.getCategories();
        this.cancel();
      });
  }

  cancel() {
    this.setState({ createEnabled: false });
  }

  render() {
    return (
      <div id='category-view'>
        { !this.state.createEnabled ?
        <div id='create-category'>
          <button onClick={ () => this.setState({ createEnabled: true }) }>Create new category</button>
        </div>
        :
        <EditForm name='' submit={ this.createCategory } cancel={ this.cancel }/>}
        <div id='category-list'>
          { _.map(this.state.categories, category =>
            <Category data={ category } key={ category.name } refresh={ this.getCategories }/>
          )}
        </div>
      </div>
    );

  }
}

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.state = { transactions: 0,
                   name: this.props.data.name,
                   editEnabled: false,
                   confirmEnabled: false,
                   data: this.props.data };

    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    request.get('/api/getAccounts')
      .query({ who: globals.loggedInUserId })
      .end((err, accRes) => {
        request.get('/api/getTransactions')
          .query({ from: '1970-01-01', to: '9999-12-31', who: globals.loggedInUserId, categories: this.props.data, accounts: accRes.body })
          .end((err, res) => {
            this.setState({ transactions: res.body.length });
          });
        });
  }

  submit(data) {
    if (data.name === '') data.name = this.state.name;
    request.post('/api/updateCategory')
      .set('Content-Type', 'application/json')
      .send(`{
        "name":"${ data.name }",
        "id":"${ this.props.data.id }"
      }`).end((err, res) => {
        this.setState({ editEnabled: false, name: data.name });
      });
  }

  delete() {
    request.get('/api/deleteCategory')
      .query({ id: this.props.data.id })
      .end((err, res) => {
        this.props.refresh();
      });
  }

  // Fetch actual data from db to ensure that ui represents data state in db
  cancel() {
      request.get('/api/getCategories')
        .query({ who: globals.loggedInUserId })
        .end((err, res) => {
          // Ghetto loop since direct findbyid with models
          // caused compilation problems
          for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].id === this.props.data.id) {
              this.setState({ editEnabled: false,
                              confirmEnabled: false,
                              name: res.body[i].name });
            }
          }
        });
  }

  render() {
    return (
      <div className='category'>
        { !this.state.editEnabled ? <div>
          <p>{ this.state.name } ({ this.state.transactions } transactions in category)</p>
          { !this.state.confirmEnabled ?
            <div className='buttons'>
              <button onClick={ () => this.setState({ editEnabled: true, confirmEnabled: false }) }>Edit</button>
              <button onClick={ () => this.setState({ confirmEnabled: true, editEnabled: false }) } className='cancel'>Delete</button>
            </div>
          : ''}
          { this.state.confirmEnabled ?
            <div className='confirm'>
              <p>Are you sure? This will delete all transactions in this category as well.</p>
              <button onClick={ () => this.delete() }>Yes</button>
              <button onClick={ () => this.cancel() } className='cancel'>Cancel</button>
            </div>
          : '' }
        </div>
        : '' }
        { this.state.editEnabled ? <EditForm name={ this.state.name } submit={ this.submit } cancel={ this.cancel }/>
        : '' }
      </div>
    );
  }
}

class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name
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
          <label className='name-label'>Category name</label>
          <input type='text' name='name' onChange={ this.valueChange } value={ this.state.name }/>
        </div>
        <button onClick={ () => this.props.submit(this.state) }>Save</button>
        <button onClick={ () => this.props.cancel() } className='cancel'>Cancel</button>
      </div>
    );
  }

}
