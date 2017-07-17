(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos.addVideos', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos.addVideos', {
          url: '/addVideos',
          templateUrl: 'app/pages/videos/addVideos/addVideos.html',
          title: 'Add Videos',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
