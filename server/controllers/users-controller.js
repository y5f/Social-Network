var Users = require('../datasets/users');

module.exports.getUsers = function(req, res){
  Users.find({}, function(err, usersData){
    if(err){
      res.error(err);
    } else {
      res.json(usersData);
      //console.log(usersData);
    }
  })
}

module.exports.getOneUser = function(req, res){
  //console.log(JSON.stringify(req));
  var userId = req.body.userId;
  console.log('req.body.userId: ', req.body.userId)

  Users.findById(userId, function(err, user){
    console.log("finding single user by ID")
    console.log(user)
    var userData = user;
    res.json({
      email: userData.email,
      _id: userData._id,
      username: userData.username,
      image: userData.image,
      following: userData.following,
      followers: userData.followers,
      starred: userData.starred,
      retweeted: userData.retweeted
    });
  });
}

module.exports.followUser = function(req, res){
  var userId = req.body.userId
  var wasterId = req.body.wasterId
  console.log("this is the user to be followed: ", wasterId, "this is the follower: ", userId);

  Users.findById(userId, function(err, follower){
    var isInArray = follower.following.some(function (userCheck) {
      var checkId = userCheck.userId;
      return checkId === wasterId;
    });

    if(isInArray){
      console.log("Already following! No changes made", userId, wasterId)
    } else {
      Users.findById(wasterId, function(err, waster){
        waster.followers.push({userId: userId});
        waster.save();
      });
      follower.following.push({userId: wasterId});
      follower.save();
    }

  });

  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after following")
    console.log(user)
    res.send(user);
  });

}

module.exports.unfollowUser = function(req, res){
  var userId = req.body.userId
  var wasterId = req.body.wasterId
  console.log("this is the user to be unfollowed: ", wasterId, "this is the current follower: ", userId);

  Users.findById(userId, function(err, follower){
    var isInArray = follower.following.some(function (userCheck) {
      var checkId = userCheck.userId;
      return checkId === wasterId;
    });

    if(!isInArray){
      console.log("Not currently following! No changes made")
    } else {
      Users.findById(wasterId, function(err, waster){
        //var index = waster.followers.indexOf("userId: " + useriD)
        var index = -1
        for(var i = 0, len = waster.followers.length; i < len; i++){
          if(waster.followers[i].userId === userId){
            index = i;
          }
        }
        console.log('array', waster.followers)
        console.log('index', index)
        if (index > -1) {
          waster.followers.splice(index, 1);
          waster.save();
        }
      });
      //var index = follower.following.indexOf("userId: " + wasterId)
      var index = -1
      for(var i = 0, len = follower.following.length; i < len; i++){
        if(follower.following[i].userId === wasterId){
          index = i;
        }
      }
      console.log('index', index)
      if (index > -1) {
        follower.following.splice(index, 1);
        follower.save();
      }
    }

  });
  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after following")
    console.log(user)
    res.send(user);
  });

}

module.exports.starTweet = function(req, res){
  var userId = req.body.userId
  var tweetId = req.body.tweetId
  console.log("this is the tweet to be starred: ", tweetId, "this is the starrer: ", userId);

  Users.findById(userId, function(err, starrer){
    var isInArray = starrer.starred.some(function (userCheck) {
      var checkId = userCheck.tweetId;
      return checkId === tweetId;
    });
    if(isInArray){
      console.log("Already starred! No changes made", userId, tweetId)
    } else {
      Users.findById(userId, function(err, starrer){
        starrer.starred.push({tweetId: tweetId});
        starrer.save();
        //add code later to count number of times tweet has been starred
      });
    }
  });
  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after following")
    console.log(user)
    res.send(user);
  });
}


module.exports.unstarTweet = function(req, res){
  var userId = req.body.userId
  var tweetId = req.body.tweetId
  console.log("this is the tweet to be unstarred: ", tweetId, "this is the unstarrer: ", userId);

  Users.findById(userId, function(err, unstarrer){
    var isInArray = unstarrer.starred.some(function (userCheck) {
      var checkId = userCheck.tweetId;
      return checkId === tweetId;
    });

    if(!isInArray){
      console.log("Not currently starred! No changes made")
    } else {
      Users.findById(userId, function(err, unstarrer){
        //var index = waster.followers.indexOf("userId: " + useriD)
        var index = -1
        for(var i = 0, len = unstarrer.starred.length; i < len; i++){
          if(unstarrer.starred[i].tweetId === tweetId){
            index = i;
          }
        }
        console.log('array', unstarrer.followers)
        console.log('index', index)
        if (index > -1) {
          unstarrer.starred.splice(index, 1);
          unstarrer.save();
        }
      });
      //var index = follower.following.indexOf("userId: " + wasterId)
      var index = -1
      for(var i = 0, len = unstarrer.starred.length; i < len; i++){
        if(unstarrer.starred[i].tweetId === tweetId){
          index = i;
        }
      }
      console.log('index', index)
      if (index > -1) {
        unstarrer.starred.splice(index, 1);
        unstarrer.save();
      }
    }

  });
  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after following")
    console.log(user)
    res.send(user);
  });

}


module.exports.retweet = function(req, res){
  var userId = req.body.userId
  var tweetId = req.body.tweetId
  console.log("this is the tweet to be retweeted: ", tweetId, "this is the retweeter: ", userId);

  Users.findById(userId, function(err, starrer){
    var isInArray = starrer.retweeted.some(function (userCheck) {
      var checkId = userCheck.tweetId;
      return checkId === tweetId;
    });
    if(isInArray){
      console.log("Already retweeted! No changes made", userId, tweetId)
    } else {
      Users.findById(userId, function(err, retweeter){
        retweeter.retweeted.push({tweetId: tweetId});
        retweeter.save();
        //add code later to count number of times tweet has been retweeted
      });
    }
  });
  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after retweeting")
    console.log(user)
    res.send(user);
  });
}


module.exports.unretweet = function(req, res){
  var userId = req.body.userId
  var tweetId = req.body.tweetId
  console.log("this is the tweet to be unretweeted: ", tweetId, "this is the unretweeter: ", userId);

  Users.findById(userId, function(err, unretweeter){
    var isInArray = unretweeter.retweeted.some(function (userCheck) {
      var checkId = userCheck.tweetId;
      return checkId === tweetId;
    });

    if(!isInArray){
      console.log("Not currently retweeted! No changes made")
    } else {
      Users.findById(userId, function(err, unretweeter){
        //var index = waster.followers.indexOf("userId: " + useriD)
        var index = -1
        for(var i = 0, len = unretweeter.retweeted.length; i < len; i++){
          if(unretweeter.retweeted[i].tweetId === tweetId){
            index = i;
          }
        }
        console.log('array', unretweeter.retweeted)
        console.log('index', index)
        if (index > -1) {
          unretweeter.retweeted.splice(index, 1);
          unretweeter.save();
        }
      });
      //var index = follower.following.indexOf("userId: " + wasterId)
      var index = -1
      for(var i = 0, len = unretweeter.retweeted.length; i < len; i++){
        if(unretweeter.retweeted[i].tweetId === tweetId){
          index = i;
        }
      }
      console.log('index', index)
      if (index > -1) {
        unretweeter.retweeted.splice(index, 1);
        unretweeter.save();
      }
    }

  });
  //send back updated user info for current active user
  Users.findById(userId, function(err, user){
    console.log("returning updated user info after unretweeting")
    console.log(user)
    res.send(user);
  });

}
