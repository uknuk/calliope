var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    csurf = require('csurf'),
    Strategy = require('passport-json').Strategy,
    sslRedirect = require('heroku-ssl-redirect'),
    app = express();

passport.use(new Strategy(function(username, passwd, done) {
  if (!bcrypt.compareSync(passwd, process.env.HASH))
    return done(null, false);
  return done(null, true);
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session') ({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

//app.use(csurf());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/fonts')));

app.use(sslRedirect())

app.use('/', require('./routes'));
app.use('/api/events', require('./routes/events'));


/// Catch 404 and forward to error handler
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
