(function () {
  'use strict';

  angular.module('BlurAdmin.pages.courses.allCourses', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('courses.allCourses', {
          url: '/allCourses',
          templateUrl: 'app/pages/courses/allCourses/allCourses.html',
          title: 'All Courses',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
