"use strict";

module.exports = function(sequelize, DataTypes) {

  const Category = sequelize.define('Category', {
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
    }
  },
  {
    classMethods: {
      associate: function(models) {

        Category.belongsTo(models.UserAccount, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        });

        Category.hasMany(models.Transaction, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        });

      }
    },
    freezeTableName: true,
    tableName: 'Category',
  });

  Category.drop();

  return Category;

};
