(function(){

angular.module('social')
  .controller('NavigationController', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state, $rootScope){

      //$scope.user = JSON.parse(localStorage['User-Data']);

      if(localStorage['User-Data']){
        $scope.loggedIn = true;
        console.log("logged in? ", $scope.loggedIn)
        $scope.user = JSON.parse(localStorage['User-Data'])
      }else{
        $scope.loggedIn = false;
      }


      $scope.logUserIn = function(){
        $http.post('api/user/login', $scope.login).success(function(response){
            console.log($scope.login)
            console.log(response)
            localStorage.setItem('User-Data', JSON.stringify(response));
            $scope.loggedIn = true;
            $scope.user = response;
        }).error(function(error){
            console.log(error);
          });

      }

      $scope.logOut = function(){
        localStorage.clear();
        $scope.loggedIn = false;
      }

      $scope.search = function () {
        $rootScope.$broadcast('search:term', $scope.searchTerm);
        console.log($scope.searchTerm)
      };

  }]);

}());
