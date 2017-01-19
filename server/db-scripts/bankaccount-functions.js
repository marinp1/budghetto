'use strict';

const models = require('../models.js');

module.exports = {
  create: function(user, name) {
    return new Promise(function(resolve, reject) {
      if (name.length > models.BankAccount.tableAttributes.name.type._length) {
        reject(new Error("Account name too long: " + name));
      } else {
        models.BankAccount.create({
          UserAccountId: user,
          name: name
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
      }
    });
  }
};
