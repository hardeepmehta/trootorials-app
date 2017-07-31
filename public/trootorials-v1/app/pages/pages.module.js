
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.courses',
    'BlurAdmin.pages.videos',
     'BlurAdmin.pages.users',
    'BlurAdmin.pages.reset_password',
    // 'BlurAdmin.pages.ui',
    // 'BlurAdmin.pages.form',
    // 'BlurAdmin.pages.tables',
    // 'BlurAdmin.pages.profile',
    // 'BlurAdmin.pages.signin',
    'LocalStorageModule',
    'ui.bootstrap',
    'ngFileUpload'
  ])
      .config(routeConfig);

  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');

  }
})();
