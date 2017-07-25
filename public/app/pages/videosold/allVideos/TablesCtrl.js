

var localstorageApp = angular.module('BlurAdmin.pages.videos.allVideos');
localstorageApp.controller('TablesCtrl',['$scope', '$filter','$http', 'editableOptions', 'editableThemes','$window','$uibModal', 'baProgressModal','localStorageService',

  function ($scope, $filter, $http, editableOptions, editableThemes,$window,$uibModal, baProgressModal,localStorageService) {

    console.log(localStorageService.get('TOKEN'));
    var token = localStorageService.get('TOKEN')
    if(token == null){
      $window.location.href = '/index.html';
    }

    $http.get("/api/all-videos").then(function(response) {
                // console.log("hit");
                // console.log("response"+JSON.stringify(response.data.data));
                // // console.log("respomse data "+JSON.stringify(response.data));

               $scope.users = response.data.data;
            });

    $scope.removeUser = function(index) {
    // $window.alert('Are u sure??');
    if (confirm("Are You Sure U want to delete ??") == true) {
        $scope.users.splice(index, 1);
    } else {

    }

      // console.log('success');
    };

    // $scope.addUser = function() {
    //   // $scope.inserted = {
    //   //   id: $scope.users.length+1,
    //   //   name: '',
    //   //   status: null,
    //   //   group: null
    //   // };
    //   // $scope.users.push($scope.inserted);
    // };
    $scope.open = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    };
    $scope.openProgressDialog = baProgressModal.open;

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }

])
