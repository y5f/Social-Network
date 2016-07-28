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
            var request = {data: dataUrl};

            //console.log(dataUrl)
            var dataBlob = Upload.dataUrltoBlob(dataUrl, name);
            var req = {name: dataBlob.$ngfName, id: $scope.user._id};
            //var req = 'hillo';

            $http.post('api/profile/editPhoto', req).success(function(response){
              /*Upload.upload({
                method: 'PUT',
                //headers: {'Content-Type': file.type != '' ? file.type : 'application/octet-stream'},
                url: response.uploadUrl,
                data: Upload.dataUrltoBlob(dataUrl, name)
                  //{
                  //userId: $scope.user._id,
                  //file: Upload.dataUrltoBlob(dataUrl, name)
                //}*/
                console.dir(response);
                var signedUrl = response.uploadUrl;
                var file = Upload.dataUrltoBlob(dataUrl, name); //request.data.file;
                // ...
                //var d_completed = $q.defer(); // since I'm working with Angular, I use $q for asynchronous control flow, but it's not mandatory
                var xhr = new XMLHttpRequest();
                xhr.file = file; // not necessary if you create scopes like this

                xhr.onreadystatechange = function(e) {
                  if ( 4 == this.readyState ) {
                    // done uploading! HURRAY!
                    //d_completed.resolve(true);
                  }
                };
                xhr.open('PUT', signedUrl, true);
                xhr.setRequestHeader("Content-Type","image");
                xhr.send(file);

                $scope.user.image = response.objectUrl;
                console.log($scope.user)
              /*data: {userId: $scope.user._id},
              file: file*/
            /*
            }).progress(function(evt){
              console.log("uploading");
            }).success(function(data){
                //new code to get S3 link
                console.dir(data, {depth: 1});
                //console.dir(data)
                //$scope.user.image = data.image;*/
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


//code below to add for progess bar for uploading. From http://jsfiddle.net/danialfarid/xxo3sk41/590/


/*app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.upload = function (dataUrl, name) {
        Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
            },
        }).then(function (response) {
            $timeout(function () {
                $scope.result = response.data;
            });
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status
                + ': ' + response.data;
        }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
}]);*/
