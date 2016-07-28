(function(){
  angular.module('social', ['ui.router', 'ngFileUpload', 'ngAnimate', 'ngTagsInput', 'ngImgCrop', 'ngResource', 'ngCookies', 'angular-storage', 'angular-jwt'])
    .config(function($stateProvider, $httpProvider, jwtInterceptorProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/");

        jwtInterceptorProvider.tokenGetter = function(store) {
          return store.get('jwt');
        }
        $httpProvider.interceptors.push('jwtInterceptor');

        $stateProvider
          .state('signUp', {
            url: "/signup",
            templateUrl: "app/signup/signup.html",
            controller: "SignUpController"
          })

          .state('login', {
            url: "/login",
            templateUrl: "app/navigation/login.html",
            controller: "NavigationController"
          })

          .state('main', {
            url: "/",
            templateUrl: "/app/main/main.html",
            controller: "MainController"
          })

          .state('editProfile', {
            url: "/edit-profile",
            templateUrl: "app/profile/edit-profile-view.html",
            controller: "EditProfileController",
            data: {
              requiresLogin: true
            }
          })

          .state('follow', {
            url: "/follow-users",
            templateUrl: "/app/follow/follow.html",
            controller: "FollowController",
            data: {
              requiresLogin : true
            }
          })

          .state('search', {
            url: "/search",
            templateUrl: "/app/search/search.html",
            controller: "SearchController",
            data: {
              requiresLogin : true
            }
          })
    })
    .run(function($rootScope, $state, store, jwtHelper) {
      $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
          if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
            e.preventDefault();
            $state.go('login');
          }
        }
      });
    })
})();
