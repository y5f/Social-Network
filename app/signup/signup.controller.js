(function(){
  angular.module('social')
    .controller('SignUpController', ['$scope', '$state', '$http', 'store', function($scope, $state, $http, store){

        $scope.createUser = function(){
          $http.post('api/user/signup', $scope.newUser)

            .success(function(response){

              console.dir(response)

              //store the json web token received in response
              store.set('jwt', response.id_token);
              
              //redirect user to home page
              $state.go('main');

            }).error(function(error){
              console.log(error);
            })
        }

    }]);
}());
