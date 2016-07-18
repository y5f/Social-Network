var mongoose = require('mongoose');
var User = require('../datasets/users');

module.exports.signup = function(req, response){
  console.log(req.body);

  var user = new User(req.body);
  user.save();

  //send back request body
  response.json(req.body)
}

module.exports.login = function(req, res){
  User.find(req.body, function(err, results){
    if(err){
      console.log("Error in module.exports.login");
    }
    if(results && results.length === 1){
      var userData = results[0];
      res.json({
        email: req.body.email,
        _id: userData._id,
        username: userData.username,
        image: userData.image,
        following: userData.following,
        followers: userData.followers,
        starred: userData.starred,
        retweeted: userData.retweeted
      });
    }
  })
}
