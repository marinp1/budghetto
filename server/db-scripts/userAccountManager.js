'use strict';

const easyPbkdf2 = require("easy-pbkdf2")();

const models = require('../models.js');
const categoriesDb = require('./category-functions.js');
const bankAccountsDb = require('./bankaccount-functions.js');

require('promise');

module.exports = {

  createNewUserAccount: function(username, password) {
    return new Promise(function(resolve, reject) {
      // TODO: This could also be moved to Register.js after API interface is not open to everyone
      if(username.length > models.UserAccount.tableAttributes.id.type._length) {
        reject(new Error("Username too long: " + username));
      } else {
        easyPbkdf2.secureHash(password, function(err, passwordHash, newSalt) {
          models.UserAccount.create({
            id: username,
            password: passwordHash,
            salt: newSalt
          }).then(function(res) {
            categoriesDb.create(username, 'Default');
            bankAccountsDb.create(username, 'Default');
            resolve(true);
          }, function(err) {
            reject(err);
          });
        });
      }
    });
  },

  verifyUserCredentials: function(username, password) {
    return new Promise(function(resolve, reject) {
      models.UserAccount.findById(username).then(function(userAccount) {
        easyPbkdf2.verify(userAccount.salt, userAccount.password, password, function( err, valid ) {
          if (!valid) {
            reject(new Error("Invalid username/password combination!"));
          } else if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  }

};
