var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ReviewSchema = new Schema ({
  gif: String,
  stars: Number,
  reviewContent: String,
  recommend: Boolean,
  sandwiches: [{
    type: Schema.Types.ObjectId,
    ref: 'Sandwich'
  }],
  users: [{                           // Will a review ever need to store more than one user?
    type: Schema.Types.ObjectId,      // It seems like each review will have one restaurant, one sandwich, one user. 
    ref: 'User'                       // In that case, these do not need to be arrays. 
  }],
  restaurants: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
});


var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
