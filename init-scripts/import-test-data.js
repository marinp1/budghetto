'use strict';

const path = require('path');
const sequelize_fixtures = require('sequelize-fixtures');
const testDataPath = path.join(__dirname, "test-data.json");

module.exports = {
  importData: function importData(models) {

    return new Promise(function (resolve, reject) {
      models.UserAccount.drop();
      models.BankAccount.drop();
      models.Category.drop();
      models.Transaction.drop();

      resolve(sequelize_fixtures.loadFile(testDataPath, models));

    });
  }
};
