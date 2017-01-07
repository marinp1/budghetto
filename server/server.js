const express = require('express');
const compression = require('compression');

const app = express();
const path = require('path');
const port = process.env.PORT || 4040;

const content_path = path.join(__dirname, './../build');

const Sequelize = require('sequelize');
let models;

let sequelize;

// Select correct database
if ( process.env.DATABASE_URL != undefined ) {
  sequelize = new Sequelize( process.env.DATABASE_URL );
} else {
  sequelize = new Sequelize('sequelize', '', '', {
   dialect: 'sqlite',
   storage: path.join(__dirname, '../dev-resources/data.sqlite'),
   logging: false
  });
}

// Load models (also deletes all data)
models = require('../server/models.js');

// Load test data
const sequelize_fixtures = require('sequelize-fixtures');
const testPath = path.join(__dirname, "../init-scripts");

sequelize_fixtures.loadFile(path.join(testPath, 'test-data.json'), models).then(function () {
  console.log("Data loaded");
});

app.enable('trust proxy');
app.use(compression());

app.get('/', (req, res) => {
  res.header('Cache-Control', "max-age=60, must-revalidate, private");
  res.sendFile('index.html', {
    root: content_path
  });
});

app.use('/', express.static(content_path, {
    maxage: 31557600
}));

const server = app.listen(port,() => {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
