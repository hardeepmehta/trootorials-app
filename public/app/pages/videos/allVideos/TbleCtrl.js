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
    ////console.log(localStorageService.get('TOKEN'));

    var token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/index.html';
    }
    token = token.substring(1, token.length - 1);

    $scope.users = [];
    $scope.display = true;
    // $scope.form = [];
    //$scope.bool = null;
    $scope.id = 0;
    $scope.redirect = function() {
      $window.location.href = "#/videos/addVideos";
    }
    $http.get("/api/all-videos?token=" + token).then(function(response) {
      if (response.data.error === 0) {
        ////console.log("got 0");
        localStorageService.remove('TOKEN')
        $window.location.href = '/index.html';
      }
      $scope.loading = true;
      setTimeout(function() {
        $scope.loading = false;
        $scope.$apply();
      }, 2000);
      $scope.users = response.data.data;
      ////console.log(response.data.data);
    });

    $scope.open = function(e, id, page, size, addOrEdit) {
      // $scope.bool = bool
      $scope.id = id
      $scope.display = true;
      var modalInstance = $uibModal.open({

        templateUrl: 'app/pages/videos/addVideos/add3.html',
        controller: 'ModalInstanceCtrl1',
        controllerAs: '$scope',
        size: size,
        // appendTo: parentElem,
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
        // ////console.log("selectedItem"+JSON.stringify(selectedItem.data));
        $scope.loading = true;
        setTimeout(function() {
          $scope.loading = false;
          $scope.$apply();
        }, 2000);

        $scope.users = selectedItem;
        // $scope.users.push(selectedItem.data)

      }, function() {
        // $log.info('Modal dismissed at: ' + new Date());
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
        });
        // $window.location.reload()
      } else {}
    }



    $scope.openProgressDialog = baProgressModal.open;
    // editableOptions.theme = 'bs3';
    // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
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
          ////console.log(element[0].files[0].name);
        });
      });
    }
  };
}]);
var u = 0;
var q = 0;
var k = 0;
myApp.service('fileUpload', ['$http', '$window','$timeout', function($http, $window,$timeout) {
  this.uploadFileToUrl = function(file, uploadUrl,t) {
    var fd = new FormData();
    var filename = file.name.replace(file.name.substring(file.name.lastIndexOf('/') + 1), ""),
      uuid = generateUUID();
    filename = filename + uuid;
    q = filename;
    //      ////console.log(filename,file);
    // file['name'] = filename
    // ////console.log(file.name);
    fd.append('file', file, filename);
    return  $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        uploadEventHandlers: {
        progress: function (e) {
                  if (e.lengthComputable) {
                     t.progressBar = (e.loaded / e.total) * 100;
                     t.view = true;
                    //  var progressCounter = $scope.progressBar;
                     ////console.log(t.progressBar);
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
  this.submit = function(f, uploadUrl,t) {
    t.error = ""
    $http({
        method: 'POST',
        format: 'json',
        url: uploadUrl,
        data: JSON.stringify(f)
      })
      .then(function(res) {
        //////console.log("hit " + JSON.stringify(success));
        ////console.log(success);
        // alert('successfully updated');
        // console.log(res.data)

        if(res.data.error == true){
          // console.log(res.data.error)
          t.error=res.data.reason;
        }
        else{
        t.success = true;
        t.f ={};

        $timeout(function() {
        $window.location.href = "#/videos/allVideos"
      },3000);
    }
        // $window.location.reload()
      }
      // , function(error) {
        //////console.log("not hit " + JSON.stringify(error));
      // }
    );
  }
  this.getVideo = function(id,m,token){
    $http.get("/api/get-video/" + id + "?token=" + token).then(function(response) {
         ////console.log(response);
        ////console.log(response.data.response.data);
      m.form = response.data.response.data;
      m.u = response.data.response.data.ispublic;
      m.k = response.data.response.data.file;
      ////console.log(response.data.response.data.file);

    })
  }
  this.all = function(token){
    return $http.get("/api/all-videos?token=" + token);
    ////console.log(token);
  }

}]);

myApp.controller('ModalInstanceCtrl1', ['$scope', '$uibModalInstance',   'id', '$timeout', 'fileUpload','token',function ($scope, $uibModalInstance,id,$timeout,fileUpload,token) {
  $scope.form = {};
  $scope.test = '';
  // $scope.b = bool;
  // ////console.log($scope.b);
  // $scope.display = true;

  ////console.log("id value " + id)
  ////console.log($scope.k);
  ////console.log(k);
  ////console.log($scope.myFile);
  fileUpload.getVideo(id,$scope,token);
  $scope.updateVideo = function() {
    ////console.log($scope.myFile);
    if($scope.myFile!=undefined){

      var file = $scope.myFile;
    var uploadUrl = "/upload?token=" + token;
    var promise = fileUpload.uploadFileToUrl(file, uploadUrl,$scope);
    promise.then(function(res){
      if(res.data.error = "false"){
        ////console.log('working code');
        $scope.var = {
          title: $scope.form.title,
          description: $scope.form.description,
          author: $scope.form.author,
          duration: $scope.form.duration,
          ispublic: $scope.form.public == undefined ? $scope.test : $scope.form.public,
           file: q
         }
        //  console.log($scope.form.public);
         ////console.log(u);
         var uploadUrl = "/api/edit-video/"+id + "?token=" + token;
        var k = fileUpload.submit($scope.var, uploadUrl,$scope);
        fileUpload.all(token).then(function(response) {
              //  $scope.usersupdated = response.data.data;
                $uibModalInstance.close(response.data.data);
              });
            }
            else{
        ////console.log('error in  uploading');
        }
      })
    }
    else{
    // alert('working');
    $scope.var = {
      title: $scope.form.title,
      description: $scope.form.description,
      author: $scope.form.author,
      duration: $scope.form.duration,
      ispublic: $scope.form.public 
     }
    var uploadUrl = "/api/edit-video/"+id+ "?token=" + token;
   var i = fileUpload.submit($scope.var, uploadUrl,$scope);
   fileUpload.all(token).then(function(response) {
     //  $scope.usersupdated = response.data.data;
       $uibModalInstance.close(response.data.data);
     });
  }
}
}]);
