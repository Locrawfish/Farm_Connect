var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: Number
  },
  farmer_preference: [{type: mongoose.Schema.ObjectId, ref:'Farmer'}]
});


module.exports = mongoose.model('User', userSchema);

