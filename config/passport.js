let passport = require('passport');
let User = require('../models/user');
let localStrategy = require('passport-local').Strategy;
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt-nodejs')
 
// configuration passport
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user);
    });
});


// ----- cinfiguration for sign up ------
passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},(req, email, password, done)=>{
    req.checkBody('nickname', 'invalid nickname').notEmpty();
    req.checkBody('email', 'invalid email').notEmpty().isEmail(); // syntax from express validator START
    req.checkBody('password', 'invalid password').notEmpty().isLength({min: 4}); 
    let errors = req.validationErrors(); 
    if (errors){
        let messages = []
        errors.forEach((error)=>{
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages))
    } // syntax from express validator END

    User.findOne({'email': email}, (err, user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'email is already in use'});
        }
        let  newUser = new User();
        newUser.nickname = req.body.nickname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result)=>{
            if(err){
                return done(err);
            }
            return done(null, newUser)
        })
    })
}))


// ----- cinfiguration for sign in ------
passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},(req, email, password, done)=>{
    req.checkBody('email', 'invalid email').notEmpty().isEmail(); // syntax from express validator START
    req.checkBody('password', 'invalid password').notEmpty(); 
    let errors = req.validationErrors(); 
    if (errors){
        let messages = []
        errors.forEach((error)=>{
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages))
    } // syntax from express validator END
    User.findOne({'email': email}, (err, user)=>{
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'no user found'});
        }
        if (!bcrypt.compareSync(password, user.password)){
            console.log(user.password);  
            return done(null, false, {message: 'wrong password'});
        }
        return done(null, user)
    })
}))

// ============= jwtstrategy ==================//

var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('authorization'); 
    jwtOptions.secretOrKey = 'rahasia';
    passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
        User.getUserByEmail(jwt_payload.email, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                // console.log(user);
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        }); 
    }));





/*
hapus aja kalau udah berhasil mah

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('authorization'); 
    jwtOptions.secretOrKey = config.secret;
    passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
        // console.log(jwt_payload); 
        User.getUserByEmail(jwt_payload.email, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                // console.log(user);
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        }); 
    }));



*/