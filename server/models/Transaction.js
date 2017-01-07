"use strict";

module.exports = function(sequelize, DataTypes) {

  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    stakeholder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notZero: function(value) {
          if (parseFloat(value) == 0) {
            throw new Error('Transaction amount cannot be zero!');
          }
        }
      }
    }
  },
  {
    classMethods: {
      associate: function(models) {
        Transaction.belongsTo(models.UserAccount, {foreignKey: 'userAccountId'});
        Transaction.belongsTo(models.Category, {foreignKey: 'categoryId'});
        Transaction.belongsTo(models.BankAccount, {foreignKey: 'bankAccountId'});
      }
    },
    freezeTableName: true,
    tableName: 'Transaction',
  });

  Transaction.drop();

  return Transaction;

};
