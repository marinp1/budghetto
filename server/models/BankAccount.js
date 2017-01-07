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
        BankAccount.belongsTo(models.UserAccount, {foreignKey: 'userAccountId'});
      }
    },
    freezeTableName: true,
    tableName: 'BankAccount',
  });

  BankAccount.drop();

  return BankAccount;

};
