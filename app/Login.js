import React from 'react';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="LoginScreen">
        <div id="loginForm">
          <h1>BUDGHETTO</h1>
          <form>
            <label for="username">
              Username
            </label>
            <input type="text" id="username"></input>
            <label for="password">
              Password
            </label>
            <input type="password" id="password"></input>
            <input type="submit" id="submit" value="Login"></input>
          </form>
        </div>
      </div>
    );
  }
}

export default React.createClass({
  render() {
    return <LoginScreen/>;
  }
});
