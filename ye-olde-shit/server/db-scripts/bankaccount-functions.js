'use strict';

const models = require('../models.js');

module.exports = {
  create: function(params) {
    return new Promise(function(resolve, reject) {
      if (params.name.length > models.BankAccount.tableAttributes.name.type._length) {
        reject(new Error("Account name too long: " + name));
      } else {
        models.BankAccount.create({
          UserAccountId: params.who,
          name: params.name,
          initialValue: params.initialValue
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
  },

  delete: function(id) {
    return new Promise(function(resolve, reject) {
      models.Transaction.destroy({
        where: {
          BankAccountId: id
        }
      }).then(function() {
        models.BankAccount.destroy({
          where: {
            id: id
          }
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
      }, function(err) {
        reject(err);
      });
    });
  }
};

// Function for checking if given parameters are acceptable
function checkParams(params) {
  return params.name.length <= models.BankAccount.tableAttributes.name.type._length;
}
