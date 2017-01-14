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

  create: function(user, name) {
    return new Promise(function(resolve, reject) {
      models.Category.create({
        UserAccountId: user,
        name: name
      }).save().then(function() {
        resolve();
      }, function(err) {
        reject(err);
      });
    });
  }
};
