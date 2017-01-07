const easyPbkdf2 = require("easy-pbkdf2")();

const models = require('../models.js');

require('promise');

module.exports = {
  createPassAndHash: function(password) {
    return new Promise(function (resolve, reject) {
      easyPbkdf2.secureHash(password, function(err, passwordHash, newSalt) {
        resolve({password: passwordHash, salt: newSalt});
      });
    });
  },

  verifyPassword: function(password, hash, salt) {
    return new Promise(function (resolve, reject) {
      easyPbkdf2.verify(salt, hash, password, function( err, valid ) {
        if (err) {
          reject(err);
        } else {
          resolve(valid);
        }
      });
    });
  }
};
