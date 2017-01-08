'use strict';

const path = require('path');
const sequelize_fixtures = require('sequelize-fixtures');
const testDataPath = path.join(__dirname, "test-data.json");

let sequelize;
const Sequelize = require('sequelize');

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
module.exports = {
  importData: function importData(models) {

    return new Promise(function (resolve, reject) {

      // Ghetto solution, try to fix if possible
      try {
        models.UserAccount.drop().then(function() {
          models.BankAccount.drop();
        }).then(function() {
          models.Category.drop();
        }).then(function() {
          models.Transaction.drop();
        }).then(function() {
          resolve(sequelize_fixtures.loadFile(testDataPath, models));
        });
      } catch (err) {
        resolve(sequelize_fixtures.loadFile(testDataPath, models));
      }

    });
  }
};
