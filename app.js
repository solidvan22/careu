var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var mongoDB = require('./database/mongo_init');
var fileUpload = require('express-fileupload');
var auth = require('./authentication');

//configuration --  view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  next();
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
let publicpath = path.join(__dirname, 'public', 'careu', 'app')
console.log('Public path >>>', publicpath)
app.use(express.static(publicpath));
app.use(fileUpload());

//---------- This is our work space -------
// Test db connection 
var db = mongoDB.getDb();


var indexRouter     = require('./routes/index');
var usersRouter     = require('./routes/users');
var postsRouter     = require('./routes/posts');
var loginRouter     = require('./routes/login');
var registerRouter  = require('./routes/register');
var middlewareSession = require('./routes/session');


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{layout:false});
});

//var loginRouter = require('./routes/login')

app.use('/login', loginRouter);
app.use('/register', registerRouter);

//-----verify access token middleware ---
app.use( middlewareSession);

//--- protetected routes ----
app.use('/', indexRouter);
app.use('/users', usersRouter)
app.use('/posts', postsRouter)

//---------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;