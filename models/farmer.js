var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var farmerSchema = new Schema({
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
});

module.exports = mongoose.model('Farmer', farmerSchema);
