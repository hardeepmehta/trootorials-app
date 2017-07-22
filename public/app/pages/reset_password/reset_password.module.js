(function () {
  'use strict';

  angular.module('BlurAdmin.pages.reset_password', ['LocalStorageModule'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('reset_password', {
          url: '/reset_password',
          templateUrl: 'app/pages/reset_password/reset_password.html',
          title: 'Reset Password',
          controller:'PasswordPageCtrl',
          sidebarMeta: {
            icon: 'ion-compose',
            order: 800,
          },
        });
  }

})();
