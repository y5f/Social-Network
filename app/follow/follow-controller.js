(function(){
  angular.module('social')
    .controller('FollowController', ['$scope', '$http', function($scope, $http){

      if(localStorage['User-Data'] !== undefined){
        $scope.user = JSON.parse(localStorage['User-Data'])
        $scope.loggedIn = true;
        console.dir($scope.user)
      }else{
        $scope.loggedIn = false;
      }

      $http.get('api/users/get').then(function(response){
        $scope.users = response.data;
        //console.log($scope.users);
      })

      $scope.follow = function(userId, wasterId){
        request = {userId: userId,
                wasterId: wasterId};

        $http.post('api/users/follow', request).success(function(response){

          $http.post('api/users/user', request).success(function(response){
            console.log('within .then')
            localStorage.setItem('User-Data', JSON.stringify(response));
            $scope.user = response;
          }).error(function(error){
              console.log(error);
            });
      });
    }

    $scope.unfollow = function(userId, wasterId){
      request = {userId: userId,
              wasterId: wasterId};

      $http.post('api/users/unfollow', request).success(function(response){
        console.log(JSON.stringify(response))
        $http.post('api/users/user', request).success(function(response){
          console.log('within .then')
          console.log(JSON.stringify(response))
          localStorage.setItem('User-Data', JSON.stringify(response));
          $scope.user = response;
        }).error(function(error){
            console.log(error);
          });
    });
  }


      $scope.checkIsFollowing = function(wasterId){
        for(var i = 0, len = $scope.user.following.length; i < len; i++){
          if($scope.user.following[i].userId === wasterId){
            return true;
          }
        }
      }

      $scope.checkIsFollowedBy = function(wasterId){
        for(var i = 0, len = $scope.user.followers.length; i < len; i++){
          if($scope.user.followers[i].userId === wasterId){
            return true;
          }
        }
      }
    }])
}());
