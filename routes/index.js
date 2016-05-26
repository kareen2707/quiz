var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller'); //Subo a la carpeta routes y accedo a donde esta quiz_controller
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require ('../controllers/session_controller');
// GET home page. 
router.get('/', function(req, res) {
  res.render('index');
});

//GET author page.
router.get('/author', function(req,res){
	res.render('author');
});

//Autoload de rutas que usen :quizId
router.param('quizId',quizController.load);
//Autoload de rutas que usen :userId
router.param('userId',userController.load);
//Autoload de rutas que usen :commentId
router.param('commentId', commentController.load);

//Deifinición de rutas de quizzes
router.get('/quizzes.:format?', quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/new', sessionController.loginRequired, quizController.new);
router.post('/quizzes', sessionController.loginRequired , quizController.create);
/*router.get('/quizzes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)',sessionController.loginRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)',sessionController.loginRequired, quizController.destroy);*/
router.get('/quizzes/:quizId(\\d+)/edit',  	sessionController.loginRequired, 
										   	quizController.ownershipRequired, 
										   	quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       	sessionController.loginRequired, 
											quizController.ownershipRequired, 
											quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    	sessionController.loginRequired, 
											quizController.ownershipRequired, 
											quizController.destroy);
router.get('/quizzes/search' , quizController.search);

//Definición de rutas de comments
router.get('/quizzes/:quizId(\\d+)/comments/new',sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', sessionController.loginRequired,commentController.create);
//router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', sessionController.loginRequired,commentController.accept);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', 
	                                               sessionController.loginRequired, 
												   quizController.ownershipRequired, 
	                                               commentController.accept);

//Definición de rutas de users
router.get('/users', userController.index);
router.get('/users/:userId(\\d+)', userController.show);
router.get('/users/new', userController.new);
router.post('/users', userController.create);
/*router.get('/users/:userId(\\d+)/edit',sessionController.loginRequired ,userController.edit);
router.put('/users/:userId(\\d+)',sessionController.loginRequired, userController.update);
router.delete('/users/:userId(\\d+)',sessionController.loginRequired, userController.destroy);*/
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, 
										userController.ownershipRequired, 
										userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      sessionController.loginRequired, 
										userController.ownershipRequired, 
										userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired, 
										userController.ownershipRequired, 
										userController.destroy);  // borrar cuenta

//Definición de rutas de sesión
router.get('/session', sessionController.new);
router.post('/session', sessionController.create);
router.delete('/session', sessionController.destroy);

module.exports = router;
