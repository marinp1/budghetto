'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {
  transactions: function(filter, callback) {
    models.Transaction.findAll({
      where: {
        date: {
          gte: new Date(filter.from).toISOString(),
          lte: new Date(filter.to).toISOString()
        }
      }
    }).then(function(found) {
      callback(found);
    });
  }
};
