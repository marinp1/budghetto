'use strict';

const models = require('../models.js');

module.exports = {
  create: function(user, name) {
    return new Promise(function(resolve, reject) {
      models.BankAccount.create({
        UserAccountId: user,
        name: name
      }).then(function() {
        resolve();
      }, function(err) {
        reject(err);
      });
    });
  }
};
