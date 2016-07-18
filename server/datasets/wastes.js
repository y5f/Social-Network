var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var Schema = mongoose.Schema;

var TweetsSchema = new Schema({

  user: String,
  userId: String,
  userImage: String,
  content: String,
  date: {type: Date, default: Date.now},
  tags: [{text: String}]
}).index({
  'content': 'text'
});


module.exports = mongoose.model('Waste', TweetsSchema);
