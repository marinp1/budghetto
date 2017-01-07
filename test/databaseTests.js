require('chai').should();

const Sequelize = require('sequelize');
const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

const sequelize_fixtures = require('sequelize-fixtures');
const testPath = path.join(__dirname, "../init-scripts");

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

// TODO: Make a more meaningful test
const targetCounts = {
  "UserAccount": 2,
  "BankAccount": 2,
  "Category": 5,
  "Transaction": 5
};

models = require('../server/models.js');

describe('Database initialisation', function() {

  before(function(done) {

    sequelize_fixtures.loadFile(path.join(testPath, 'test-data.json'), models).then(function () {

      userAccount = models.UserAccount;
      bankAccount = models.BankAccount;
      category = models.Category;
      transaction = models.Transaction;

      done(null);

    }, function(err) {
      done(err);
    });
  });

  describe('Table UserAccount', function() {
   it('should have correct number of elements', function() {
     return userAccount.count().then(function(count) {
       count.should.equal(targetCounts.UserAccount);
     });
   });
  });

  describe('Table BankAccount', function() {
   it('should have correct number of elements', function() {
     return bankAccount.count().then(function(count) {
       count.should.equal(targetCounts.BankAccount);
     });
   });
  });

  describe('Table Category', function() {
   it('should have correct number of elements', function() {
     return category.count().then(function(count) {
       count.should.equal(targetCounts.Category);
     });
   });
  });

  describe('Table Transactions', function() {
   it('should have correct number of elements', function() {
     return transaction.count().then(function(count) {
       count.should.equal(targetCounts.Transaction);
     });
   });
  });

});
