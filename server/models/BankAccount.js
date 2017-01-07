"use strict";

module.exports = function(sequelize, DataTypes) {

  const BankAccount = sequelize.define('BankAccount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    initialValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    }
  },
  {
    classMethods: {
      associate: function(models) {

        BankAccount.belongsTo(models.UserAccount, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

        BankAccount.hasMany(models.Transaction, {
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
          constraints: true
        });

      }
    },

    freezeTableName: true

  });

  BankAccount.drop();

  return BankAccount;

};
