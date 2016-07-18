var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  email: String,
  username: String,
  password: String, //NOT SECURE
  image: String,
  bio: String,
  following: [{userId: String}],
  followers: [{userId: String}],
  starred: [{tweetId: String}],
  retweeted: [{tweetId: String}]
}).index({
  'username': 'text',
  'email': 'text',
  'bio': 'text'
});

module.exports = mongoose.model('User', UsersSchema);
