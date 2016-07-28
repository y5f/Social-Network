(function(){

angular.module('social')
  .controller('NavigationController', ['$scope', '$http', '$state', '$rootScope', 'Auth', 'store', 'jwtHelper', function($scope, $http, $state, $rootScope, Auth, store, jwtHelper){

      //$scope.user = JSON.parse(localStorage['User-Data']);
      getUserFromJwt();

      function getUserFromJwt(){
        if(localStorage['jwt']){
          $scope.loggedIn = true;
          console.log("logged in? ", $scope.loggedIn)
          $scope.jwt = store.get('jwt');
          $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
          $scope.user = $scope.decodedJwt
          console.log($scope.user)
        }else{
          $scope.loggedIn = false;
        }
      }

      $scope.logUserIn = function(){
        $http.post('api/user/login', $scope.login).success(function(response){
            console.log($scope.login)
            console.log(response)

            store.set('jwt', response.id_token);

            //localStorage.setItem('User-Data', JSON.stringify(response));
            $scope.loggedIn = true;

            console.log($state)
            //redirect user to home page
            if($state.current.name === 'main'){
              $state.reload();
            }else{
              $state.go('main');
            }

            getUserFromJwt();

        }).error(function(error){
            console.log(error);
          });

          //Auth.login($scope.login);

      }

      $scope.logOut = function(){
        localStorage.clear();
        $scope.loggedIn = false;

        //redirect user to home page
        if($state.current.name === 'main'){
          $state.reload();
        }else{
          $state.go('main');
        }
      }

      $scope.search = function () {
        $rootScope.$broadcast('search:term', $scope.searchTerm);
        console.log($scope.searchTerm)
      };

  }]);

}());
