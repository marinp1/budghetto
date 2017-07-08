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

        Transaction.belongsTo(models.UserAccount, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

        Transaction.belongsTo(models.Category, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

        Transaction.belongsTo(models.BankAccount, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

      }
    },

    freezeTableName: true

  });

  return Transaction;

};
