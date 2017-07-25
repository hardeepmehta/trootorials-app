(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos.addVideos',['LocalStorageModule'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos.addVideos', {
          url: '/addVideos',
          templateUrl: 'app/pages/videos/addVideos/add2.html',
          title: 'Add Videos',
          controller:'addCtrl',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
