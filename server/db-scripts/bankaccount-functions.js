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
  },

  get: function(filter) {
    return new Promise(function(resolve, reject) {
      models.BankAccount.findAll({
        where: {
          UserAccountId: filter.who
        }
      }).then(function(found) {
        resolve(found);
      }, function(err) {
        reject(err);
      });
    });
  },

  update: function(params) {
    return new Promise(function(resolve, reject) {
      if(checkParams(params)) {
        models.BankAccount.update({
            name: params.name,
            initialValue: params.initialValue
          }, { where: { id: params.id }
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
      } else {
        reject(new Error("Given parameters are not acceptable"));
      }
    });
  }
};

// Function for checking if given parameters are acceptable
function checkParams(params) {
  return params.name.length <= models.BankAccount.tableAttributes.name.type._length;
}
