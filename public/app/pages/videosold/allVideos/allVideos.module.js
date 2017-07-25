(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos.allVideos', ['LocalStorageModule'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos.allVideos', {
          url: '/allVideos',
          templateUrl: 'app/pages/videos/allVideos/allVideos.html',
          title: 'All Videos',
          controller: 'TablesCtrl',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
