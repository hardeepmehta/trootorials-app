function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxx.mp4'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

var localstorageApp = angular.module('BlurAdmin.pages.videos.allVideos');
localstorageApp.controller('TbleCtrl', ['$rootScope', '$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
  '$uibModal', 'baProgressModal', 'localStorageService', '$state', '$rootScope',

  function($rootScope, $scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal, localStorageService, $state, $rootScope) {


    var token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/index.html';
    }
    token = token.substring(1, token.length - 1);

    $scope.users = [];
    $scope.display = true;

    $scope.id = 0;
    $scope.redirect = function() {
      $window.location.href = "#/videos/addVideos";
    }
    $http.get("/api/all-videos?token=" + token).then(function(response) {
      if (response.data.error === 0) {

        localStorageService.remove('TOKEN')
        $window.location.href = '/index.html';
      }
      $scope.loading = true;
      setTimeout(function() {
        $scope.loading = false;
        $scope.$apply();
      }, 2000);
      $scope.users = response.data.data;

    });

    $scope.open = function(e, id, page, size, addOrEdit) {

      $scope.id = id
      $scope.display = true;
      var modalInstance = $uibModal.open({

        templateUrl: 'app/pages/videos/addVideos/add3.html',
        controller: 'ModalInstanceCtrl1',
        controllerAs: '$scope',
        size: size,

        resolve: {
          users: function() {
            return $scope.users;
          },

          id: function() {
            return $scope.id;
          },

          token: function() {
            return token;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {

        $scope.loading = true;
        setTimeout(function() {
          $scope.loading = false;
          $scope.$apply();
        }, 2000);

        $scope.users = selectedItem;


      }, function() {

      });
    };


    $scope.removeVideo = function(id, $index) {
      var m = parseInt(id);
      if ($window.confirm("Are you sure you want to delete?") == true) {
        $http.post("/api/delete-video/" + m + "?token=" + token).then(function(response) {
          $scope.loading = true;
          setTimeout(function() {
            $scope.loading = false;
            $scope.$apply();
          }, 2000);
          $scope.users.splice($index, 1);
          $http.post("/api/deletevideo-mapping/"+m+"?token="+token).then(function(response){

          });
        });

      } else {}
    }
    $scope.openProgressDialog = baProgressModal.open;

  }
])


var myApp = angular.module('BlurAdmin.pages.users');
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
var u = 0;
var q = 0;
var k = 0;
myApp.service('fileUpload', ['$http', '$window','$timeout','localStorageService', function($http, $window,$timeout,localStorageService) {

  this.uploadFileToUrl = function(file, uploadUrl,t) {
    var fd = new FormData();
    var filename = file.name.replace(file.name.substring(file.name.lastIndexOf('/') + 1), ""),
      uuid = generateUUID();
    filename = filename + uuid;
    q = filename;
    fd.append('file', file, filename);
    return  $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        uploadEventHandlers: {
        progress: function (e) {
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


  this.submit = function(f, uploadUrl,t,courseid) {

    var token = localStorageService.get('TOKEN')
    token = token.substring(1, token.length - 1);

    t.error = "";

    $http({
        method: 'POST',
        format: 'json',
        url: uploadUrl,
        data: JSON.stringify(f)
      })
      .then(function(res) {

        if(res.data.error == true){

          t.error=res.data.reason;
        }
        else{
          if(t.add == true)
          {

          $http({
              method: 'POST',
              format: 'json',
              url: '/api/add-mapping?token='+token,
              data: JSON.stringify({
                courseid: parseInt(courseid),
                videoid : res.data.data.data.id
              })
            })
            .then(function(res) {
        
          },function(error){

          });}
        t.success = true;
        t.f ={};

        $timeout(function() {
        $window.location.href = "#/videos/allVideos"
      },3000);
    }

      }

    );
  }
  this.getVideo = function(id,m,token){
    $http.get("/api/get-video/" + id + "?token=" + token).then(function(response) {

      m.form = response.data.response.data;
      m.u = response.data.response.data.ispublic;
      m.k = response.data.response.data.file;

      $http.get("/api/get-mapping/" + id + "?token=" + token).then(function(response) {

          if(response.data.response.data[0] == undefined)
          m.form.course = 0
          else
          m.form.course = response.data.response.data[0].courseid;

      })
    })

  }
  this.all = function(token){
    return $http.get("/api/all-videos?token=" + token);

  }

}]);

myApp.controller('ModalInstanceCtrl1', ['$http','$scope', '$uibModalInstance',   'id', '$timeout', 'fileUpload','token','Upload',function ($http,$scope, $uibModalInstance,id,$timeout,fileUpload,token,Upload) {
  $scope.form = {};
  $scope.test = '';
  fileUpload.getVideo(id,$scope,token);

  $scope.updateVideo = function() {

    if ($scope.form.file!=$scope.k) {
         $scope.upload($scope.form.file,function(url){
           if($scope.myFile!=undefined){
             var file = $scope.myFile;
           var uploadUrl = "/upload?token=" + token;
           var promise = fileUpload.uploadFileToUrl(file, uploadUrl,$scope);
           promise.then(function(res){
             if(res.data.error = "false"){

               $scope.var = {
                 title: $scope.form.title,
                 description: $scope.form.description,
                 author: $scope.form.author,
                 duration: $scope.form.duration,
                 ispublic: $scope.form.public == undefined ? $scope.u : $scope.form.public,
                  file: q,
                  imageUrl:url
                }
                $http.get("/api/get-course/" + id + "?token=" + token).then(function(response) {


                  if(response.data.response.id)
                  $http({
                      method: 'POST',
                      format: 'json',
                      url: '/api/edit-mapping/'+ id + '?token='+token,
                      data: JSON.stringify({
                        courseid: parseInt($scope.form.course),
                        videoid : id
                      })
                    })
                    .then(function(res) {

                  },function(error){

                  });
                });






                var uploadUrl = "/api/edit-video/"+id + "?token=" + token;
               var k = fileUpload.submit($scope.var, uploadUrl,$scope);
               fileUpload.all(token).then(function(response) {

                       $uibModalInstance.close(response.data.data);
                     });
                   }
                   else{

               }
             })
           }
           else{
           $scope.var = {
             title: $scope.form.title,
             description: $scope.form.description,
             author: $scope.form.author,
             duration: $scope.form.duration,
             ispublic: $scope.form.public == undefined ? $scope.u : $scope.form.public,
             imageUrl:url
            }
           var uploadUrl = "/api/edit-video/"+id+ "?token=" + token;
           var i = fileUpload.submit($scope.var, uploadUrl,$scope);
           fileUpload.all(token).then(function(response) {

              $uibModalInstance.close(response.data.data);
            });
           }
  })

}
else{
  if($scope.myFile!=undefined){
    var file = $scope.myFile;
  var uploadUrl = "/upload?token=" + token;
  var promise = fileUpload.uploadFileToUrl(file, uploadUrl,$scope);
  promise.then(function(res){
    if(res.data.error = "false"){

      $scope.var = {
        title: $scope.form.title,
        description: $scope.form.description,
        author: $scope.form.author,
        duration: $scope.form.duration,
        ispublic: $scope.form.public == undefined ? $scope.u : $scope.form.public,
         file: q,

       }


       var uploadUrl = "/api/edit-video/"+id + "?token=" + token;
      var k = fileUpload.submit($scope.var, uploadUrl,$scope);
      fileUpload.all(token).then(function(response) {

              $uibModalInstance.close(response.data.data);
            });
          }
          else{

      }
    })
  }
  else{
  $scope.var = {
    title: $scope.form.title,
    description: $scope.form.description,
    author: $scope.form.author,
    duration: $scope.form.duration,
    ispublic: $scope.form.public == undefined ? $scope.u : $scope.form.public,
   }
  var uploadUrl = "/api/edit-video/"+id+ "?token=" + token;
  var i = fileUpload.submit($scope.var, uploadUrl,$scope);
  fileUpload.all(token).then(function(response) {

     $uibModalInstance.close(response.data.data);
   });
  }
}
}
$scope.upload = function(file,cb) {

Upload.upload({
  url: '/api/video/upload', //webAPI exposed to upload the file
  data:{file:file} //pass file as data, should be user ng-model
}).then(function (resp) {

      if(resp.data[0][1]['path']){

      $scope.fileUrl = resp.data[0][1]['path']

      cb($scope.fileUrl);
    }
    else {
        $scope.error = "Error uploading files"
      }
  })
}

}]);
