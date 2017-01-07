require('chai').should();

const Sequelize = require('sequelize');
const path = require('path');
const dbPath = '../dev-resources/data.sqlite';

const async = require('async');
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
let db = {};

models = require('../server/models.js');

describe('Database initialisation', function() {

  before(function(done) {

    sequelize_fixtures.loadFile(path.join(testPath, 'test-data.json'), models).then(function () {

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
        // Create new user account
        db.userAccount.build({
          id: "testuser@test.com",
          password: "9be8eb061d0cee44a7042d94edaf4a4d6557ed612f11a6b4c0520071cc70a28c",
          salt: "46cc1e91a3a0014705331a836703dea8d51e51b1e15c71011a4de5e4fc3d6c3f"
        }).save().then(function() {
          done(null);
        });
      });

    });

    // There should be one more user account
    it('should be possible', function() {
      db.userAccount.count().then(function(count) {
        count.should.equal(userAccountCount + 1);
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
        throw new Error('Deletion was successful even though it shouldn\'t have been!');
      }).catch(function(err) {
        err.name.should.equal('SequelizeForeignKeyConstraintError');
        done();
      });

    });

    it ('should work otherwise', function() {
      db.category.destroy({where: ['id = ?', destroyableId]}).then(function(res) {
        console.log(res);
      });
    });

  });

  describe('Bank account', function() {

    it ('should have default initial value of 0', function() {

    });

    it ('should be deleteable only if there are no transactions linked to it', function() {

    });

  });

  describe('Transaction', function() {

    it ('should have a nonzero value', function() {

    });

    it ('should default to current date', function() {

    });

  });

});
