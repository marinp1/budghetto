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

let models;
let userAccount;
let bankAccount;
let category;
let transaction;

describe('Database initialisation', function() {

  before(function(done) {
    sequelize.sync({ force : true }).then(function() {
      models = require('../server/models.js');

      userAccount = models(sequelize).userAccount;
      bankAccount = models(sequelize).bankAccount;
      category = models(sequelize).category;
      transaction = models(sequelize).transaction;

      done(null);
    }, function(err) {
      done(err);
    });
  });

  describe('Table UserAccount', function() {
    it('should exist and be empty', function() {
      return userAccount.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table BankAccount', function() {
    it('should exist and be empty', function() {
      return bankAccount.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table Category', function() {
    it('should exist and be empty', function() {
      return category.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });

  describe('Table Transaction', function() {
    it('should exist and be empty', function() {
      return transaction.count().then(function(count) {
        count.should.equal(0);
      });
    });
  });
});
