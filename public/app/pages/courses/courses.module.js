(function () {
  'use strict';

  angular.module('BlurAdmin.pages.courses', [
    'BlurAdmin.pages.courses.allCourses',
    'BlurAdmin.pages.courses.addCourses'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('courses', {
          url: '/courses',
          //templateUrl: 'app/pages/courses/courses.html',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Courses',
          sidebarMeta: {
            icon: 'ion-document',
            order: 800,
          },
        });
  }
})();
