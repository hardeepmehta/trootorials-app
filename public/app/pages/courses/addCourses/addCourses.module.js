(function () {
  'use strict';

  angular.module('BlurAdmin.pages.courses.addCourses', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('courses.addCourses', {
          url: '/addCourses',
          templateUrl: 'app/pages/courses/addCourses/addCourses.html',
          title: 'Add Courses',
          controller:'TablesPageCtrl',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
