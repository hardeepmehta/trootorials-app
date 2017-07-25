var localstorageApp = angular.module('BlurAdmin.pages.videos.allVideos');
localstorageApp.controller('TbleCtrl', ['$rootScope', '$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
  '$uibModal', 'baProgressModal', 'localStorageService', '$state', '$rootScope',

  function($rootScope, $scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal, localStorageService, $state, $rootScope) {
    console.log(localStorageService.get('TOKEN'));

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
        console.log("got 0");
        localStorageService.remove('TOKEN')
        $window.location.href = '/index.html';
      }
      $scope.users = response.data.data;
      console.log(response.data.data);
    });

    $scope.open = function(e, id, page, size, addOrEdit) {
      // $scope.bool = bool
      $scope.id = id
      $scope.display = true;
      var modalInstance = $uibModal.open({

        templateUrl: page,
        controller: 'ModalInstanceCtrl',
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
        // console.log("selectedItem"+JSON.stringify(selectedItem.data));

        $scope.users = selectedItem;
        // $scope.users.push(selectedItem.data)

      }, function() {
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
        $http.post("/api/delete-video/" + m + "?token=" + token).then(function(response) {
          $scope.users.splice($index, 1);
        });
        // $window.location.reload()
      } else {}
    }



    // $scope.open = function(e,id,page, size, addOrEdit) {
    //   $scope.id = id;
    //   $uibModal.open({
    //     animation: true,
    //     templateUrl: page,
    //     size: size,
    //     controller: ['$scope', '$http', 'id', function( $scope, $http, id ) {
    //       $scope.add = true ;
    //       $scope.form = {};
    //       $scope.levels = [{
    //          level: '1'
    //        },{
    //          level: '2'
    //        }];
    //
    //     $scope.getUser = function(id){
    //
    //        $scope.gotUser = {};
    //        $http.get("/api/get-user/"+id).then(function(response) {
    //       //console.log(response.data.response.data);
    //       $scope.gotUser = response.data.response.data;
    //       console.log($scope.gotUser.name);
    //       $scope.form.name = $scope.gotUser.name;  //set to fields
    //       $scope.form.mobile = $scope.gotUser.mobile;
    //       $scope.form.email = $scope.gotUser.email;
    //       $scope.form.password = $scope.gotUser.password;
    //     //  $scope.form.level = $scope.gotUser.level;
    //       $scope.form.level = $scope.levels[$scope.gotUser.level - 1];
    //     });
    // }



    //       $scope.updateCourse = function() {
    //       console.log("Update called");
    //         $scope.id = id;
    //
    //
    //         var m = parseInt(id);
    //         console.log($scope.form);
    //         console.log("level "+$scope.form.level.level);
    //         $http({
    //             method: 'POST',
    //             format: 'json',
    //             url: '/api/edit-user/'+m,
    //             data:JSON.stringify({
    //               name: $scope.form.name,
    //               mobile: $scope.form.mobile,
    //               email: $scope.form.email,
    //               password: $scope.form.password,
    //               level: $scope.form.level.level
    //             })
    //           })
    //           .then(function(success) {
    //             console.log("api");
    //             console.log("hit " + JSON.stringify(success));
    //             // $window.location.reload()
    //           }, function(error) {
    //             console.log("not hit " + JSON.stringify(error));
    //           });
    //       }
    //       if(addOrEdit == 1){
    //         $scope.getUser(id);
    //         $scope.add = false;
    //         //$scope.updateCourse();
    //       }
    //       else{
    //         $scope.add = true;
    //
    //       }
    //
    //
    //     }],
    //     resolve: {
    //       items: function() {
    //         return $scope.items;
    //       },
    //       id: function() {
    //         return $scope.id;
    //       }
    //     }
    //   });
    //
    // };

    $scope.openProgressDialog = baProgressModal.open;
    // editableOptions.theme = 'bs3';
    // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }
])


angular.module('BlurAdmin.pages.users').controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http', 'id', '$timeout', 'token', function($scope, $uibModalInstance, $http, id, $timeout, token) {
  $scope.form = {};
  $scope.test = '';
  // $scope.b = bool;
  console.log($scope.b);
  $scope.display = true;
  //console.log("---" + $scope.bool);
  // $scope.levels = [{
  //            level: 1
  //          },{
  //            level: 2
  //          }];
  //   $scope.public = [0,1];
  // $scope.form.public = $scope.public[0];
  console.log("id value " + id)

  // console.log("Bool value "+bool)

  //  $scope.gotUser = {};
  $http.get("/api/get-video/" + id + "?token=" + token).then(function(response) {
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
    console.log("public value"+$scope.form.public);
    console.log("test value "+$scope.test);
    var m = parseInt(id);
    console.log("scope form "+JSON.stringify($scope.form));
    // console.log("level "+$scope.form.level);
    $http({
        method: 'POST',
        format: 'json',
        url: '/api/edit-video/' + m + "?token=" + token,
        data: JSON.stringify({
          title: $scope.form.title,
          description: $scope.form.description,
          author: $scope.form.author,
          duration: $scope.form.duration,
          ispublic: $scope.form.public == undefined ? $scope.test : $scope.form.public
        })
      })
      .then(function(success) {
        console.log("******api");
        console.log("scope form "+JSON.stringify($scope.form));

        console.log("hit " + JSON.stringify(success));
        $http.get("/api/all-videos?token=" + token).then(function(response) {
          //  $scope.usersupdated = response.data.data;
          $uibModalInstance.close(response.data.data);
        });

        // $window.location.reload()
      }, function(error) {
        console.log("not hit " + JSON.stringify(error));
      });
  }
}]);
