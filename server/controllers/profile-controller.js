var User = require('../datasets/users');
var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var aws = require('aws-sdk');
var url = require('url');

module.exports.updatePhoto = function(req, res){

  // some initial configuration

  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, //,
    secretAccessKey: process.env.AWS_SECRET_KEY, //
    signatureVersion: 'v4',
    region: 'eu-west-1'
  });

  // ---------------------------------
  // now say you want fetch a URL for an object named `objectName`
  var s3 = new aws.S3();

  var timestamp = Date.now();
  console.log("userid: " + req.body.id)
  console.log("timestamp: " + timestamp)

  var s3_params = {
    Bucket: 'rstwittercloneclientstorage', //need quotes here?
    Key: req.body.id + timestamp + req.body.name,
    Expires: 125,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3_params, function (err, signedUrl) {

    // send signedUrl back to client
    var parsedUrl = url.parse(signedUrl);
    parsedUrl.search = null;
    var objectUrl = url.format(parsedUrl);

    res.json({uploadUrl: signedUrl,
              objectUrl: objectUrl,
              req: req.body,
                 status: 200});

    console.log('signed url res.uploadUrl: ', res.uploadUrl);
    console.log('retrieve object from this url: ', res.objectUrl);

    User.findOneAndUpdate({_id: req.body.id}, {image: objectUrl}, {upsert:true}, function(err, result){
        if(err){
          console.log("Failed to update user doc")
          //res.send({status: 500});
        } else {
          console.log("User doc updated Successfully")
          //res.send({status: 200, data: result});
        }
      });
  });


  //original code
  /*
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
