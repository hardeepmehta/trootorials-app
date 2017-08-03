var localstorageApp = angular.module('LocalLogout', ['LocalStorageModule']);

localstorageApp.controller('LogoutCtrl', ['$scope', 'localStorageService', '$http', '$window', '$timeout', function($scope, localStorageService, $http, $window, $timeout) {

  console.log("retrieve " + localStorageService.get('TOKEN'))
  var token = localStorageService.remove('TOKEN');
  console.log("token value" + token)

  $timeout(function() {
    $window.location.href = '/trootorials-v1/index.html';
  }, 4000)
  // $window.location.href = '/index.html';

}]);
