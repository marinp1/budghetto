'use strict';

const path = require('path');
const sequelize_fixtures = require('sequelize-fixtures');
const testDataPath = path.join(__dirname, "test-data.json");

module.exports = {
  importData: function importData(models) {

    return new Promise(function (resolve, reject) {

      models.sequelize.sync({force: true}).then(function() {
        resolve(sequelize_fixtures.loadFile(testDataPath, models));
      });

    });
  }
};
