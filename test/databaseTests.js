require('chai').should();

const Sequelize = require('sequelize');
const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

const dataImporter = require(path.join(__dirname, "../init-scripts/import-test-data.js"));

const userAccountManager = require(path.join(__dirname, "../server/db-scripts/userAccountManager.js"));

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
      db[modelName].count().then(function(c) {
        c.should.be.above(0);
      });
    });
  });

  describe('Creating a new client', function() {

    let userAccountCount = 0;

    before(function(done) {

      // Get number of user accounts
      db.userAccount.count().then(function(c) {
        userAccountCount = c;
      }).then(function() {

        userAccountManager.createPassAndHash("testisalasana").then(function(auth) {
          db.userAccount.build({
            id: "testuser@test.com",
            password: auth.password,
            salt: auth.salt
          }).save().then(function() {
            done(null);
          });
        });

      });
    });

    // There should be one more user account
    it('should be possible', function() {
      db.userAccount.count().then(function(count) {
        count.should.equal(userAccountCount + 1);
      });
    });

    it('should allow logging in with correct password', function() {
      db.userAccount.findById("testuser@test.com").then(function(userAccount) {
        userAccountManager.verifyPassword("testisalasana", userAccount.password, userAccount.salt).then(function(result) {
          result.should.equal(true);
        });
      });
    });

    it ('should deny other passwords', function() {
      db.userAccount.findById("testuser@test.com").then(function(userAccount) {
        userAccountManager.verifyPassword("invalid password", userAccount.password, userAccount.salt).then(function(result) {
          result.should.equal(false);
        });
      });
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
    it ('should be possible', function() {

      db.userAccount.count({ where: ['id = ?', oldId]}).then(function(c) {
        c.should.equal(0);
      });

      db.userAccount.count({ where: ['id = ?', targetId] }).then(function(c) {
        c.should.equal(1);
      });

    });

    // The update should've edited all related foregin keys
    it ('should propagate data forward', function() {

      // Loop through all tables except UserAccount
      Object.keys(db).forEach(function(modelName) {

        if (db[modelName] !== db.userAccount) {
          db[modelName].count({ where: ['UserAccountId = ?', targetId]}).then(function(c) {
            c.should.be.above(0);
          });

          db[modelName].count({ where: ['UserAccountId = ?', oldId]}).then(function(c) {
            c.should.equal(0);
          });

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
      db.userAccount.count({ where: ['id = ?', targetId]}).then(function(c) {
        c.should.equal(0);
      });
    });

    it ('should also delete associated data', function() {
      Object.keys(db).forEach(function(modelName) {

        if (db[modelName] !== db.userAccount) {
          db[modelName].count({ where: ['UserAccountId = ?', targetId]}).then(function(c) {
            c.should.equal(0);
          });
        }

      });
    });

  });

  describe('Deleting a category', function() {

    const destroyableId = 3;
    const nonDestroyableId = 4;

    it ('shouldn\'t be possible if there are transactions in the category', function(done) {

      const deleteFunction = new Promise(function(resolve, reject){
        db.category.destroy({where: ['id = ?', nonDestroyableId]}).then(function(res) {
          resolve();
        }, function(err) {
          reject(err);
        });
      });

      Promise.resolve(deleteFunction).then(function(res) {
        const err = new Error('Deletion was successful even though it shouldn\'t have been!');
        done(err);
      }).catch(function(err) {
        err.name.should.equal('SequelizeForeignKeyConstraintError');
        done();
      });

    });

    it ('should work otherwise', function() {
      db.category.destroy({where: ['id = ?', destroyableId]}).then(function() {
        db.category.count({ where: ['id = ?', destroyableId]}).then(function(c) {
          c.should.equal(0);
        });
      });
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

    it ('should be deleteable only if there are no transactions linked to it', function(done) {

      const nonDestroyableId = 1;

      // Try to delete existing bank account with transactions
      const deleteFunction = new Promise(function(resolve, reject){
        db.bankAccount.destroy({where: ['id = ?', nonDestroyableId]}).then(function(res) {
          resolve();
        }, function(err) {
          reject(err);
        });
      });

      Promise.resolve(deleteFunction).then(function(res) {
        const err = new Error('Deletion was successful even though it shouldn\'t have been!');
        done(err);
      }).catch(function(err) {
        err.name.should.equal('SequelizeForeignKeyConstraintError');
        done();
      });

      // Delete created bankAccount, it doesn't have any transactions
      db.bankAccount.destroy({where: ['id = ?', testId]}).then(function() {
        db.bankAccount.count({ where: ['id = ?', testId]}).then(function(c) {
          c.should.equal(0);
          done();
        });
      });

    });

  });

  describe('Transaction', function() {

    it ('should have a nonzero value', function(done) {
      db.transaction.build({
        stakeholder: 'Testivastaanottaja',
        description: 'Testimaksu',
        date: '2017-02-20',
        amount: '0.0',
        UserAccountId: 'hipsu@teletappi.space',
        CategoryId: '2',
        BankAccountId: '1'
      }).save().then(function(res) {
        const err = new Error("Transaction created successfully even though it shouldn't!");
        done(err);
      }).catch(function(err) {
        err.name.should.equal('SequelizeValidationError');
        done();
      });
    });

  });

});
