import React from 'react';

const path = require('path');
const globals = require('../server/globals.js');
const request = require('superagent');
const render = require('react-dom');
const validator = require('../server/validator.js');

import { browserHistory } from 'react-router';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Strong email requires domain, ie. tiivi.taavi@ is not valid strong email.
  render() {
    return (
      <div id="LoginScreen">
        <div id="loginForm">
          <h1>BUDGHETTO</h1>
          <form action="" onSubmit={this.handleSubmit}>
            <input defaultValue="tiivi.taavi@budghetto.space" type="<strong>email</strong>" id="username" placeholder="example@budghetto.space"></input>
            <input type="password" id="password" placeholder="password"></input>
            <input type="submit" id="submit" value="Login"></input>
          </form>
          <input type="button" id="register" value="Sign up" onClick={ () => this.registerUser() }></input>
        </div>
      </div>
    );
  }

  registerUser() {
    browserHistory.push('register', null);
  }

  handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!validator.validateLogin(username, password)) return;

    // TODO: Very shitty way atm
    request.get('/api/verifyUserCredentials')
      .query({ username: username, password: password })
      .end((err, res) => {
        if (err) {
          console.log("Invalid username/password");
          return false;
        }

        globals.loggedInUserId = username;
        browserHistory.push('app', null);

      });

  }
}
