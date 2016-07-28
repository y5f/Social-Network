(function(){
  angular.module('social')
    .controller('MainController', ['$scope', '$http', '$interval', 'store', 'jwtHelper', function($scope, $http, $interval, store, jwtHelper){

      if(localStorage['jwt'] !== undefined){
        $scope.loggedIn = true
        getWastes(true);
      } else {
        $scope.loggedIn = false;
      }

      $scope.jwt = store.get('jwt');
      $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

      $scope.user = $scope.decodedJwt
      console.log($scope.user)
      /*$interval(function(){
        if(localStorage['User-Data'] !== undefined){
        $scope.user = JSON.parse(localStorage['User-Data'])
        //console.dir($scope.user)
        }
      }, 2000);*/

      $scope.sendTweet = function(event){
        //if(event.which === 13){
          var request = {
            user: $scope.user.username || $scope.user.email,
            userId: $scope.user._id,
            userImage: $scope.user.image,
            content: $scope.newTweet.content,
            tags: $scope.newTweet.tags
          }
          $scope.newTweet = "";

          console.log(request)

          $http.post('api/waste/post', request).success(function(response){
            //console.log(response);
            $scope.wastes = response;
          }).error(function(error){
            console.log(error);
          })
        //}
      }

      $scope.star = function(userId, tweetId){
        request = {userId: userId,
                tweetId: tweetId};
          $http.post('api/users/star', request).success(function(response){

            /*$http.post('api/users/user', request).success(function(response){
              console.log('Retrieving updated user info')*/
              localStorage.setItem('User-Data', JSON.stringify(response));
              $scope.user = response;
            }).error(function(error){
                console.log(error);
              });
        //});
      }
      $scope.unstar = function(userId, tweetId){
        request = {userId: userId,
                tweetId: tweetId};

        $http.post('api/users/unstar', request).success(function(response){
          //console.log(JSON.stringify(response))
          $http.post('api/users/user', request).success(function(response){
            console.log('Retrieving updated user info after unstar')
            //console.log(JSON.stringify(response))
            localStorage.setItem('User-Data', JSON.stringify(response));
            $scope.user = response;
          }).error(function(error){
              console.log(error);
            });
        });
      }

      $scope.isStarred = function(tweetId){
        //console.log("$scope.user: ", $scope.user)
        for(var i = 0, len = $scope.user.starred.length; i < len; i++){
          if($scope.user.starred[i].tweetId === tweetId){
            return true;
          }
        }
      };


      $scope.retweet = function(userId, tweetId){
        request = {userId: userId,
                tweetId: tweetId};
          $http.post('api/users/retweet', request).success(function(response){

            $http.post('api/users/user', request).success(function(response){
              console.log('Retrieving updated user info after retweeting')
              localStorage.setItem('User-Data', JSON.stringify(response));
              $scope.user = response;
            }).error(function(error){
                console.log(error);
              });
        });
      }
      $scope.unretweet = function(userId, tweetId){
        request = {userId: userId,
                tweetId: tweetId};

        $http.post('api/users/unretweet', request).success(function(response){
          //console.log(JSON.stringify(response))
          $http.post('api/users/user', request).success(function(response){
            console.log('Retrieving updated user info after unretweeting')
            //console.log(JSON.stringify(response))
            localStorage.setItem('User-Data', JSON.stringify(response));
            $scope.user = response;
          }).error(function(error){
              console.log(error);
            });
        });
      }

      $scope.isRetweeted = function(tweetId){
        //console.log("$scope.user: ", $scope.user)
        for(var i = 0, len = $scope.user.retweeted.length; i < len; i++){
          if($scope.user.retweeted[i].tweetId === tweetId){
            return true;
          }
        }
      };



      function getWastes (initial){
        var data = {}
        if ($scope.user){
          data.following = $scope.user.following;
        }
        $http.post('api/waste/get', data).success(function(response){
          if(initial){
            $scope.wastes = response;
          } else {
            if($scope.wastes && response.length > $scope.wastes.length){
                $scope.incomingWastes = response;
            }
          }
        })
      };

      if($scope.loggedIn){
        $interval(function(){
          getWastes(false);

          if($scope.incomingWastes){
            $scope.difference = $scope.incomingWastes.length - $scope.wastes.length;
          }

        }, 5000);

        $scope.setNewWastes = function(){
          $scope.wastes = angular.copy($scope.incomingWastes);
          $scope.incomingWastes = undefined;
        }
      };

      //init
      //if($scope.loggedIn){
      //  getWastes(true);
      //};
      //console.dir($scope.wastes)

    }])

}())
