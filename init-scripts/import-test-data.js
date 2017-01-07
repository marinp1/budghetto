'use strict';

const path = require('path');
const sequelize_fixtures = require('sequelize-fixtures');
const testDataPath = path.join(__dirname, "test-data.json");

module.exports = {
  importData: function importData(models) {

    return new Promise(function (resolve, reject) {

      models.UserAccount.drop().then(function() {
        models.BankAccount.drop();
      }).then(function() {
        models.Category.drop();
      }).then(function() {
        models.Transaction.drop();
      }).then(function() {
        resolve(sequelize_fixtures.loadFile(testDataPath, models));
      });
      
    });
  }
};
