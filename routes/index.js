var express = require('express');
var passport = require('passport');
var router = express.Router();
var Farmer = require('../models/farmer');


var allProducts = {
  meats : [
    { label: 'Beef', name: 'beef' },
    { label: 'Chicken', name: 'chicken' },
    { label: 'Duck', name: 'duck' },
    { label: 'Lamb', name: 'lamb' },
    { label: 'Pork', name: 'pork' },
    { label: 'Rabbit', name: 'rabbit' },
    { label: 'Venison', name: 'venison' }
  ],
  produce : [
    { label: 'Apples', name: 'apples' },
    { label: 'Bananas', name: 'bananas' },
    { label: 'Carrots', name: 'carrots' },
    { label: 'Eggplant', name: 'eggplant' },
    { label: 'Figs', name: 'figs' },
    { label: 'Garlic', name: 'garlic' },
    { label: 'Lettuce', name: 'lettuce' },
    { label: 'Peppers', name: 'peppers' },
    { label: 'Pumpkin', name: 'pumpkin' },
    { label: 'Potatoes', name: 'potatoes' },
    { label: 'Spinach', name: 'spinach' },
    { label: 'Squash', name: 'squash' },
    { label: 'Tomatoes', name: 'tomatoes' },
    { label: 'Watermelon', name: 'watermelon' }
  ],
  otherProducts : [
    { name: 'eggs', label: 'Eggs' },
    { name: 'bread', label: 'Bread' },
    { name: 'milk', label: 'Milk' }
  ]
};

var standards = [
  { name: 'certified organic', label: 'Certified Organic'},
  { name: 'heirloom', label: 'Heirloom'},
  { name: 'naturally grown', label: 'Naturally Grown'} ,
  { name: 'grass fed', label: 'Grass Fed'},
  { name: 'grass finished', label: 'Grass Finished'}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  Farmer.find({}, function(err, farmers) {
    if (err) return console.log(err);
    else{
      res.render('index', { title: 'FARM CONNECT',
                          farmer: currentFarmer,
                          farmers: farmers,
                          allProducts: allProducts,
                          standards: standards
      });
    }
  });
});

// GET /signup
router.get('/signup', function(req, res, next) {
  res.render('signup.ejs', { message: req.flash() });
});

function signupAuthenticate(req, res, next) {
  var signUpStrategy = passport.authenticate('local-signup', {
    failureRedirect : '/signup',
    failureFlash : true
  });
  return signUpStrategy(req, res, next);
}

// POST /signup
router.post('/signup', signupAuthenticate, function(req, res, next) {
  if (req.user) {
    res.redirect('farmers/' + req.user._id + '/edit/');
  }
});

// GET /login
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash() });
});

function authenticate(req, res, next) {
  var loginProperty = passport.authenticate('local-login', {
    failureRedirect : '/login',
    failureFlash : true
  });
  return loginProperty(req, res, next);
}

// POST /login
router.post('/login', authenticate, function(req, res, next) {
  if (req.user) {
    res.redirect('/farmers/' + req.user._id);
  }
});

// GET /logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//GET /About
router.get('/about', function(req, res, next) {
  Farmer.find({}, function(err, farmers) {
    if (err) return console.log(err);
    else{
    res.render('about', {farmer: currentFarmer});
   }
  });
});

// Search
router.post('/search', function(req, res, next) {
  Farmer.find({}, function(err, farmers) {
    if (err) return console.log(err);
    else {
      var products = req.body.products;
      var standards = req.body.standards;

      // If any of the selections come back as srting, turn into array
      if (typeof products === 'string' && typeof standards === 'string') {
        products = [ products ];
        standards = [ standards ];
      }
      if (typeof products === 'string'){
        products = [ products ];
      }
      if (typeof standards === 'string') {
        standards = [ standards ];
      }

      if (products && standards) {
        Farmer.find({ 'products': { $in: products }, 'standards': { $in: standards } }, function(err, farmers) {
          farmers = farmers ? farmers : [];
        // console.log('farmers:', farmers);
          res.render('search', {farmers: farmers, farmer: currentFarmer });
        });
      }
      else if (standards) {

        console.log('standards: ' + standards)
        Farmer.find({ 'standards': { $in: standards } }, function(err, farmers) {
          farmers = farmers ? farmers : [];
          res.render('search', {farmers: farmers, farmer: currentFarmer });
        });
      }
      else {
        Farmer.find({ 'products': { $in: products } }, function(err, farmers) {
          farmers = farmers ? farmers : [];
        // console.log('farmers:', farmers);
          res.render('search', {farmers: farmers, farmer: currentFarmer });
        });
      }
      // Farmer.find({ 'products': { $in: products }, 'standards': { $in: standards } }, function(err, farmers) {
      //   farmers = farmers ? farmers : [];
      // // console.log('farmers:', farmers);
      //   res.render('search', {farmers: farmers, farmer: currentFarmer });
      // });
    }
  });
});


module.exports = router;
