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
            <input defaultValue="newuser@budghetto.space" type="<strong>email</strong>" id="username"></input>
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
        </div>
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;

    if (username.trim() == '' || password.trim() == '') {
      console.log("Please type in both username and password");
      return false;
    }

    if (username == password) {
      console.log("Password cannot be username");
      return false;
    }

    if (password.trim() !== repassword.trim()) {
      console.log("Passwords do not match");
      return false;
    }

    // Check if user has done some ui hack to bypass email requirements
    // Prevents also use of html tags and therefore XSS attacks
    if (!new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").test(username)) {
      console.log("Nice hack you got there, guess what, your email is not legit");
      return false;
    }

    // TODO: Change to stronger pattern, currently only min. 3 characters is used
    // Check if user has done some ui hack to bypass password requirements
    if (!new RegExp("^.{3,}$").test(password)) {
      console.log("Nice hack you got there, guess what, your password is not legit");
      return false;
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
