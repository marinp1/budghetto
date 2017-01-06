require("./Assets/style.scss");

const React = require('react');
const ReactDOM = require('react-dom');

import App from './App.js';
const AppElem = React.createElement(App);

ReactDOM.render(AppElem, document.getElementById('app'));
