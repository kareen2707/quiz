var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller'); //Subo a la carpeta routes y accedo a donde esta quiz_controller
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
//Introducimos /question y /ckeck
/*router.get('/question', quizController.question);
router.get('/check', quizController.check);*/
router.get('/quizzes', quizController.index);
router.get('/quizzes/:quizId(\\d+)', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

module.exports = router;
