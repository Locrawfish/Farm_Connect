var express = require('express');
var router = express.Router();
var Farmer = require('../models/farmer');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

function scrollPage() {
  $('html, body').animate({
    scrollTop: $('#name').offset().top
  }, 600);
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
router.get('/', function(req, res, next) {
  console.log('FARMERS:index');
  res.render('index', { title: 'Farm Connect',
                        farmer: currentFarmer
   });
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
      organic: false
    }
  };
  res.render('farmers/new', { farmer: farmer, checked: '', message: req.flash() });
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  var checked = farmer.organic ? 'checked' : '';
  res.render('farmers/show', { farmer: farmer, checked: checked, message: req.flash() } );
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  var checked = farmer.details.organic ? 'checked' : '';
  res.render('farmers/edit', { farmer: farmer, checked: checked, message: req.flash() } );
});


// UPDATE
router.put('/:id', function(req, res, next) {
  if (!currentFarmer) return next(makeError(res, 'Document not found', 404));
  Farmer.findById(req.params.id, function(err, farmer) {
    if (err) return next(err);
     else {
      farmer.name = req.body.name;
      farmer.email = req.body.email;
      farmer.address.street = req.body.street;
      farmer.address.city = req.body.city;
      farmer.address.state = req.body.state;
      farmer.address.zipcode = req.body.zipcode;
      farmer.farm_name = req.body.farm_name;
      farmer.details.organic = req.body.organic ? true : false;

      farmer.save(function(err) {
        if (err) return next(err);
        // Redirect to profile after update
        res.redirect('/farmers/show');
      });
  }
  });

});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  if (!currentFarmer) return next(makeError(res, 'Document not found', 404));
  // TODO: May need to also delete/destroy 'user' session
  Farmer.findByIdAndRemove(currentFarmer, function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
