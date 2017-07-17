(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos', [
    'BlurAdmin.pages.videos.allVideos',
    'BlurAdmin.pages.videos.addVideos'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos', {
          url: '/videos',
          //templateUrl: 'app/pages/videos/videos.html',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Videos',
          sidebarMeta: {
            icon: 'ion-gear-a',
            order: 800,
          },
        });
  }

})();
