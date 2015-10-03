var express = require('express');
var router = express.Router();
var Todo = require('../models/farmers');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

var authenticate = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  console.log('FARMERS:index');
  var farmers = global.currentFarmer;
  res.render('farmers/index', { farmers: farmers, message: req.flash() })
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var farmer = {
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: Number
      },
    farm_name: String,
    details: {
      products: [],
      organic: Boolean
    }
  };
  res.render('farmers/new', { farmer: farmer, message: req.flash() });
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  res.render('farmers/show', { farmer: farmer, message: req.flash() } );
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  res.render('farmers/edit', { farmer: farmer, message: req.flash() } );
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var farmer = {
    name: req.body.name,
    email: req.body.email,
    address: {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode
    },
    farm_name: req.body.farm_name,
    details: {
      organic: req.body.organic ? true : false
    }
  };
  currentFarmer.save(function (err) {
    if (err) return next(err);
    // Check redirect
    res.redirect('/farmers');
  });
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  else {
    farmer.name = req.body.name;
    farmer.email = req.body.email;
    farmer.address.street = req.body.street;
    farmer.address.city = req.body.city;
    farmer.address.state = req.body.state;
    farmer.address.zipcode = req.body.zipcode;
    farmer.farm_name = req.body.farm_name;
    farmer.details.organic = req.body.organic ? true : false;

    currentFarmer.save(function(err) {
      if (err) return next(err);
      // Check redirect
      res.redirect('/farmers');
    });
  }
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  // TODO: May need to also delete/destroy 'user' session
  farmer.findByIdAndRemove(farmer, function(err) {
    if (err) return next(err);
    res.redirect('/farmers');
  });
});

module.exports = router;
