'use strict';

const moment = require('moment');

const models = require('../models.js');

module.exports = {

  // TODO: Add bankaccount
  add: function(params) {
    return new Promise(function(resolve, reject) {
      models.Category.findAll({
        where: {
          UserAccountId: params.who,
          name: params.category
        }
      }).then(function(category) {
        models.Transaction.create({
          date: params.date,
          amount: parseFloat(params.amount).toFixed(2),
          description: params.description,
          stakeholder: params.stakeholder,
          CategoryId: category[0].id,
          UserAccountId: params.who
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
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
          },
          UserAccountId: filter.who
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

  update: function(data) {
    return new Promise(function(resolve, reject) {
      models.Category.findAll({
        where: {
          UserAccountId: data.who,
          name: data.category
        }
      }).then(function(category) {
        models.Transaction.update({
            date: data.date,
            amount: data.amount,
            description: data.description,
            stakeholder: data.stakeholder,
            CategoryId: category[0].id
          }, { where: { id: data.id }
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
      });
    });
  }
};
