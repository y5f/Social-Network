(function(){

  angular.module('social')
    .controller('SearchController', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state, $rootScope){

      $scope.userResults = {}

      $scope.$on('search:term', function (event, data) {
        var searchTerm = {term: data};

        searchUsers(searchTerm)

        if(localStorage['User-Data'] !== undefined){
          $scope.user = JSON.parse(localStorage['User-Data'])
          $scope.loggedIn = true;
          console.dir($scope.user)
        }else{
          $scope.loggedIn = false;
        }

        function searchUsers (searchTerm){
          $http.post('api/search', searchTerm).success(function(response){
              $scope.userResults = response;
              console.log("response: ", response)
          })
        };

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
      });
    }]);

}());
