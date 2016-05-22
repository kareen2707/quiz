var path = require ('path');

//Cargar Modelo ORM
var Sequelize = require("sequelize");

//Usar BBDD Sqlite
var sequelize = new Sequelize(null, null, null, {
dialect: "sqlite",
storage: "quiz.sqlite"
});

//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	return Quiz.count().then(function(c) {
		if (c === 0) {
		return Quiz.bulkCreate([{
			question: "Capital de Italia",
			answer: "Roma"
			}, 
			{
			question: "Capital de Portugal",
			answer: "Lisboa"
			}]).then(function() {
console.log("Base de datos inicialzada con datos");
});
}
});
}).catch(function(error) {
console.log("Error Sincronizando las tablas de la BD", error);
progress.exit(1);
});

exports.Quiz = Quiz; //exporta la deifinición de la tabla Quiz