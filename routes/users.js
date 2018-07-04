let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
// var Storage = require('session-storage')
let csrfProtection = csrf();
router.use(csrfProtection)

// set account management for menu at main header with midleware
router.use((req, res, next) => {
  res.locals.login = req.cookies.jtoken;
  res.locals.session = req.session;
  next();
})

router.get('/profile', isLonggedIn, gettokenname, (req, res, next) => {
  console.log(req.authData);
  let data = req.authData.nickname
  res.render('user/profile',{name:data});
});

router.get('/logout', isLonggedIn, (req, res, next) => {
  res.clearCookie('jtoken');
  res.redirect('/');
})

// router.use('/', notLonggedIn, (req, res, next) => {
//   next();
// });

router.get('/signup', (req, res, next) => {
  let messages = req.flash('error')
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/users/signin', // pasport js
  failureRedirect: '/users/signup', // pasport js
  failureFlash: true // bisa di custom untuk satu peringatan
}));

router.get('/signin', (req, res, next) => {
  let messages = req.flash('error')
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
})

// router.post('/signin', passport.authenticate('local.signin',{
//   successRedirect: '/users/profile',
//   failureRedirect: '/users/signin',
//   failureFlash: true // bisa di custom untuk satu peringatan
// }));

router.post('/signin', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      console.log(!err);
      return res.json({ succses: false, message: 'no user yes' })
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        var payload = user;
        let token = jwt.sign(payload.toJSON(), 'rahasia')
        res.cookie('jtoken', token);
        // res.json({succses:true, token:'bearer '+token, user})
        res.redirect('/users/profile')

      }
      else {
        return res.json({ succses: false, message: 'no kaga match' })
        res.redirect('/users/signin')
      }
    })
  })
})


module.exports = router;

// make a function to grouping route and protection it

// function isLonggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }

function isLonggedIn(req, res, next) {
  if (req.cookies.jtoken) {
    return next();
  }
  res.redirect('/');
}

function gettokenname(req, res, next) {
  jwt.verify(req.cookies.jtoken, 'rahasia', (err, authData) => {
    if (err) { res.sendStatus(403) }
    else {
      req.authData = authData 
      // return data;
      next();
      // console.log(authData);
      // res.render('user/profile')
    }
  })
}


function notLonggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/signin');
}
