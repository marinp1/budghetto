import React from 'react';

const path = require('path');
const globals = require('../server/globals.js');
const request = require('superagent');
const render = require('react-dom');

import { browserHistory } from 'react-router';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="LoginScreen">
        <div id="loginForm">
          <h1>BUDGHETTO</h1>
          <form form action="" onSubmit={this.handleSubmit}>
            <label htmlFor="username">
              Username
            </label>
            <input defaultValue="tiivi.taavi@budghetto.space" type="text" id="username"></input>
            <label htmlFor="password">
              Password
            </label>
            <input type="password" id="password"></input>
            <input type="submit" id="submit" value="Login"></input>
          </form>
        </div>
      </div>
    );
  }

  // TODO: Do value checks
  handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username.trim() == '' || password.trim() == '') {
      console.log("Please fill both fields");
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

export default React.createClass({
  render() {
    return <LoginScreen/>;
  }
});
