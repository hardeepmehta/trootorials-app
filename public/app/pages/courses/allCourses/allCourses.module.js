(function () {
  'use strict';

  angular.module('BlurAdmin.pages.courses.allCourses', ['LocalStorageModule','ngFileUpload'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('courses.allCourses', {
          url: '/allCourses',
          templateUrl: 'app/pages/courses/allCourses/allCourses.html',
          title: 'All Courses',
          controller:'displayAllCourses',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
