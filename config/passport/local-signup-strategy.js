var LocalStrategy = require('passport-local').Strategy;
var Farmer = require('../../models/farmer');

var strategy = new LocalStrategy(

  {
    usernameField : 'email',       // default for usernameField is 'username'
    passwordField : 'password',
    passReqToCallback : true,
  },
  function(req, email, password, callback) {
    // See if a user already has this email
    Farmer.findOne({ 'local.email' : email }, function(err, farmer) {
      if (err) return callback(err);
      if (farmer) {
        // a user with this email already exists
        return callback(null, false, req.flash('error', 'This email is already taken.'));
      }
      else {
        // Create a new user
        var newFarmer = new Farmer();
        newFarmer.name = req.body.name;
        newFarmer.farm_name = req.body.farm_name;
        newFarmer.phone = req.body.phone;
        newFarmer.address.street = req.body.street;
        newFarmer.address.city = req.body.city;
        newFarmer.address.state = req.body.state;
        newFarmer.address.zipcode = req.body.zipcode;
        newFarmer.bio = req.body.bio;
        newFarmer.local.email = email;
        newFarmer.local.password = newFarmer.encrypt(password);
        console.log('Full request: ' + JSON.stringify(req.body));

        newFarmer.save(function(err) {
          return callback(err, newFarmer);
        });
      }
    });
  }
);

module.exports = strategy;
