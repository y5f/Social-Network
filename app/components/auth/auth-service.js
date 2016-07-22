'use strict';

angular.module('social')
  .factory('Auth', ['$http', 'User', '$cookies', '$q', function Auth($http, User, $cookies, $q) {

    var currentUser = {};

    if ($cookies.get('token')) {
      currentUser = User.get();
    }

    return {
      login: function(user, callback) {
        console.log(user)
        return $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .then(function(res) {
          $cookies.put('token', res.data.token);

          return 1;
          //currentUser = User.get();
          //return currentUser.$promise;
        })
      }
    }
  }]);
