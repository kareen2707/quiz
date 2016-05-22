var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');

//GET /quizzes
exports.index = function(req,res,next){
	models.Quiz.findAll()
	.then(function(quizzes){
		res.render('quizzes/index.ejs', { quizzes:quizzes});
	}).catch(function(error){next(error);})
};
//GET /quizzes/:id
exports.show = function (req, res, next){
	models.Quiz.findById(req.params.quizId) //Busca la primera pregunta
	.then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			res.render('quizzes/show',{quiz: quiz, answer : answer});
		}
		else{
			throw new Error ('No hay preguntas en la BBDD.');
		}
	}).catch(function(error){ next(error);});	
};

//GET /quizzes/:id/check
exports.check = function(req, res, next) {
	models.Quiz.findById(req.params.quizId)
	.then(function(quiz){
		if(quiz){
		var answer = req.query.answer || '';
		var result = answer===quiz.answer ? 'Correcta' : 'Incorrecta';
		res.render('quizzes/result', {quiz:quiz, result : result, answer: answer});	
		}
		else{
			throw new Error ('No hay preguntas en la BBDD.');
		}
	}).catch(function(error){next(error);});	
};