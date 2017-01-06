require('chai').should();

const Sequelize = require('sequelize');
const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

// Choose correct database
let sequelize;
if ( process.env.DATABASE_URL != undefined ) {
  sequelize = new Sequelize( process.env.DATABASE_URL );
} else {
  sequelize = new Sequelize('sequelize', '', '', {
   dialect: 'sqlite',
   storage: path.join(__dirname, dbPath),
   logging: false
  });
}

const models = require('../server/models.js');

describe('Database initialisation', function() {
  describe('Table UserAccount', function() {
    it('should exist and be empty', function() {
      const userAccount = models(sequelize).userAccount;
      return userAccount.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table BankAccount', function() {
    it('should exist and be empty', function() {
      const bankAccount = models(sequelize).bankAccount;
      return bankAccount.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table Category', function() {
    it('should exist and be empty', function() {
      const category = models(sequelize).category;
      return category.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table Transaction', function() {
    it('should exist and be empty', function() {
      const transaction = models(sequelize).transaction;
      return transaction.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });
});
