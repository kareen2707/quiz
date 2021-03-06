var path = require('path');

//Cargar Modelo ORM
var Sequelize = require("sequelize");

//Usar BBDD Sqlite en Heroku
/*var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

 var DATABASE_PROTOCOL = url[1];
 var DATABASE_DIALECT = url[1];
 var DATABASE_USER = url[2];
 var DATABASE_PASSWORD = url[3];
 var DATABASE_HOST = url[4];
 var DATABASE_PORT = url[5];
 var DATABASE_NAME = url[6];
 var DATABASE_STORAGE = process.env.DATABASE_URL;
 var sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
     dialect: DATABASE_DIALECT,
     protocol: DATABASE_PROTOCOL,
     port: DATABASE_PORT,
     host: DATABASE_HOST,
     storage: DATABASE_STORAGE,
     omitNULL: true
 });*/

//Usar BBDD Sqlite en mi máquina
var sequelize = new Sequelize(null, null, null, {
    dialect: "sqlite",
    storage: "quiz.sqlite",
    omitNull: true
});


//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

//Importar la definición de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

//Importar la definición de la tabla Users de users.js
var User = sequelize.import(path.join(__dirname, 'user'));

//Relacion entre Quiz - Comment 1:N

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
Comment.belongsTo(User, {
    as: 'Author',
    foreignKey: 'AuthorId'
});

//Relación entre User - Quizz 1:N
User.hasMany(Quiz, {
    foreignKey: 'AuthorId'
});
Quiz.belongsTo(User, {
    as: 'Author',
    foreignKey: 'AuthorId'
});


exports.Quiz = Quiz; //exporta la deifinición de la tabla Quiz
exports.Comment = Comment;
exports.User = User;
