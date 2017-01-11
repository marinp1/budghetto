'use strict';

const easyPbkdf2 = require("easy-pbkdf2")();

const models = require('../models.js');

require('promise');

module.exports = {

  createNewUserAccount: function(username, password) {
    return new Promise(function(resolve, reject) {

      easyPbkdf2.secureHash(password, function(err, passwordHash, newSalt) {
        models.UserAccount.build({
          id: username,
          password: passwordHash,
          salt: newSalt
        }).save().then(function(res) {
          resolve(true);
        }, function(err) {
          reject(err);
        });
      });

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
