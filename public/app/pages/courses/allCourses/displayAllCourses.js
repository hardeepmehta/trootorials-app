(function () {
  'use strict';

  // angular.module('BlurAdmin.pages.courses.addCourses')
  //     .controller('TablesPageCtrl', TablesPageCtrl);
  angular.module('BlurAdmin.pages.courses.allCourses')
  .controller('displayAllCourses', displayAllCourses);

  /** @ngInject */
  function displayAllCourses($scope, $filter, editableOptions, editableThemes,$window,$http,$uibModal, baProgressModal) {

    $http.get("http://localhost:7800/api/course"). then(function(response) {
      console.log("hit");
      console.log("response"+JSON.stringify(response.data.data));
      $scope.reciCourse = response.data.data;

    });

  }

})();
