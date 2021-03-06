var express = require('express');
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
router.get('/', function(req, res, next) {
  console.log('FARMERS:index');
  res.render('index', { title: 'FARM CONNECT',
                        farmer: currentFarmer
   });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var farmer = {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: Number
      },
    farm_name: String,
    products: [String],
    organic: false
    };
  res.render('farmers/new', { farmer: farmer, message: req.flash() });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Farmer.findById(req.params.id, function(err, farmer) {
    res.render('farmers/show', { farmer: farmer,
                                 allProducts: allProducts,
                                 standards: standards,
                                 message: req.flash()
                               } );
  });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var farmer = currentFarmer;
  console.log('farmer: ' + farmer);
  if (!farmer) return next(makeError(res, 'Document not found', 404));
  console.log('My products: ' + farmer.products);
  console.log('about to render with farmer:', farmer);
  res.render('farmers/edit', { farmer: farmer,
                               allProducts: allProducts,
                               standards: standards,
                               message: req.flash() } );
});


// UPDATE
router.put('/:id', function(req, res, next) {
  if (!currentFarmer) return next(makeError(res, 'Document not found', 404));
  console.log('Farmer params: ' + JSON.stringify(req.body));
  Farmer.findById(req.params.id, function(err, farmer) {
    if (err) return next(err);
    else {
      farmer.name = req.body.name;
      farmer.local.email = req.body.email;
      farmer.phone = req.body.phone;
      farmer.address.street = req.body.street;
      farmer.address.city = req.body.city;
      farmer.address.state = req.body.state;
      farmer.address.zipcode = req.body.zipcode;
      farmer.farm_name = req.body.farm_name;
      farmer.bio = req.body.bio;
      farmer.products = [];
      farmer.standards = [];
      // Check input comes back as array
      if (typeof req.body.products === 'string') {
        farmer.products = [req.body.products];
      }
      else if (req.body.products) {
        req.body.products.forEach(function(p) {
          farmer.products.push(p);
        });
      }
      else {
        farmer.products = [];
      }

      // Check input comes back as array
      if (typeof req.body.standards === 'string') {
        farmer.standards = [req.body.standards];
      }
      // if (Object.prototype.toString.call(req.body.standards) === '[object String]') {
      //   farmer.standards = [req.body.standards];
      // }
      else if (req.body.standards) {
        req.body.standards.forEach(function(s) {
          farmer.standards.push(s);
        });
      }
      else {
        farmer.standards = [];
      }
      console.log('standards ' + farmer.standards);

      farmer.save(function(err) {
        if (err) return next(err);
        // Redirect to profile after update
        res.redirect('/farmers/' + farmer._id);
      });
    }
  });

});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  if (!currentFarmer) return next(makeError(res, 'Document not found', 404));
    Farmer.findByIdAndRemove(currentFarmer, function(err, res) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
