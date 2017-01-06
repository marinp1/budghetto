const React = require('react');
const render = require('react-dom');

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Hello world</p>
      </div>
    );
  }
}
