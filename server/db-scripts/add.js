'use strict';

const moment = require('moment');

const models = require('../models.js');

// TODO: Add bankaccount, category and useraccount
module.exports = {
  transaction: function(params, callback) {
    models.Transaction.create({
      date: params.date,
      amount: parseFloat(params.amount).toFixed(2),
      description: params.description,
      stakeholder: params.stakeholder
    }).then(function() {
      callback();
    });
  }
};
