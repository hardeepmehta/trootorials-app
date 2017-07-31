function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxx.mp4'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};
var myApp = angular.module('BlurAdmin.pages.videos.addVideos');

myApp.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);

        });
      });
    }
  };
}]);
var q = '';
myApp.service('fileUpload', ['$http', '$window', '$timeout', function($http, $window, $timeout) {
  this.uploadFileToUrl = function(file, uploadUrl, t) {
    var fd = new FormData();
    var filename = file.name.replace(file.name.substring(file.name.lastIndexOf('/') + 1), ""),
      uuid = generateUUID();
    filename = filename + uuid;
    q = filename;
    fd.append('file', file, filename);
    return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        uploadEventHandlers: {
          progress: function(e) {
            if (e.lengthComputable) {
              t.progressBar = (e.loaded / e.total) * 100;
              t.view = true;
            }
          }
        },
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function(res) {

        return res;
      })
      .error(function() {});
  }

  this.submit = function(f, uploadUrl, t) {
    $http({
        method: 'POST',
        format: 'json',
        url: uploadUrl,
        data: JSON.stringify(f)
      })
      .then(function(success) {

        t.success = true;
        t.f = {};

        $timeout(function() {
          $window.location.href = "trootorials-v1/#/videos/allVideos"
        }, 3000);

      }, function(error) {

      });
  }
}]);


myApp.controller('addCtrl', ['$scope', 'fileUpload', '$window', 'localStorageService','Upload',
function($scope, fileUpload, $window, localStorageService ,Upload) {


  var token = localStorageService.get('TOKEN')
  if (token == null) {
    $window.location.href = 'trootorials-v1/index.html';
  }
  token = token.substring(1, token.length - 1);

  var k = "";
  $scope.view = false;
  $scope.success = false;
  $scope.add = true;

  $scope.uploadFile = function(f) {
    // $scope.add = false;
    var file = $scope.myFile;

    var thumbnail = $scope.form.file

    var uploadUrl = "/upload?token=" + token;
    var promise = fileUpload.uploadFileToUrl(file, uploadUrl, $scope);
    promise.then(function(res) {

      if (res.data.error = "false") {

        if (thumbnail) { //check if from is valid
          //  console.log(thumbnail)
             $scope.upload(thumbnail,function(url){
          //    console.log("URL "+url)

        $scope.var = {
          title: f.title,
          author: f.author,
          description: f.description,
          duration: f.duration,
          ispublic: f.public,
          imageUrl: url,
          file: q,
        }
        var uploadUrl = "/api/add-video?token=" + token
        fileUpload.submit($scope.var, uploadUrl, $scope,f.course);
    })
  }
  }
})}

  $scope.upload = function(file,cb) {
  //  console.log(file)
    Upload.upload({
        url: '/api/video/upload', //webAPI exposed to upload the file
        data:{file:file} //pass file as data, should be user ng-model
    }).then(function (resp) {
            if(resp.data[0][1]['path']){
            // return resp.data[0][1]['path']
            $scope.fileUrl = resp.data[0][1]['path']
          //  console.log($scope.fileUrl)
            cb($scope.fileUrl);
          }
            else {
              $scope.error = "Error uploading files"
            }
        })
    }
}]);
