var User = require('../datasets/users');
var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');

module.exports.updatePhoto = function(req, res){
  var file = req.files.file;

  console.log("below = req.files.file")
  console.log(req.files.file)
  console.log(req.data);
  var userId = req.body.userId;

  var uploadDate = new Date().toISOString;
  console.log("uploadDate: " + uploadDate)
  var tempPath = file.path;
  console.log("tempPath: " + tempPath)
  console.log("dirname: " + __dirname)
  var targetPath = path.join(__dirname, "../../uploads/" + userId + uploadDate + file.name);
  console.log("targetPath: " + targetPath)
  var savePath = "/uploads/" + userId + uploadDate + file.name;

  //console.log("User: " + userId + " is submitting ", file);
  mv(tempPath, targetPath, function(err) {
    if (err) {
      throw err;
      res.json({status: 500})
    } else {
      User.findById(userId, function(err, userData){
        var user = userData;
        user.image = savePath;
        user.save(function(err){
          if(err){
            console.log("failed save");
            res.json({status: 500})
          }else{
            res.json({status: 200, image: user.image})
            console.log('file moved successfully from ' + tempPath + ' to ' + targetPath);
            console.log("save successful");
          }

        })
      })
    }
  });
  /*
  fs.rename(tempPath, targetPath, function(err){
    if(err){
    console.log(err);
  } else {
    User.findById(userId, function(err, userData){
      var user = userData;
      user.image = savePath;
      user.save(function(err){
        if(err){
          console.log("failed save");
          res.json({status: 500})
        }else{
          res.json({status: 200})
          console.log("save successful");
        }

      })
    })
    console.log("file moved");
  }
  })
*/
}

module.exports.updateUsername = function(req, res){
  var username = req.body.username;
  var userId = req.body.userId;

  User.findById(userId, function(err, userData){
    var user = userData;
    user.username = username;

    user.save(function(err){
      if(err){
        console.log("failed to update username")
        res.json({status: 500})
      } else{
        console.log("username successfully updated")

      }
    })
  })
}

module.exports.updateBio = function(req, res){
  var bio = req.body.bio;
  var userId = req.body.userId;

  User.findById(userId, function(err, userData){
    var user = userData;
    user.bio = bio;

    user.save(function(err){
      if(err){
        console.log("failed to update bio")
        res.json({status: 500})
      } else{
        console.log("bio successfully updated")
        res.json({status: 200})
      }
    })
  })
}
