import React from 'react';

const path = require('path');
const globals = require('../server/globals.js');
const request = require('superagent');
const render = require('react-dom');

import { browserHistory } from 'react-router';

export default class RegistrationScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="RegistrationScreen">
        <div id="registrationForm">
          <h1>BUDGHETTO</h1>
          <form action="" onSubmit={this.handleSubmit}>
            <label htmlFor="username">
              Username
            </label>
            <input defaultValue="newuser@budghetto.space" type="text" id="username"></input>
            <label htmlFor="password">
              Password
            </label>
            <input type="password" id="password"></input>
            <label htmlFor="repassword">
              Retype password
            </label>
            <input type="password" id="repassword"></input>
            <input type="submit" id="submit" value="Sign up"></input>
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
    const repassword = document.getElementById('repassword').value;

    if (username.trim() == '' || password.trim() == '') {
      console.log("Please type in both username and password");
      return false;
    }

    if (password.trim() !== repassword.trim()) {
      console.log("Passwords do not match");
      return false;
    }

    // TODO: Very shitty way atm
    request.get('/api/createNewUserAccount')
      .query({ username: username, password: password })
      .end((err, res) => {

        if (err) {
          console.log("Username already taken or some other error");
          return false;
        }

        console.log("User created: " + username + " - " + password);

        // Forward to main screen
        browserHistory.push('/');

      });

  }
}
