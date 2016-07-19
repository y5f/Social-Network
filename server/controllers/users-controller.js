var Users = require('../datasets/users');

//check if given element exists already within array
function checkAlreadyPerformed(toCheck, method, itemKey, matchValue){
  return function(user){
    console.log("hello from checkAlreadyPerformed. user:" + user)
    console.log("toCheck.req.body" + toCheck.req.body[itemKey])
    //var method = "starred"

    //iterate through relevant array until a value matches that specified
    var isInArray = user[method].some(function (userCheck) {
      var checkId = userCheck[itemKey];
      return checkId === toCheck.req.body[matchValue];
      //res.status(statusCode).json(checkId === tweetId);
    })
    if(isInArray){
      console.log("checkAlreadyPerformed: Already " + method + "! No changes made")
    } else {
      console.log("checkAlreadyPerformed: Not currently " + method + ", will try")
      return user
    }
  }
}
//add element to array within user
function pushItem(toPush, method, itemKey, value){
  return function(user){
    var key = itemKey;
    var obj = {};
    obj[key] = value;
    console.log("About to push: " + itemKey + ": " + value)
    user[method].push(obj)

    return user.save();
  }
}
//respond with new user object
function respond(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}




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

  //new return function code using promises
  Users.findById(req.body.wasterId)
    .then(checkAlreadyPerformed(res, "followers", "userId", req.body.userId))
    .then(pushItem(res, "followers", "userId", req.body.userId))
    .then(console.log(res))

  Users.findById(req.body.userId)
    .then(checkAlreadyPerformed(res, "following", "userId", req.body.wasterId)) //needs to be waster id
    .then(pushItem(res, "following", "userId", req.body.wasterId))
    .then(console.log(res))
    .then(respond(res));
  /*
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
*/
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
        //console.log('array', waster.followers)
        //console.log('index', index)
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
      //console.log('index', index)
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
  //new return function code using promises
    Users.findById(req.body.userId)
    .then(checkAlreadyPerformed(res, "starred", "tweetId"))
    .then(pushItem(res, "starred", "tweetId"))
    .then(respond(res));
    //add code later to count number of times tweet has been starred
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
        //console.log('array', unstarrer.followers)
        //console.log('index', index)
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
      //console.log('index', index)
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

  console.log("this is the tweet to be retweeted: ", req.body.tweetId, "this is the retweeter: ", req.body.userId);
  //new return function code using promises
  Users.findById(req.body.userId)
  .then(checkAlreadyPerformed(res, "retweeted", "tweetId"))
  .then(pushItem(res, "retweeted", "tweetId"))
  .then(respond(res));
  //add code later to count number of times tweet has been retweeted
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
        //console.log('array', unretweeter.retweeted)
        //console.log('index', index)
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
      //console.log('index', index)
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
