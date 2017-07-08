'use strict';

module.exports = {
  validateRegistration: function(username, password, repassword) {
    return password !== username &&
           password === repassword &&
           username.trim() !== '' &&
           password.trim() !== '' &&
           this.validatePassword(password) &&
           this.validateEmail(username);
  },

  validateLogin: function(username, password) {
    return password !== '' &&
           username !== '' &&
           this.validateEmail(username);
  },

  // TODO: Change to stronger pattern
  // Validate that password is at least three characters long
  validatePassword: function(password) {
    return new RegExp("^.{3,}$").test(password);
  },

  // Check that email is valid format
  validateEmail: function(email) {
    return new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").test(email);
  }
};
