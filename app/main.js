require("./Assets/style.scss");

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const hashHistory = ReactRouter.hashHistory;

import App from './App.js';
import Login from './Login.js';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/login" component={Login}/>
    <Route path="/" component={App}/>
  </Router>
), document.getElementById('app'));
