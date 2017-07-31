(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos.addVideos',['LocalStorageModule','angular-loading-bar','ngAnimate','ngFileUpload'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos.addVideos', {
          url: '/addVideos',
          templateUrl: 'app/pages/videos/addVideos/add3.html',
          title: 'Add Videos',
          controller:'addCtrl',
          sidebarMeta: {
            //icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
