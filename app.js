var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var { randomBytes } = require('crypto');

var indexPage = require('./routes/index');
var registPage = require('./routes/register');
var loginPage = require('./routes/login');
var loginRouter = require('./auth/getuser');
var registRouter = require('./auth/adduser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: app.get('env') === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexPage);
app.use('/register', registPage);
app.use('/login', loginPage);
app.use('/auth/login', loginRouter);
app.use('/auth/register', registRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (req.path.startsWith('/auth/')) {
    var status = err.status || 500;
    return res.status(status).json({
      message: status >= 500 && req.app.get('env') !== 'development'
        ? 'An internal server error occurred.'
        : err.message
    });
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
