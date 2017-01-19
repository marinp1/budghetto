'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {

  create: function(params) {
    return new Promise(function(resolve, reject) {
      models.BankAccount.findOne({
        where: {
          UserAccountId: params.who
        }
      }).then(function(bankAccount) {
        if (checkParams(params)) {
          models.Transaction.create({
            date: params.date,
            amount: parseFloat(params.amount).toFixed(2),
            description: params.description,
            stakeholder: params.stakeholder,
            BankAccountId: bankAccount.id,
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

      models.Transaction.findAll({
        where: {
          date: {
            $gte: new Date(filter.from),
            $lte: new Date(filter.to)
          },
          UserAccountId: filter.who,
          CategoryId: {
            $in: categories
          }
        },
        order: [['date', 'DESC'], ['createdAt', 'DESC']],
        include: [models.Category]
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
      if(checkParams()) {
        models.Transaction.update({
            date: params.date,
            amount: params.amount,
            description: params.description,
            stakeholder: params.stakeholder,
            CategoryId: params.category
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
  return params.description.length <= 255 &&
         params.stakeholder.length <= 255;
}
