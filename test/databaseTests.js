const chai = require('chai').use(require('chai-as-promised'));
const should = chai.should();
const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

const dataImporter = require(path.join(__dirname, "../init-scripts/import-test-data.js"));
const userAccountManager = require(path.join(__dirname, "../server/db-scripts/userAccountManager.js"));

let models;
let db = {};

models = require('../server/models.js');

describe('Database initialisation', function() {

  before(function(done) {

    dataImporter.importData(models).then(function () {

      db.userAccount = models.UserAccount;
      db.bankAccount = models.BankAccount;
      db.category = models.Category;
      db.transaction = models.Transaction;

      done(null);

    }, function(err) {
      done(err);
    });
  });

  it('should have created some data', function() {
    Object.keys(db).forEach(function(modelName) {
      db[modelName].count().should.eventually.be.above(0);
    });
  });

  describe('Creating a new client', function() {

    let userAccountCount = 0;

    before(function(done) {
      // Get number of user accounts
      db.userAccount.count().then(function(c) {
        userAccountCount = c;
      }).then(function() {
        done();
      });
    });

    // Create new user
    it('should be possible', function() {
      return userAccountManager.createNewUserAccount('testuser@test.com', 'testisalasana').should.be.fulfilled;
    });

    it('should allow logging in with correct password', function() {
      return userAccountManager.verifyUserCredentials('testuser@test.com', 'testisalasana').should.be.fulfilled;
    });

    it('should deny other passwords', function() {
      return userAccountManager.verifyUserCredentials('testuser@test.com', 'invalid password').should.be.rejected;
    });

  });

  describe('Editing existing client', function() {

    const oldId = "tiivi.taavi@budghetto.space";
    const targetId = 'peikko@muumi.laakso';

    // Change oldId to targetId
    before(function(done) {
      db.userAccount.update({
        id: targetId
      }, {
        where: {
          id: oldId
        }
      }).then(function() {
        done(null);
      });
    });

    // There should be one row with the target id and none with the oldId
    it('should be possible', function() {
      db.userAccount.count({ where: ['id = ?', oldId] }).should.eventually.equal(0);
      db.userAccount.count({ where: ['id = ?', targetId] }).should.eventually.equal(1);
    });

    // The update should've edited all related foreign keys
    it('should propagate data forward', function() {

      // Loop through all tables except UserAccount
      Object.keys(db).forEach(function(modelName) {

        if (db[modelName] !== db.userAccount) {
          db[modelName].count({ where: ['UserAccountId = ?', targetId]}).should.eventually.be.above(0);
          db[modelName].count({ where: ['UserAccountId = ?', oldId]}).should.eventually.equal(0);
        }

      });

    });

  });

  describe('Deleting a client', function() {

    const targetId = 'peikko@muumi.laakso';

    // Delete client with targetId
    before(function(done) {
      db.userAccount.destroy({
          where: {
              id: targetId
          }
      }).then(function() {
        done();
      });
    });

    it ('should be possible', function() {
      db.userAccount.count({ where: ['id = ?', targetId]}).should.eventually.equal(0);
    });

    it ('should also delete associated data', function() {
      Object.keys(db).forEach(function(modelName) {

        if (db[modelName] !== db.userAccount) {
          db[modelName].count({ where: ['UserAccountId = ?', targetId]}).should.eventually.equal(0);
        }

      });
    });

  });

  describe('Deleting a category', function() {

    const destroyableId = 3;
    const nonDestroyableId = 4;

    it ('shouldn\'t be possible if there are transactions in the category', function() {
      return db.category.destroy({where: ['id = ?', nonDestroyableId]}).should.be.rejectedWith(models.sequelize.SequelizeForeignKeyConstraintError);
    });

    it ('should work otherwise', function() {
      return db.category.destroy({where: ['id = ?', destroyableId]}).should.be.fulfilled;
    });

  });

  describe('Bank account', function() {

    let testId;

    before(function(done) {
      db.bankAccount.build({
        name: 'Testitili',
        UserAccountId: 'hipsu@teletappi.space'
      }).save().then(function(res) {
        testId = res.id;
        done();
      });
    });

    it ('should have default initial value of 0', function() {

      db.bankAccount.findById(testId).then(function(bankAccount) {
        bankAccount.initialValue.should.equal(0);
        bankAccount.name.should.equal('Testitili');
        bankAccount.UserAccountId.should.equal('hipsu@teletappi.space');
      });

    });

    it ('should be deleteable only if there are no transactions linked to it', function() {

      const nonDestroyableId = 1;

      // Try to delete existing bank account with transactions
      db.bankAccount.destroy({where: ['id = ?', nonDestroyableId]}).should.be.rejectedWith(models.sequelize.SequelizeForeignKeyConstraintError);

      // Delete created bankAccount, it doesn't have any transactions
      db.bankAccount.destroy({where: ['id = ?', testId]}).should.be.resolved;

    });

  });

  describe('Transaction', function() {

    it ('should have a nonzero value', function() {
      return db.transaction.build({
        stakeholder: 'Testivastaanottaja',
        description: 'Testimaksu',
        date: '2017-02-20',
        amount: '0.0',
        UserAccountId: 'hipsu@teletappi.space',
        CategoryId: '2',
        BankAccountId: '1'
      }).save().should.be.rejectedWith(models.sequelize.SequelizeValidationError);
    });
  });

});
