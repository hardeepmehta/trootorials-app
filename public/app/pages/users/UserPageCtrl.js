
var localstorageApp =  angular.module('BlurAdmin.pages.users');
  localstorageApp.controller('UserPageCtrl',['$rootScope','$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
   '$uibModal', 'baProgressModal','localStorageService','$state','$rootScope',

  function ($rootScope,$scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal,localStorageService,$state,$rootScope) {

    var token = localStorageService.get('TOKEN')
    if(token == null){
      $window.location.href = '/index.html';
    }

    $scope.users = [];
    $scope.form = [];

    $scope.levels = [{
       level: '1'
     },{
       level: '2'
     }];

    $http.get("/api/all-users").then(function(response) {
      $scope.users = response.data.data;
    });


    $scope.modalPopup = function(){
      return $scope.modalInstance = $uibModal.open({
              templateUrl: 'app/pages/users/addUser.html',
              scope: $scope
            });
    }

    $scope.openModalPopup = function () {
      $scope.modalPopup().result
        .then(function (data) {
          console.log("success data in promise"+JSON.stringify(data));
          $scope.users = JSON.stringify(data)
          //console.log($scope.users);
          //$scope.users.push(success.data.data);

          console.log($scope.users);
        })
        .then(null, function (reason) {
          console.log("failure data" + reason);
          //$scope.handleDismiss(reason);
        });
    };

    $scope.removeCourse = function(id, $index) {
      var m = parseInt(id);
      if ($window.confirm("Are you sure you want to delete?") == true) {
        $http.post("/api/delete-user/" + m).then(function(response) {
          $scope.users.splice( $index, 1 );
        });
      } else {
      }
    }

    $scope.createPost = function(named, mobiled, emailid, passwordv ,levelid) {

      console.log("called add");
      console.log(named)
      console.log(mobiled)

      console.log(emailid)
      console.log(passwordv)
      console.log(levelid)
      //levelid = 1

      var data = {
        name: named,
        mobile: mobiled,
        email: emailid,
        password: passwordv,
        level: levelid
      }
      $http({
          method: 'POST',
          format: 'json',
          url: '/api/add-user',
          data: JSON.stringify({
            name: named,
            mobile: mobiled,
            email: emailid,
            password: passwordv,
            level: levelid
          })
        })
        .then(function(success) {
          console.log(success)
          $scope.modalInstance.close($scope.users);
          $state.go('users');
          console.log("success data"+JSON.stringify(success.data));
          console.log($scope.users);
          // $scope = scope
        }, function(error) {
          //console.log("not hit " + JSON.stringify(error));
        });
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
    //       $scope.getUser = function(id){
    //
    //          $scope.gotUser = {};
    //          $http.get("/api/get-user/"+id).then(function(response) {
    //         //console.log(response.data.response.data);
    //         $scope.gotUser = response.data.response.data;
    //         console.log($scope.gotUser.name);
    //         $scope.form.name = $scope.gotUser.name;  //set to fields
    //         $scope.form.mobile = $scope.gotUser.mobile;
    //         $scope.form.email = $scope.gotUser.email;
    //         $scope.form.password = $scope.gotUser.password;
    //       //  $scope.form.level = $scope.gotUser.level;
    //         $scope.form.level = $scope.levels[$scope.gotUser.level - 1];
    //       });
    //   }



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

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }


])
