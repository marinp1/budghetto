'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {

  create: function(params) {
    return new Promise(function(resolve, reject) {
      if (checkParams(params)) {
        models.Transaction.create({
          date: params.date,
          amount: parseFloat(params.amount).toFixed(2),
          description: params.description,
          stakeholder: params.stakeholder,
          BankAccountId: params.account,
          CategoryId: params.category,
          UserAccountId: params.who
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

  // Returns all transactions between from and to dates (inclusive)
  get: function(filter) {
    return new Promise(function(resolve, reject) {
      let categories = [];

      if (filter.categories != undefined) {
        if (filter.categories.id.length === 1) {
          categories = [filter.categories.id];
        } else {
          categories = filter.categories.id;
        }
      }

      let accounts = [];

      if (filter.accounts != undefined) {
        if (filter.accounts.id.length === 1) {
          accounts = [filter.accounts.id];
        } else {
          accounts = filter.accounts.id;
        }
      }

      models.Transaction.findAll({
        where: {
          date: {
            $gte: new Date(filter.from),
            $lte: new Date(filter.to)
          },
          UserAccountId: filter.who,
          CategoryId: {
            $in: categories
          },
          BankAccountId: {
            $in: accounts
          }
        },
        order: [['date', 'DESC'], ['createdAt', 'DESC']],
        include: [models.Category, models.BankAccount]
      }).then(function(found) {
        resolve(found);
      }, function(err) {
        reject(err);
      });
    });
  },

  delete: function(id) {
    return new Promise(function(resolve, reject) {
      models.Transaction.destroy({
        where: {
          id: id
        }
      }).then(function() {
        resolve();
      }, function(err) {
        reject(err);
      });
    });
  },

  update: function(params) {
    return new Promise(function(resolve, reject) {
      if(checkParams(params)) {
        models.Transaction.update({
            date: params.date,
            amount: params.amount,
            description: params.description,
            stakeholder: params.stakeholder,
            CategoryId: params.category,
            BankAccountId: params.account
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
  return params.description.length <= models.Transaction.tableAttributes.description.type._length &&
         params.stakeholder.length <= models.Transaction.tableAttributes.stakeholder.type._length;
}
