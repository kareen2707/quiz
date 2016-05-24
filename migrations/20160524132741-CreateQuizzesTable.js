'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.createTable(
    'Quizzes',
    {id: {type: Sequelize.INTEGER, allowNull:false, primaryKey:true, autoIncrement: true, unique: true},
    question: {type: Sequelize.STRING, validate: {notEmpty:{msg: "Falta pregunta"} } },
    answer: {type: Sequelize.STRING, validate: {notEmpty:{msg: "Falta respuesta"} } },
    createdAt: {type: Sequelize.DATE , allowNull: false},
    updatedAt: {type: Sequelize.DATE , allowNull: false}
    },
    { sync: {force:true}} //los cambios deben forzarse al arrancar la aplicación
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Quizzes');
  }
};
