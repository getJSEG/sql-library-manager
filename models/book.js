'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Please Enter A Title'} }
    },
    author: {
      type: DataTypes.STRING,
      validate: { notEmpty: {msg: 'Please Enter A Author'}}
    },
    genre: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Please Enter A Genre'}}
    },
    year: {
      type: DataTypes.INTEGER,
      validate: { isInt: { msg: "Please Enter A valid Year" }  }
    }
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
