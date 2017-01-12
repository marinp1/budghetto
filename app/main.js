require("./Assets/style.scss");

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const browserHistory = ReactRouter.browserHistory;

import App from './App.js';
import Login from './Login.js';
import Register from './Register.js';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/app" component={App}/>
    <Route path="/register" component={Register}/>
  </Router>
), document.getElementById('app'));
