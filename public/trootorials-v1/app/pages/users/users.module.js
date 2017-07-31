(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users', ['LocalStorageModule','ui.bootstrap','ngFileUpload'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('users', {
          url: '/users',
          templateUrl: 'app/pages/users/users.html',
          title: 'All Users',
          controller:'UserPageCtrl',
          sidebarMeta: {
            icon: 'ion-android-contacts',
            order: 800,
          },
        });
  }

})();
