var Users = require('../datasets/users');
var Tweets = require('../datasets/wastes')


module.exports.search = function(req, res){
  var output = {users: {}, tweets: {}}

  Users.find({ $text: { $search: req.body.term}}, function(err, results){
    if(err){
      res.json(err);
    } else {
      output.users = results;
      //res.json(output);
    }
  })

  Tweets.find({ $text: { $search: req.body.term}}, function(err, results){
    if(err){
      res.json(err);
    } else {
      output.tweets = results;
      res.json(output);
    }
  })


}
