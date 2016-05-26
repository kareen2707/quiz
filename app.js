var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var partials = require('express-partials');
var flash = require('express-flash');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var url = require('url');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret: "Quiz 2016", //semilla del cifrado de cookies
                resave: false,
                saveUninitialized: true}));
app.use(methodOverride('_method',{methods:["POST","GET"]}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(flash());

// Helper dinamico:
app.use(function(req, res, next) {

   // Hacer visible req.session en las vistas
   res.locals.session = req.session;
  
   next();
});

// Autologout
app.use(function(req, res, next) {
if (req.session.user) {
// Check if time is out
console.log("sessionStart: " + req.session.user.sessionStart );
console.log("DeltaTime: " + (new Date().getTime() - req.session.user.sessionStart) );
if (req.session.user.sessionStart && ((new Date().getTime() - req.session.user.sessionStart) > 120000)) {
// Logout logged user
req.session.user = undefined;
req.flash("error", "User was logged out for inactivity");
console.log("------------------User was logged out--------------------");
} else {
// Restart time
req.session.user.sessionStart = new Date().getTime();
}

}
next();
});


app.use('/', routes);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
