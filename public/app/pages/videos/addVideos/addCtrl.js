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
          //console.log(element[0].files[0].name);
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
    //      //console.log(filename,file);
    // file['name'] = filename
    // //console.log(file.name);
    fd.append('file', file, filename);
    return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        uploadEventHandlers: {
          progress: function(e) {
            if (e.lengthComputable) {
              t.progressBar = (e.loaded / e.total) * 100;
              t.view = true;
              //  var progressCounter = $scope.progressBar;
              //console.log(t.progressBar);
            }
          }
        },
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function(res) {
        // alert('successfully uploaded');
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
        ////console.log("hit " + JSON.stringify(success));
        //console.log(success);
        // alert('successfully updated');
        t.success = true;
        t.f = {};

        $timeout(function() {
          $window.location.href = "#/videos/allVideos"
        }, 3000);
        // $window.location.reload()
      }, function(error) {
        ////console.log("not hit " + JSON.stringify(error));
      });
  }
}]);

myApp.controller('addCtrl', ['$scope', 'fileUpload', '$window', 'localStorageService', function($scope, fileUpload, $window, localStorageService) {
  //console.log(localStorageService.get('TOKEN'));

  var token = localStorageService.get('TOKEN')
  if (token == null) {
    $window.location.href = '/index.html';
  }
  token = token.substring(1, token.length - 1);

  var k = "";
  $scope.view = false;
  $scope.success = false;
  $scope.add = true;
  $scope.uploadFile = function(f) {
    // $scope.add = false;
    var file = $scope.myFile;
    //console.log(file.name, $scope.myFile.name);
    //console.log('file is ');
    console.dir(file);
    var uploadUrl = "/upload?token=" + token;
    var promise = fileUpload.uploadFileToUrl(file, uploadUrl, $scope);
    promise.then(function(res) {
      // $scope.progressBar = m;
      //console.log("res"+JSON.stringify(res))
      if (res.data.error == false) {
        // //console.log('working code');
        $scope.var = {
          title: f.title,
          author: f.author,
          description: f.description,
          duration: f.duration,
          ispublic: f.public,
          file: q,
        }
        var uploadUrl = "/api/add-video?token=" + token
        fileUpload.submit($scope.var, uploadUrl, $scope);
      }

      else {
        //console.log("e"+res.data.error);
        // $scope.error = "Video with same title already exists. Please enter a new title"
      }
    })
  };
}]);
