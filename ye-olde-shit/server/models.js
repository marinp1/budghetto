'use strict';

const Sequelize = require('sequelize');
const fs        = require('fs');
const path      = require('path');
const modelPath = path.join(__dirname, "models");

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

const db = {};

fs
  .readdirSync(modelPath)
  .filter(function(file) {
    return (file.indexOf(".") !== 0);
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(modelPath, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
