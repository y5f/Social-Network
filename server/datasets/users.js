var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  email: String,
  username: String,
  password: String, //NOT SECURE
  salt: String,
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

var validatePresenceOf = function(value) {
  return value && value.length;
};


UsersSchema.pre('save', function(next){
  if(this.isModified('password')){
    console.log("isModified: True");
    if(!validatePresenceOf(this.password)){
        console.log("No password");
        next(new Error('Invalid Password'));
    }

  var _this = this;
  console.log("about to generate salt");
  this.generateSalt(function(saltErr, salt){
    if(saltErr){
      console.log("saltErr");
      next(saltErr);
    }
    _this.salt = salt;
    console.log("salt set");
    /*_this.encryptPassword(_this.password, function(encryptErr, encryptedPassword){
      if(encryptErr){
        console.log("EncryptErr");
        next(encryptErr)
      }*/
    var encryptedPassword = _this.encryptPassword(_this.password);
      _this.password = encryptedPassword;
      console.log("encrypted pwd set");
      next();
    //});
  })
} else {
  next();
}
});


UsersSchema.methods = {
  /*check to see if passwords match*/
  authenticate: function(password){
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    var _this = this;
    this.encryptPassword(password, function(err, pwdGen) {
      if (err) {
        callback(err);
      }

      if (_this.password === pwdGen) {
        callback(null, true);
      }
      else {
        callback(null, false);
      }
    });

  },

  /*generate salt for more secure passwords*/
  generateSalt: function(callback){
    console.log("now in generateSalt");
    var byteSize = 16;
    console.log("bytesize set");
    console.log("about to encrypt");
    return crypto.randomBytes(byteSize, function(err, salt) {
      if (err) {
        console.log(err)
        callback(err);
      }
      return callback(null, salt.toString('base64'));
    });

    //return crypto.randomBytes(byteSize).toString('base64');
  },

  /*Encrypt passwords (using salt) so they are not stored in plain text*/
  encryptPassword: function(password){
    if(!password || !this.salt){
      return null;
    }
    var iterations = 10000;
    var keyLen = 64;
    var salt = new Buffer(this.salt, 'base64');

    var key = crypto.pbkdf2Sync(password, salt, iterations, keyLen).toString('base64');
    console.log("Hashed pwd: " + key);

    return key
  }

}

module.exports = mongoose.model('User', UsersSchema);
