import React from 'react';

const path = require('path');
const globals = require('../server/globals.js');
const request = require('superagent');
const render = require('react-dom');
const validator = require('../server/validator.js');

import { browserHistory } from 'react-router';

export default class RegistrationScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
    TODO: Change password to stronger pattern,
    current pattern only validates that the password is at least 3 characters.
    Strong email type requires @ with domain, ie. tiivi.taavi@ is not valid strong email.
  */
  render() {
    return (
      <div id="RegistrationScreen">
        <div id="registrationForm">
          <h1>BUDGHETTO</h1>
          <form action="" onSubmit={this.handleSubmit}>
            <label htmlFor="username">
              Username
            </label>
            <input defaultValue="newuser@budghetto.space" type="<strong>email</strong>" id="username" placeholder="example@budghetto.space"></input>
            <label htmlFor="password">
              Password
            </label>
            <input type="password" id="password" pattern="^.{3,}$"></input>
            <label htmlFor="repassword">
              Retype password
            </label>
            <input type="password" id="repassword"></input>
            <input type="submit" id="submit" value="Sign up"></input>
          </form>
          <input type="button" id="cancel" value="Cancel" onClick={ () => browserHistory.push('/') }/>
        </div>
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;

    if (!validator.validateRegistration(username, password, repassword)) {
      console.log("Invalid credentials");
      return;
    }

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
