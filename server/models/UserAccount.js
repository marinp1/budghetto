"use strict";

module.exports = function(sequelize, DataTypes) {

  const UserAccount = sequelize.define('UserAccount', {
    email: {
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

    freezeTableName: true,
    tableName: 'UserAccount',
  });

  UserAccount.drop();

  return UserAccount;

};
