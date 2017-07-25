
var localstorageApp =  angular.module('BlurAdmin.pages.videos.allVideos');
  localstorageApp.controller('TbleCtrl',['$rootScope','$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
   '$uibModal', 'baProgressModal','localStorageService','$state','$rootScope',

  function ($rootScope,$scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal,localStorageService,$state,$rootScope) {

    var token = localStorageService.get('TOKEN')
    if(token == null){
      $window.location.href = '/index.html';
    }
    token = token.substring(1, token.length - 1);
    $http.get("/api/loggedin/"+token).then(function(response) {
    console.log("response"+JSON.stringify(response.data.error))
    if(response.data.error == true){
      localStorageService.remove('TOKEN')
      $window.location.href = '/index.html';
    }
    });
    $scope.users = [];
    $scope.display=true;
    // $scope.form = [];
    //$scope.bool = null;
    $scope.id = 0;
    $scope.redirect = function () {
        $window.location.href = "#/videos/addVideos";
    }
    $http.get("/api/all-videos").then(function(response) {
              $scope.users = response.data.data;
               console.log(response.data.data);
            });

    $scope.open = function(e,id,page, size, addOrEdit) {
      // $scope.bool = bool
      $scope.id = id
      $scope.display=true;
      var modalInstance = $uibModal.open({
        // animation: $ctrl.animationsEnabled,
        // ariaLabelledBy: 'modal-title',
        // ariaDescribedBy: 'modal-body',
        templateUrl: page,
        controller: 'ModalInstanceCtrl',
        controllerAs: '$scope',
        size: size,
        // appendTo: parentElem,
        resolve: {
          users: function () {
            return $scope.users;
          },

          id: function () {
            return $scope.id;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        // console.log("selectedItem"+JSON.stringify(selectedItem.data));

          $scope.users = selectedItem;
          // $scope.users.push(selectedItem.data)

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    // $scope.modalPopup = function(){
    //   return $scope.modalInstance = $uibModal.open({
    //           templateUrl: 'app/pages/users/addUser.html',
    //           scope: $scope
    //         });
    // }
    //
    // $scope.openModalPopup = function () {
    //   $scope.modalPopup().result
    //     .then(function (data) {
    //       console.log("success data in promise"+JSON.stringify(data));
    //       $scope.users = JSON.stringify(data)
    //       //console.log($scope.users);
    //       //$scope.users.push(success.data.data);
    //
    //       console.log($scope.users);
    //     })
    //     .then(null, function (reason) {
    //       console.log("failure data" + reason);
    //       //$scope.handleDismiss(reason);
    //     });
    // };

    $scope.removeVideo = function(id, $index) {
      var m = parseInt(id);
      if ($window.confirm("Are you sure you want to delete?") == true) {
        $http.post("/api/delete-video/" + m).then(function(response) {
          $scope.users.splice( $index, 1 );
        });
        // $window.location.reload()
      } else {
      }
    }




    $scope.openProgressDialog = baProgressModal.open;
    // editableOptions.theme = 'bs3';
    // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }
])
// // directive
// localstorageApp.directive('fileModel', ['$parse', function($parse) {
//   return {
//     restrict: 'A',
//     link: function(scope, element, attrs) {
//       var model = $parse(attrs.fileModel);
//       var modelSetter = model.assign;
//
//       element.bind('change', function() {
//         scope.$apply(function() {
//           modelSetter(scope, element[0].files[0]);
//           console.log(element[0].files[0].name);
//         });
//       });
//     }
//   };
// }]);
// var q = '';
// //service
// localstorageApp.service('fileUpload', ['$http', '$window','$timeout', function($http, $window,$timeout) {
//   this.uploadFileToUrl = function(file, uploadUrl,t) {
//     var fd = new FormData();
//     var filename = file.name.replace(file.name.substring(file.name.lastIndexOf('/') + 1), ""),
//       uuid = generateUUID();
//     filename = filename + uuid;
//     q = filename;
//     //      console.log(filename,file);
//     // file['name'] = filename
//     // console.log(file.name);
//     fd.append('file', file, filename);
//     return  $http.post(uploadUrl, fd, {
//         transformRequest: angular.identity,
//         uploadEventHandlers: {
//         progress: function (e) {
//                   if (e.lengthComputable) {
//                      t.progressBar = (e.loaded / e.total) * 100;
//                      t.view = true;
//                     //  var progressCounter = $scope.progressBar;
//                      console.log(t.progressBar);
//                   }
//         }
//     },
//         headers: {
//           'Content-Type': undefined
//         }
//       })
//       .success(function(res) {
//         // alert('successfully uploaded');
//         return res;
//       })
//       .error(function() {});
//   }
//   this.submit = function(f, uploadUrl,t) {
//     $http({
//         method: 'POST',
//         format: 'json',
//         url: uploadUrl,
//         data: JSON.stringify(f)
//       })
//       .then(function(success) {
//         //console.log("hit " + JSON.stringify(success));
//         console.log(success);
//         // alert('successfully updated');
//         t.success = true;
//         t.f ={};
//
//         $timeout(function() {
//         $window.location.href = "#/videos/allVideos"
//       },3000);
//         // $window.location.reload()
//       }, function(error) {
//         //console.log("not hit " + JSON.stringify(error));
//       });
//   }
// }]);


angular.module('BlurAdmin.pages.users').controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http',  'id', '$timeout', function ($scope, $uibModalInstance,$http,id,$timeout) {
  $scope.form = {};
  $scope.test = '';
  // $scope.b = bool;
  console.log($scope.b);
$scope.display=true;
  //console.log("---" + $scope.bool);
  // $scope.levels = [{
  //            level: 1
  //          },{
  //            level: 2
  //          }];
//   $scope.public = [0,1];
// $scope.form.public = $scope.public[0];
  console.log("id value "+id)

  // console.log("Bool value "+bool)
console.log($scope.Myfile);
      //  $scope.gotUser = {};
       $http.get("/api/get-video/"+id).then(function(response) {
         console.log(response);
        //  console.log(response.data.data);
        console.log(response.data.response.data);
        $scope.form = response.data.response.data;
        // $scope.form.public = response.data.response.data.ispublic;
        $scope.test = response.data.response.data.ispublic;
        // console.log($scope.form.level);
        // $scope.form.level = $scope.levels[response.data.response.data.level - 1];
        // console.log($scope.form.level);
    });

  $scope.updateVideo = function() {
        console.log("Update called");
        console.log($scope.form.file);
        // console.log($scope.form.file.name);
          var m = parseInt(id);
          console.log($scope.form);
          // console.log("level "+$scope.form.level);
          $http({
              method: 'POST',
              format: 'json',
              url: '/api/edit-video/'+m,
              data:JSON.stringify({
                title: $scope.form.title,
                description: $scope.form.description,
                // file:$scope.form.file,
                author: $scope.form.author,
                duration: $scope.form.duration,
                ispublic: $scope.form.public == undefined?$scope.test:parseInt($scope.form.public)
              })
            })
            .then(function(success) {
              console.log("api");
              console.log("hit " + JSON.stringify(success));
              $http.get("/api/all-videos").then(function(response) {
              //  $scope.usersupdated = response.data.data;
                $uibModalInstance.close(response.data.data);
              });

              // $window.location.reload()
            }, function(error) {
              console.log("not hit " + JSON.stringify(error));
            });
        }
}]);
