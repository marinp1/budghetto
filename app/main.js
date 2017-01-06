require("./Assets/style.scss");

const React = require('react');
const ReactDOM = require('react-dom');

const App = require('./App.js');
const AppElem = React.createElement(App);

ReactDOM.render(AppElem, document.getElementById('app'));
