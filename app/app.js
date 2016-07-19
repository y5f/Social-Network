(function(){
  angular.module('social', ['ui.router', 'ngFileUpload', 'ngAnimate', 'ngTagsInput', 'ngImgCrop'])
    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/");

        $stateProvider
          .state('signUp', {
            url: "/signup",
            templateUrl: "app/signup/signup.html",
            controller: "SignUpController"
          })

          .state('editProfile', {
            url: "/edit-profile",
            templateUrl: "app/profile/edit-profile-view.html",
            controller: "EditProfileController"
          })

          .state('main', {
            url: "/",
            templateUrl: "/app/main/main.html",
            controller: "MainController"
          })

          .state('follow', {
            url: "/follow-users",
            templateUrl: "/app/follow/follow.html",
            controller: "FollowController"
          })

          .state('search', {
            url: "/search",
            templateUrl: "/app/search/search.html",
            controller: "SearchController"
          })
    })
})();
