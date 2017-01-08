'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {
  transaction: function(params, callback) {
    models.Transaction.create({
      date: params.date,
      amount: params.amount,
      description: params.description,
      stakeholder: params.stakeholder
    }).then(function() {
      callback();
    });
  }
};
