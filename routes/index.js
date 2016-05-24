var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller'); //Subo a la carpeta routes y accedo a donde esta quiz_controller
var commentController = require('../controllers/comment_controller');
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

//Deifinición de rutas de quizzes
router.get('/quizzes.:format?', quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/new', quizController.new);
router.post('/quizzes',quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizzes/:quizId(\\d+)', quizController.update);
router.delete('/quizzes/:quizId(\\d+)', quizController.destroy);
router.get('/quizzes/search' , quizController.search);

//Definición de rutas de comments
router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
