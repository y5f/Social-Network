(function(){
  angular.module('social')
  //add Upload to dependencies
    .controller('EditProfileController', ['Upload', '$scope', '$state', '$http', '$timeout', 'store', 'jwtHelper', function(Upload, $scope, $state, $http, $timeout, store, jwtHelper){

        $scope.jwt = store.get('jwt');
        $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
        $scope.user = $scope.decodedJwt
        /*
        $scope.$watch(function(){
          return $scope.file
        }, function(){
          $scope.upload($scope.file)
        });
        */

        $scope.upload = function(dataUrl, name){
          //if(file){
            Upload.upload({
              url: 'api/profile/editPhoto',
              method: 'POST',
              data: {
                userId: $scope.user._id,
                file: Upload.dataUrltoBlob(dataUrl, name)
              }
              /*data: {userId: $scope.user._id},
              file: file*/
            }).progress(function(evt){
              console.log("uploading");
            }).success(function(data){
                console.dir(data)
                $scope.user.image = data.image;
            }).error(function(error){
              console.log(error);
            })
          //}
        }

        $scope.updateUsername = function(){
          var request = {
            userId: $scope.user._id,
            username: $scope.user.username
          }

          $http.post('api/profile/updateUsername', request).success(function(){
            console.log("success");
          }).error(function(error){
            console.log("error");
          })
        }

        $scope.updateBio = function(){
          var request = {
            userId: $scope.user._id,
            bio: $scope.user.bio
          }
        $http.post('api/profile/updateBio', request).success(function(){
          console.log("success");
        }).error(function(error){
          console.log("error");
        })
        }
    }]);
}());
