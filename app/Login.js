import React from 'react';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id ="loginForm">
        <p>Hello</p>
        <form>
          <label for="username">
            Username
          </label>
          <input type="text" id="username"></input>
        </form>
      </div>
    );
  }
}

export default React.createClass({
  render() {
    return <LoginScreen/>;
  }
});
