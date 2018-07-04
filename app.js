let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let session = require('express-session');
let passport = require('passport');
let flash = require('connect-flash')
let validator = require('express-validator');
let mongoStore = require('connect-mongo')(session);

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

// setting mongoose 
mongoose.connect("mongodb://localhost/shooping");
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


// set express session with mongo connect
app.use(session({
  secret:'mysupersecreat', 
  resave: false, 
  useNewUrlParser : true,
  saveUninitialized:false, 
  cookie:{maxAge: 180 * 60 * 1000},
  store: new mongoStore({mongooseConnection : mongoose.connection})
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(7878,()=>{console.log('server is running');
})

module.exports = app;
