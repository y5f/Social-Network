var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt     = require('express-jwt');

var config = require('./config');

var app = express();
var authenticationController = require('./server/controllers/authentication-controller');
var profileController = require('./server/controllers/profile-controller');
var wasteController = require('./server/controllers/waste-controller');
var userController = require('./server/controllers/users-controller');
var searchController = require('./server/controllers/search-controller');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

mongoose.connect(config.mongo.uri)

app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/app', express.static(__dirname + "/app"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(__dirname + "/uploads"))

app.get('/', function(req,res){
  res.sendfile('index.html')
})

//Authenticate
app.post('/api/user/signup', authenticationController.signup);
app.post('/api/user/login', authenticationController.login);

//Auth NEW
//app.use('/auth/local', require('./server/auth'));

var jwtCheck = jwt({
  secret: config.secret
});

app.use('/api', jwtCheck)

//profile
app.post('/api/profile/editPhoto', multipartMiddleware, profileController.updatePhoto);
app.post('/api/profile/updateUsername', profileController.updateUsername);
app.post('/api/profile/updateBio', profileController.updateBio);

//wastes
app.post('/api/waste/post', wasteController.postWaste);
app.post('/api/waste/get', wasteController.getWastes);

//user
app.get('/api/users/get', userController.getUsers);
app.post('/api/users/user', userController.getOneUser);
app.post('/api/users/follow', userController.followUser);
app.post('/api/users/unfollow', userController.unfollowUser);
app.post('/api/users/star', userController.starTweet);
app.post('/api/users/unstar', userController.unstarTweet);
app.post('/api/users/retweet', userController.retweet);
app.post('/api/users/unretweet', userController.unretweet);

//search
app.post('/api/search', searchController.search);

app.listen(process.env.PORT || '3000' , function(){
  console.log("Server listening on port 3000")
})
