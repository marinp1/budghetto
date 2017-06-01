'use strict';

const models = require('../models.js');

module.exports = {
  get: function(filter) {
    return new Promise(function(resolve, reject) {
      models.Category.findAll({
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

  create: function(params) {
    return new Promise(function(resolve, reject) {
      if (params.name.length > models.Category.tableAttributes.name.type._length) {
        reject(new Error("Account name too long: " + name));
      } else {
        models.Category.create({
          UserAccountId: params.who,
          name: params.name
        }).then(function() {
          resolve();
        }, function(err) {
          reject(err);
        });
      }
    });
  },

  delete: function(id) {
    return new Promise(function(resolve, reject) {
      models.Transaction.destroy({
        where: {
          CategoryId: id
        }
      }).then(function() {
        models.Category.destroy({
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
