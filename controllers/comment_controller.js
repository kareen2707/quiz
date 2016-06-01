var models = require('../models');
var Sequelize = require('sequelize');

exports.load= function(req, res, next, commentId){
	models.Comment.findById(commentId)
	.then(function(comment){
		if(comment){
			req.comment = comment;
			next();
		}
		else{
			next(new Error('No existe commentId:' +commentId));
		}
	})
	.catch(function(error){
		next: error;});
};

// GET /quizzes/:quizId/comments/new
exports.new = function(req, res, next) {
  var comment = models.Comment.build({text: ""});

  res.render('comments/new', { comment: comment, 
  	                           quiz: req.quiz
  	                         });
};


// POST /quizes/:quizId/comments
exports.create = function(req, res, next) {
  var comment = models.Comment.build(
      { text:   req.body.comment.text,          
        QuizId: req.params.quizId,
        autor: req.session.user.username
      });

  comment.save()
    .then(function(comment) {
      req.flash('success', 'Comentario creado con éxito.');
      res.redirect('/quizzes/' + req.quiz.id);
    }) 
	  .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('comments/new', { comment: comment,
      	                           quiz:    req.quiz});
    })
    .catch(function(error) {
      req.flash('error', 'Error al crear un Comentario: '+error.message);
		  next(error);
	  });    
};

exports.accept = function(req, res, next){
	req.comment.accepted = true;
	req.comment.save(["accepted"])
	.then(function(comment){
		req.flash('success', 'Comentario aceptado con éxito');
		res.redirect('/quizzes/' +req.params.quizId);
	})
	.catch(function(error){
		req.flash('error', 'Error al aceptar el comentario:' +error.message);
		next(error);
	});
};
exports.ownershipRequired = function(req,res,next){

	models.Quiz.find({
		where: {id: Number(req.comment.QuizId)}
	}).then(function(quiz){
		if(quiz){
			var objQuizOwner = quiz.UserId;////
			var logUser = req.session.user.id;
			var isAdmin = req.session.user.isAdmin;
			console.log(objQuizOwner, logUser, isAdmin);
			if(isAdmin ||objQuizOwner === logUser){			
				next();
			} else { res.redirect('/');}
		} else {next(new Error('No existe quizId='+ quizId));}
	}).catch(function(error){next(error)});

};