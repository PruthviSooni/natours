const mongoose = require('mongoose');

const reviews = mongoose.Schema({
  name: String,
  review: String,
  user: String,
  rating: String,
});
module.exports = mongoose.model('Ratings', reviews);
