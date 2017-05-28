'use strict';

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionsDb = require('./db-scripts/transaction-functions.js');
const categoriesDb = require('./db-scripts/category-functions.js');
const accountsDb = require('./db-scripts/bankaccount-functions.js');
const userAccountManager = require("./db-scripts/userAccountManager.js");
const globals = require('../server/globals.js');

const ReactRouter = require('react-router');
const browserHistory = ReactRouter.browserHistory;

const app = express();
const path = require('path');
const port = process.env.PORT || 4040;

const content_path = path.join(__dirname, './../build');

const favicon = require('serve-favicon');

let models;

// Load models
models = require('./models.js');

// Load test data
const dataImporter = require(path.join(__dirname, "../init-scripts/import-test-data.js"));

dataImporter.importData(models).then(function() {
  console.log("Data imported!");

  app.use(favicon(path.join(__dirname,'../app','Assets','favicon.ico')));

  app.enable('trust proxy');
  app.use(compression());
  app.use(bodyParser.json());

  app.get('/', (req, res) => {

    if (globals.loggedInUserId != '') {
      browserHistory.push('app');
    }

    res.header('Cache-Control', 'max-age=60, must-revalidate, private');
    res.sendFile('index.html', {
      root: content_path
    });
  });

  app.get('/api/getTransactions', cors(), (req, res) => {
    transactionsDb.get(req.query).then(function(found) {
      res.send(found);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.post('/api/createTransaction', cors(), (req, res) => {
    transactionsDb.create(req.body).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.get('/api/deleteTransaction', cors(), (req, res) => {
    transactionsDb.delete(req.query.id).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.post('/api/updateTransaction', cors(), (req, res) => {
    transactionsDb.update(req.body).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.get('/api/verifyUserCredentials', cors(), (req, res) => {
    userAccountManager.verifyUserCredentials(req.query.username, req.query.password).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.get('/api/createNewUserAccount', cors(), (req, res) => {
    userAccountManager.createNewUserAccount(req.query.username, req.query.password).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });


  app.get('/api/getCategories', cors(), (req, res) => {
    categoriesDb.get(req.query).then(function(found) {
      res.send(found);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.get('/api/getAccounts', cors(), (req, res) => {
    accountsDb.get(req.query).then(function(found) {
      res.send(found);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.post('/api/updateAccount', cors(), (req, res) => {
    accountsDb.update(req.body).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.get('/api/deleteAccount', cors(), (req, res) => {
    transactionsDb.delete(req.query.id).then(function() {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.use('/', express.static(content_path, {
      maxage: 31557600
  }));

  const server = app.listen(port,() => {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  });

});
