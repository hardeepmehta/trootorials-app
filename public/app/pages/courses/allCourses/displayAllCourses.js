
 // = angular.module('BlurAdmin.pages.dashboard');



var localstorageApp = angular.module('BlurAdmin.pages.courses.allCourses');
  localstorageApp.controller('displayAllCourses', ['$scope', '$filter', 'editableOptions', 'editableThemes','$window','$http','$uibModal', 'baProgressModal','localStorageService',
    function($scope, $filter, editableOptions, editableThemes,$window,$http,$uibModal, baProgressModal,localStorageService){

      console.log("retrieve" + localStorageService.get('TOKEN'))
        var token = localStorageService.get('TOKEN')
        if(token == null){
          $window.location.href = '/index.html';
        }

    $http.get("/api/all-courses")
    .then(function(response) {
      // console.log("hit");
      // console.log("response"+JSON.stringify(response.data.data));
      $scope.reciCourse = response.data.data;
    });
  }
]);
