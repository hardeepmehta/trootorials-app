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

  this.submit = function(f, uploadUrl, t,r) {
    // return $http({
    //     method: 'POST',
    //     format: 'json',
    //     url: uploadUrl,
    //     data: JSON.stringify(f)
    //   })
    //   .then(function(res) {
    //     // $http({
    //     //     method: 'POST',
    //     //     format: 'json',
    //     //     url: '/api/add-mapping?token='+token,
    //     //     data: JSON.stringify({
    //     //       courseid: parseInt(courseid),
    //     //       videoid : res.data.data.data.id
    //     //     })
    //     //   })
    //     //   .then(function(res) {
    //     //
    //     // },function(error){
    //     //
    //     // });}
    //     return res;
    //     console.log('working123123');
    //     console.log(res);
    //     t.success = true;
    //     t.f = {};
    //
    //     // $timeout(function() {
    //     //   $window.location.href = "#/videos/allVideos"
    //     // }, 3000);
    //
    //   }, function(error) {
    //       console.log(error);
    //   });
  };
  this.getAllCourse = function() {
    // console.log('working');
}
}]);


myApp.controller('addCtrl', ['$scope', 'fileUpload', '$window','localStorageService','Upload','$http','$timeout',
function($scope, fileUpload, $window, localStorageService ,Upload,$http,$timeout) {


  var token = localStorageService.get('TOKEN')
  if (token == null) {
    $window.location.href = '/trootorials-v1/index.html';
  }
  token = token.substring(1, token.length - 1);

  var k = "";
  $scope.view = false;
  $scope.success = false;
  $scope.add = true;
  // $scope.form.course = 123;
  // fileUpload.getAllCourse();
  // console.log('working');
  // alert('working')
  // $scope.form= {
  //   course:'bob'
  // }
  $http.get("/trootorials-v1/api/all-courses/?token=" + token).then(function(response) {
    if (response.data.error === 0) {

      localStorageService.remove('TOKEN')
      $window.location.href = '/trootorials-v1/index.html';
    }
    // var arr = [];
    // for (var i = 0; i < response.data.data.length; i++) {
    //   console.log(response.data.data);
    //   arr.push(response.data.data[i].title)
    //   // $scope.form= {
    //   //   course:response.data.data[i].title
    //   // }
    // }
    $scope.names= response.data.data;
  });

  $scope.uploadFile = function(f) {
    // $scope.add = false;
    var file = $scope.myFile;
    // console.log(f);
// console.log(f.course);

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
        var uploadUrl = "/trootorials-v1/api/add-video?token=" + token;

        // var map = fileUpload.submit($scope.var, uploadUrl, $scope,f.course
        $http({
            method: 'POST',
            format: 'json',
            url:  "/trootorials-v1/api/add-video?token=" + token,
            data: JSON.stringify($scope.var)
          })
          .then(function(res) {
            $http({
                method: 'POST',
                format: 'json',
                url: '/trootorials-v1/api/add-mapping?token='+token,
                data: JSON.stringify({
                  courseid: parseInt(f.course),
                  videoid : res.data.data.data.id
                })
              }).then(function(response) {
                    // console.log(response);
                  },function(error){

                  })

            $scope.success = true;
            $scope.form = {};

            $timeout(function() {
              $window.location.href = "#/videos/allVideos"
            }, 3000);

          }, function(error) {
              // console.log(error);
          });


    })
  }
  }
})}

  $scope.upload = function(file,cb) {
  //  console.log(file)
    Upload.upload({
        url: '/trootorials-v1/api/video/upload', //webAPI exposed to upload the file
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
