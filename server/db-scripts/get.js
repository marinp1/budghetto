'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {
  transactions: function(filter, callback) {
    models.Transaction.findAll({
      where: {
        date: {
          $gte: new Date(filter.from),
          $lte: new Date(filter.to)
        }
      },
      order: [['date', 'DESC']]
    }).then(function(found) {
      callback(found);
    });
  }
};
