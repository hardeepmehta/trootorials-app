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
          console.log(element[0].files[0].name);
        });
      });
    }
  };
}]);
var q = '';
myApp.service('fileUpload', ['$http', '$window', function($http, $window) {
  this.uploadFileToUrl = function(file, uploadUrl) {
    var fd = new FormData();
    var filename = file.name.replace(file.name.substring(file.name.lastIndexOf('/') + 1), ""),
      uuid = generateUUID();
    filename = filename + uuid;
    q = filename;
    //      console.log(filename,file);
    // file['name'] = filename
    // console.log(file.name);
    fd.append('file', file, filename);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function(res) {
        alert('successfully uploaded')
      })
      .error(function() {});
  }
  this.submit = function(f, uploadUrl) {
    $http({
        method: 'POST',
        format: 'json',
        url: uploadUrl,
        data: JSON.stringify(f)
      })
      .then(function(success) {
        //console.log("hit " + JSON.stringify(success));
        alert('successfully updated');
        $window.location.href = "#/videos/allVideos"
        // $window.location.reload()
      }, function(error) {
        //console.log("not hit " + JSON.stringify(error));
      });
  }
}]);

myApp.controller('addCtrl', ['$scope', 'fileUpload', '$window', 'localStorageService', function($scope, fileUpload, $window, localStorageService) {
  console.log(localStorageService.get('TOKEN'));

  var token = localStorageService.get('TOKEN')
  if (token == null) {
    $window.location.href = '/index.html';
  }

  var k = "";
  $scope.uploadFile = function() {
    var file = $scope.myFile;
    console.log(file.name, $scope.myFile.name);
    console.log('file is ');
    console.dir(file);
    var uploadUrl = "/upload";
    fileUpload.uploadFileToUrl(file, uploadUrl);
  };
  $scope.hello = function(f) {
    // var filename=$scope.myFile.name.replace($scope.myFile.name.substring($scope.myFile.name.lastIndexOf('/')+1),""),
    //       uuid = generateUUID();
    //       filename = filename+uuid;
    // if(f.length==5){
    console.log(Object.keys(f).length);
    $scope.var = {
      title: f.title,
      author: f.author,
      description: f.description,
      duration: f.duration,
      ispublic: f.public,
      file: q,
    }
    var uploadUrl = "/api/add-video"
    fileUpload.submit($scope.var, uploadUrl);

  }

  // else{
  //   alert('please fill all the values')
  // }

}]);
