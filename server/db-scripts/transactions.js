'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {

  // TODO: Add bankaccount, category and useraccount
  add: function(params, callback) {
    models.Transaction.create({
      date: params.date,
      amount: parseFloat(params.amount).toFixed(2),
      description: params.description,
      stakeholder: params.stakeholder
    }).then(function() {
      callback();
    });
  },

  // Returns all transactions between from and to dates (inclusive)
  get: function(filter, callback) {
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
