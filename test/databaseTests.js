const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-datetime'));
const should = chai.should();
const Q = require('q');

const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

const dataImporter = require(path.join(__dirname, "../init-scripts/import-test-data.js"));
const userAccountManager = require(path.join(__dirname, "../server/db-scripts/userAccountManager.js"));
const transactionsDb = require(path.join(__dirname, "../server/db-scripts/transaction-functions.js"));
const categoriesDb = require(path.join(__dirname, "../server/db-scripts/category-functions.js"));

let models;
let db = {};

models = require('../server/models.js');

function initDatabase(done) {
  dataImporter.importData(models).then(function () {
    done(null);

  }, function(err) {
    done(err);
  });
}

describe('DATABASE TESTS', function() {

  before(function(done) {
    initDatabase(done);
    db.userAccount = models.UserAccount;
    db.bankAccount = models.BankAccount;
    db.category = models.Category;
    db.transaction = models.Transaction;
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

    //TODO: Why is done needed?
    it ('should have default initial value of 0', function(done) {
      db.bankAccount.findById(testId).then(function(bankAccount) {
        bankAccount.initialValue.should.equal(0);
        bankAccount.name.should.equal('Testitili');
        bankAccount.UserAccountId.should.equal('hipsu@teletappi.space');
        done();
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

  describe('Get transactions', function() {
    // TODO: Just a bit of ghetto here, could be done better
    const categories = { id: ['0', '1'] };

    before(function(done) {
      initDatabase(done);
    });

    it ('should return all investments with default values', function() {
      const filter = { from: '1970-01-01', to: '9999-12-31', who: 'tiivi.taavi@budghetto.space', categories: categories };
      return transactionsDb.get(filter).should.eventually.have.lengthOf(3);
    });

    it ('should be inclusive with from date', function() {
      const filter = { from: '2017-01-10', to: '9999-12-31', who: 'tiivi.taavi@budghetto.space', categories: categories };
      return transactionsDb.get(filter).should.eventually.have.lengthOf(2);
    });

    it ('should be inclusive with to date', function() {
      const filter = { from: '1970-01-01', to: '2017-02-10', who: 'tiivi.taavi@budghetto.space', categories: categories };
      return transactionsDb.get(filter).should.eventually.have.lengthOf(3);
    });

    it ('should return empty if to date is before from date', function() {
      const filter = { from: '2017-03-01', to: '2017-01-01', who: 'tiivi.taavi@budghetto.space', categories: categories };
      return transactionsDb.get(filter).should.eventually.have.lengthOf(0);
    });

    it ('should return transactions in correct order', function() {
      const filter = { from: '1970-01-01', to: '9999-12-31' };

      return new Promise(function(resolve, reject) {
        db.transaction.build({
          date: new Date('2017-01-01'),
          amount: 3000.0,
          description: 'Testitransaktio',
          stakeholder: 'Testivastaanottaja'
        }).save().then(function() {
          transactionsDb.get(filter).then(function(found) {
            let prev = {};
            try {
              for(let i in found) {
                if (i > 0) {
                  prev = found[i-1];
                  if(prev.date.toISOString() === found[i].date.toISOString()) {
                    prev.createdAt.should.be.afterTime(found[i].createdAt);
                  } else {
                    prev.date.should.be.afterDate(found[i].date);
                  }
                }
              }
              resolve(true);
            } catch (err) {
              reject(err);
            }
          });
        });
      });
    });

  });

  describe('Delete transaction', function() {

    before(function(done) {
      initDatabase(done);
    });

    it ('should work correctly', function() {
      const testId = Math.floor(Math.random() * 5);
      transactionsDb.delete(testId);

      return Q.all([
        db.transaction.count({ where: { id: testId }}).should.eventually.equal(0),
        db.transaction.count().should.eventually.equal(4)
      ]);
    });

  });

  describe('Update transaction', function() {

    before(function(done) {
      initDatabase(done);
    });

    it ('should work correctly', function(done) {
      const testId = Math.floor(Math.random() * 3);
      const category = Math.random() > 0.5 ? 'Viihde' : 'Ruoka';

      transactionsDb.update({
        id: testId,
        date: '2017-08-29',
        amount: '1234.2',
        description: 'Testbusiness',
        stakeholder: 'Test company Oy',
        category: category,
        who: 'tiivi.taavi@budghetto.space'
      }).then(function() {
        db.transaction.findById(testId).then(function(transaction) {
          try {
            transaction.date.should.equalDate(new Date('2017-08-29'));
            transaction.amount.should.equal(1234.2);
            transaction.description.should.equal('Testbusiness');
            transaction.stakeholder.should.equal('Test company Oy');
            done(null);
          } catch(err) {
            done(err);
          }
        });
      });
    });

  });

  describe('Get categories', function() {

    it ('should work correctly', function() {
      const testId = Math.random() > 0.5 ? 'tiivi.taavi@budghetto.space' : 'hipsu@teletappi.space';
      const expected = testId === 'tiivi.taavi@budghetto.space' ? 2 : 3;
      const filter = { who: testId };
      return categoriesDb.get(filter).should.eventually.have.lengthOf(expected);
    });

  });

});
