"use strict";

module.exports = function(sequelize, DataTypes) {

  const UserAccount = sequelize.define('UserAccount', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    salt: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function(models) {

        UserAccount.hasMany(models.BankAccount, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

        UserAccount.hasMany(models.Category, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

        UserAccount.hasMany(models.Transaction, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          constraints: true
        });

      }
    },

    freezeTableName: true

  });

  UserAccount.drop();

  return UserAccount;

};
