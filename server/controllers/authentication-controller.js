var mongoose = require('mongoose');
var User = require('../datasets/users');

var _ = require('lodash');
var config = require('../../config')
var jwt = require('jsonwebtoken');

var crypto = require('crypto');


function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*6 });
}

module.exports.signup = function(req, response){
  console.log(req.body);

  var user = new User(req.body);
  console.log("Saving new user")
  user.save();

  //send back request body
  var profile = req.body;
  console.log("req.body: " + req.body)

}

module.exports.login = function(req, res){
  console.log("req.body:")
  console.dir(req.body, {depth: 1});

  //Find user that matches email ONLY
  User.findOne({email: req.body.email}, function(err, results){
    if(err){
      console.log("Error in module.exports.login");
    }
    console.log("Found user: " + results)
    console.dir(results._doc, {depth: 1})
    console.log("Hasownpropertysalt? " + results._doc.hasOwnProperty("salt"))
    if(results._doc.hasOwnProperty('salt')){

      //Now extract password and salt and use to encrypt request pwd
      var salt = results.salt;
      var encryptedPassword = results.password;
      var iterations = 10000;
      var keyLen = 64;
      console.log(typeof(String(salt)));
      var saltBuffer = new Buffer((String(salt)), 'base64')

      var key = crypto.pbkdf2Sync(req.body.password, saltBuffer, iterations, keyLen).toString('base64');

      console.log("Encrypted Input Password: " + key);
      console.log("Stored password" + results.password)

      //if encrypted request pwd matches found user, proceed with response
      if (key === results.password){
        console.log("Passwords Match! Woop")

        var userData = results;
        var profile = {
          email: req.body.email,
          _id: userData._id,
          username: userData.username,
          image: userData.image,
          following: userData.following,
          followers: userData.followers,
          starred: userData.starred,
          retweeted: userData.retweeted
        }
        res.status(201).send({
          id_token: createToken(profile)
        });
      } else {
        console.log("Password incorrect...oops")
        res.status(500).send()
        }
    } else {
      res.status(404).send()
      console.log("error no salt found, password not encrypted")
    }
  });
}
