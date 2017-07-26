var localstorageApp = angular.module('BlurAdmin.pages.courses.allCourses');
localstorageApp.controller('displayAllCourses', ['$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http', '$uibModal', 'baProgressModal', 'localStorageService',
  function($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal, localStorageService) {

    var token = null;
    // console.log("retrieve" + localStorageService.get('TOKEN'))
    token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/index.html';
    }
    token = token.substring(1, token.length - 1);

    $http.get("/api/all-courses?token=" + token)
      .then(function(response) {
        //  console.log("hit");
        //  console.log("response"+JSON.stringify(response));
        if (response.data.error === 0) {
          // console.log("got 0");
          localStorageService.remove('TOKEN')
          $window.location.href = '/index.html';
        }
        $scope.loading = true;
        setTimeout(function() {
          $scope.loading = false;
          $scope.$apply();
        }, 2000);
        $scope.reciCourse = response.data.data;
      });
  }
]);
