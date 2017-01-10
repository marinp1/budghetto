'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {

  // TODO: Add bankaccount, category and useraccount
  add: function(params) {
    return new Promise(function(resolve, reject) {
      models.Transaction.create({
        date: params.date,
        amount: parseFloat(params.amount).toFixed(2),
        description: params.description,
        stakeholder: params.stakeholder
      }).then(function() {
        resolve(true);
      });
    });
  },

  // Returns all transactions between from and to dates (inclusive)
  get: function(filter) {
    return new Promise(function(resolve, reject) {
      models.Transaction.findAll({
        where: {
          date: {
            $gte: new Date(filter.from),
            $lte: new Date(filter.to)
          }
        },
        order: [['date', 'DESC']]
      }).then(function(found) {
        resolve(found);
      });
    });
  }
};
