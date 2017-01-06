'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize) {

  const userAccount = sequelize.define('UserAccount', {
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.CHAR(64),
      allowNull: false,
    },
    salt: {
      type: Sequelize.CHAR(64),
      allowNull: false,
    }
  }, {
    freezeTableName: true
  });

  userAccount.sync();

  const bankAccount = sequelize.define('BankAccount', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    currentValue: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    userAccountId: {
      type: Sequelize.STRING,
      references: {
        model: userAccount,
        key: 'email'
      }
    }
  }, {
    freezeTableName: true
  });

  bankAccount.sync();

  const category = sequelize.define('Category', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userAccountId: {
      type: Sequelize.STRING,
      references: {
        model: userAccount,
        key: 'email'
      }
    }
  }, {
    freezeTableName: true
  });

  category.sync();

  const transaction = sequelize.define('Transaction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    stakeholder: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        notZero: function(value) {
          if (parseFloat(value) == 0) {
            throw new Error('Transaction amount cannot be zero!');
          }
        }
      }
    },
    userAccountId: {
      type: Sequelize.STRING,
      references: {
        model: userAccount,
        key: 'email'
      }
    },
    categoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: category,
        key: 'id'
      }
    },
    bankAccountId: {
      type: Sequelize.INTEGER,
      references: {
        model: bankAccount,
        key: 'id'
      }
    }
  }, {
    freezeTableName: true
  });

  transaction.sync();

  return {
    userAccount: userAccount,
    bankAccount: bankAccount,
    category: category,
    transaction: transaction
  };
};
