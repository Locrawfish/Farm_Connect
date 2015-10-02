var express = require('express');
var router = express.Router();
var farmer = require('../models/farmer');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  console.log('farmers:index');
  if (req.isAuthenticated()) {
    var farmer = global.currentFarmer.farmers;
    res.render('farmers/index', { farmers: farmers, message: req.flash() })
  }
  else {
    res.redirect('/');
  }
});

// NEW
router.get('/new', function(req, res, next) {
  if (req.isAuthenticated()) {
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
        };
    res.render('farmers/new', { farmer: farmer, message: req.flash() });
  }
  else {
    res.redirect('/');
  }
});

// SHOW
router.get('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    //var checked = farmer.completed ? 'checked' : '';
    res.render('farmers/show', { farmer: farmer, message: req.flash() } );
  }
  else {
    res.redirect('/');
  }
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    // var checked = farmer.completed ? 'checked' : '';
    res.render('farmers/edit', { farmer: farmer, message: req.flash() } );
  }
  else {
    res.redirect('/');
  }
});

// CREATE
router.post('/', function(req, res, next) {
  if (req.isAuthenticated()) {
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
    };

    currentFarmer.farmers.push(farmer);
    currentFarmer.save(function (err) {
      if (err) return next(err);
      res.redirect('/farmers');
    });
  }
  else {
    res.redirect('/');
  }
});

// UPDATE
router.put('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    else {
      farmer.name = req.body.name;
      farmer.email = req.body.email;
      farmer.address.street = req.body.address.street;
      farmer.address.city = req.body.address.city;
      farmer.address.state = req.body.address.state;
      farmer.address.zipcode = req.body.address.zipcode;
      farmer.farm_name = req.body.farmer.farm_name;
      //-->to do set up product detail array
      farmer.details.organic = req.body.details.organic ? true : false;
      currentFarmer.save(function(err) {
        if (err) return next(err);
        res.redirect('/farmers');
      });
    }
  }
  else {
    res.redirect('/');
  }
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    var index = currentFarmer.farmers.indexOf(farmer);
    currentFarmer.farmers.splice(index, 1);
    currentFarmer.save(function(err) {
      if (err) return next(err);
      res.redirect('/farmers');
    });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var farmer = require('../models/farmer');



function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  console.log('farmer:index');
  if (req.isAuthenticated()) {
    var farmers = global.currentFarmer.farmers;
    res.render('farmers/index', { farmers: farmers, message: req.flash() })
  }
  else {
    res.redirect('/');
  }
});

// NEW
router.get('/new', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = {
      title: '',
      completed: false
    };
    res.render('farmers/new', { farmer: farmer, message: req.flash() });
  }
  else {
    res.redirect('/');
  }
});

// SHOW
router.get('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    var checked = farmer.completed ? 'checked' : '';
    res.render('farmers/show', { farmer: farmer, checked: checked, message: req.flash() } );
  }
  else {
    res.redirect('/');
  }
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    var checked = farmer.completed ? 'checked' : '';
    res.render('farmers/edit', { farmer: farmer, checked: checked, message: req.flash() } );
  }
  else {
    res.redirect('/');
  }
});

// CREATE
router.post('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = {
      title: req.body.title,
      completed: req.body.completed ? true : false
    };
    // farmer.create(farmer, function(err, saved) {
    currentFarmer.farmers.push(farmer);
    currentFarmer.save(function (err) {
      if (err) return next(err);
      res.redirect('/farmers');
    });
  }
  else {
    res.redirect('/');
  }
});

// UPDATE
router.put('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    else {
      farmer.title = req.body.title;
      farmer.completed = req.body.completed ? true : false;
      currentFarmer.save(function(err) {
        if (err) return next(err);
        res.redirect('/farmers');
      });
    }
  }
  else {
    res.redirect('/');
  }
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    var farmer = currentFarmer.farmers.id(req.params.id);
    if (!farmer) return next(makeError(res, 'Document not found', 404));
    else {
    res.redirect('/');
  }
});

module.exports = router;
