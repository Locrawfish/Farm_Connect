var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var FarmerSchema = new Schema({
  name: String,
  local :{ email: String,
           password: String
         },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: Number
  },
  farm_name: String,
  products: [String],
  standards: [String]
});

FarmerSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

FarmerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

FarmerSchema.methods.getChecked = function(name) {
  return this.products.indexOf(name) !== -1 ? 'checked' : '';
};

FarmerSchema.methods.isOrganic = function() {
  return this.organic;
};

module.exports = mongoose.model('Farmer', FarmerSchema);
