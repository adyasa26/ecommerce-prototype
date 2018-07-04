let express = require('express');
let router = express.Router();
let passport = require('passport');
let jwt = require('jsonwebtoken');
let Product = require('../models/product');
let Cart = require('../models/cart');
let flash = require('connect-flash');
let Order = require('../models/order');

/* GET home page. */

// set account management for menu at main header with midleware
router.use((req, res, next)=>{
  res.locals.login = req.cookies.jtoken;
  res.locals.session = req.session;
  next();
})

router.get('/',gettokenname, function(req, res, next) {
  Product.find((err, docs)=>{
    let successMsg = req.flash('success')[0];
    let data = req.authData.nickname
    let productChunks = []
    console.log(successMsg);
    
    productChunks.push(docs.slice());
    res.render('shop/index', { 
      title: 'Dua Enam Market', 
      shoes: productChunks,
      name: data,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
  
});

router.get('/add-to-cart/:id', (req, res, next)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : [{}]);

  Product.findById(productId, (err, product)=>{
    if(err){
      return res.redirect('/');
    }
    console.log(product.qty);
    cart.add(product, product.id)
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
})

router.get('/shooping-cart',gettokenname,(req, res, next)=>{
  if(!req.session.cart){
    return res.render('shop/shooping-cart', {products:null})
  }
  let data = req.authData.nickname
  let cart = new Cart(req.session.cart);
  res.render('shop/shooping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, name: data})
})

router.get('/checkout',gettokenname, (req,res,next)=>{
  if(!req.session.cart){
    return res.render('shop/shooping-cart', {products:null})
  }
  let cart = new Cart(req.session.cart);
  let errMsg = req.flash('error')[0];
  let data = req.authData.nickname
  res.render('shop/checkout', {total: cart.totalPrice, name:data, errMsg:errMsg, noError:!errMsg});
})

router.post('/checkout',gettokenname,(req, res, next)=>{
  if(!req.session.cart){
    return res.render('shop/shooping-cart', {products:null})
  }
  let cart = new Cart(req.session.cart);
  let data = req.authData.nickname
  var stripe = require("stripe")(
    "sk_test_fsiOUpWHXtcEOpX4pLvI8Nv6"
  );
  
  stripe.charges.create({
    amount: cart.totalPrice * 1000,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "test charge"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      // console.log( err);
      req.flash('error', err.message);
      return res.redirect('/checkout')
    }
    // let order = new Order({
    //   user: req.user,
    //   cart: cart,
    //   address : req.body.address,
    //   name: req.body.name,
    //   paymentId: charge.id
    // });
    let order = new Order();
    order.user = req.user;
    order.cart = cart;
    // order.address = req.body.address;
    order.nama = data;
    order.paymentId = charge.id
    console.log(order);
    order.markModified('user')
    order.markModified('cart')
    order.save((err, result)=>{
      req.flash('success','NTAPS ! Succesfully bought product, shikat lagi ?');
      req.session.cart = null;
      res.redirect('/');
    })
  })
})



module.exports = router;

function gettokenname(req, res, next) {
  jwt.verify(req.cookies.jtoken, 'rahasia', (err, authData) => {
    if (err) { 
      req.authData = ''
      next();
    }
    else {
      req.authData = authData 
      next();
    }
  })
}