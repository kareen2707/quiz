var models = require ('../models');
var Sequelize = require ('sequelize');

//Autoload el quiz asociado a :userId
exports.load = function(req, res, next, userId){
	models.User.findById(userId)
	.then(function(user){
		if(user) {
			req.user = user;
			next();
		}
		else{
			req.flash('error','No existe usuario con id=' +id+ '.');
			throw new Error ('No existe userId=' +userId);
		}
	}).catch(function(error) {next(error);});
};

//GET /users
exports.index = function(req,res,next){
	models.User.findAll({order:['username']})
	.then(function(users){
		res.render('users/index.ejs', { users:users});
	}).catch(function(error){next(error);})
};

//GET /users/:id
exports.show = function (req, res, next){
	res.render('users/show',{user: req.user});
};

//GET /users/new
exports.new = function (req, res, next){
	var user = models.User.build({username:"",password:""});
	res.render('users/new', {user:user});
};
 //POST /users
exports.create = function(req,res, next){
	var user = models.User.build({ username: req.body.user.username, password: req.body.user.password});
	//El login debe ser único
	models.User.find({where:{username: req.body.user.username}})
	.then(function(existing_user){
		if(existing_user){
			var emsg = "El usuario \"" +req.body.user.username + "\" ya existe.";
			req.flash('error',emsg);
			res.render('users/new',{user:user});
		}
		else{
			return user.save({fields: ["username","password","salt"]})
			.then(function(user){
				req.flash('success','Se ha creado un nuevo usuario!');
				res.redirect('/users');
			})
			.catch(Sequelize.ValidationError, function(error){
				req.flash('error','Error al crear usuario:');
				for (var i in error.errors){
					req.flash('error',error.errors[i].value);
				};
				res.render('users/new', {user:user});
			});
		}
	})
	.catch(function(error){
		next(error);
	});
};
//DELETE /users/:id
exports.destroy = function(req, res, next){
	req.user.destroy().then(function(){
		req.flash('success','Usuario eliminado con éxito');
		res.redirect('/users');
	}).catch(function(error){
		next(error);
	});
};

//GET /users/:id/edit
exports.edit = function(req, res, next){
	var user = req.user;
	res.render('users/edit',{user:user});
};

// PUT /users/:id
exports.update = function(req, res, next) {

  req.user.password = req.body.user.question;
  if(!req.body.user.password){
  	var emsg= "El campo password está vacío";
  	req.flash('error', emsg);
  	return res.render('users/edit', {user: req.user});
  }
  req.user.save({fields: ["password", "salt"]})
    .then(function(user) {
	  req.flash('success', 'Usuario editado con éxito.');
      res.redirect('/users'); // Redirección HTTP a lista de preguntas.
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('users/edit', {user: req.user});
    })
    .catch(function(error) {
	  req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};