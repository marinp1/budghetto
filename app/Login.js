import React from 'react';

const path = require('path');
const globals = require('../server/globals.js');
const request = require('superagent');
const render = require('react-dom');

import { browserHistory } from 'react-router';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="LoginScreen">
        <div id="loginForm">
          <h1>BUDGHETTO</h1>
          <form action="" onSubmit={this.handleSubmit}>
            <label htmlFor="username">
              Username
            </label>
            <input defaultValue="tiivi.taavi@budghetto.space" type="<strong>email</strong>" id="username"></input>
            <label htmlFor="password">
              Password
            </label>
            <input type="password" id="password"></input>
            <input type="submit" id="submit" value="Login"></input>
          </form>
          <input type="button" id="registerButton" value="Sign up" onClick={ () => this.registerUser() }></input>
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

    if (username.trim() == '' || password.trim() == '') {
      console.log("Please fill both fields");
      return false;
    }

    // Check if user has done some ui hack to bypass email requirements
    // Prevents also attacks against validator
    if (!new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").test(username)) {
      console.log("Nice hack you got there, guess what, your email is not legit");
      return false;
    }

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
