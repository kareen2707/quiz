var models = require ('../models');
var Sequelize = require ('sequelize');
var url = require('url');
//var userController = require('./user_controller');

exports.loginRequired = function(req, res, next){
    if(req.session.user){ //inidica si el usuario se ha autenticado
        next();
    }
    else{
        res.redirect('/session?redir=' +(req.param('redir') || req.url));
    }
};

//GET/session --Formulario de login
exports.new = function (req, res, next){
    var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
    if(redir === '/session' || redir === '/users/new') {redir='/';}
    res.render ('session/new', {redir: redir});
};

//Promise que comprueba que la autentificación es correcta
var authenticate = function(login, password){
    return models.User.findOne({where: {username:login}})
    .then(function(user){
        if(user && user.verifyPassword(password)){return user;} //Autenticación correcta
        else{return null;} //Autenticación incorrecta
    });
};

//POST /session --Crear session
exports.create = function (req, res, next){
    var redir = req.body.redir || '/';
    var login = req.body.login;
    var password = req.body.password;

    authenticate(login, password)
    .then(function(user){
        if(user){ //Autenticacion correcta se crea la propiedad user en req.session
            req.session.user = {id:user.id , username: user.username, isAdmin: user.isAdmin};
            res.redirect(redir);
        }
        else{
            var emsg ="Error, la autentificación ha fallado. Por favor, intentelo de nuevo.";
            req.flash('error',emsg);
            res.redirect('/session?redir=' +redir);
        }
    })
    .catch(function(error){
        req.flash('error', 'Se ha producido un error:' +error);
        next(error);
    });
};

//DELETE /session ---Destruir sesion 
exports.destroy = function(req, res, next){
    delete req.session.user;
    res.redirect('/session');
};