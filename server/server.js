'use strict';

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionsDb = require('./db-scripts/transactions.js');
const userAccountManager = require("./db-scripts/userAccountManager.js");
const globals = require('../server/globals.js');

const ReactRouter = require('react-router');
const browserHistory = ReactRouter.browserHistory;

const app = express();
const path = require('path');
const port = process.env.PORT || 4040;

const content_path = path.join(__dirname, './../build');

let models;

// Load models
models = require('./models.js');

// Load test data
const dataImporter = require(path.join(__dirname, "../init-scripts/import-test-data.js"));

dataImporter.importData(models).then(function() {
  console.log("Data imported!");

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
    });
  });

  app.post('/api/addTransaction', cors(), (req, res) => {
    transactionsDb.add(req.body).then(function() {
      res.sendStatus(200);
    });
  });

  app.get('/api/deleteTransaction', cors(), (req, res) => {
    transactionsDb.delete(req.query.id).then(function() {
      res.sendStatus(200);
    });
  });

  app.get('/api/verifyUserCredentials', cors(), (req, res) => {
    userAccountManager.verifyUserCredentials(req.query.username, req.query.password).then(function(response) {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(403);
    });
  });

  app.use('/', express.static(content_path, {
      maxage: 31557600
  }));

  app.use('/favicon.ico', express.static(__dirname + 'app/Assets/favicon.ico'));

  const server = app.listen(port,() => {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  });

});
