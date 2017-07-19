(function() {
  'use strict';

  angular.module('BlurAdmin.pages.reset_password')
    .controller('PasswordPageCtrl', PasswordPageCtrl);


  /** @ngInject */
  function PasswordPageCtrl($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal) {

    $http.get("/api/show-password/"+"2").then(function(response) {
      $scope.users = response.data.data;
    });

    $scope.resetPassword = function (npassword,cpassword) {
      $http({
          method: 'POST',
          format: 'json',
          url: '/api/update-password/'+'2',
          data: JSON.stringify({
            new_password: npassword,
            confirm_password: cpassword,
            //duration: durationd
          })
        })
        .then(function(success) {
          //console.log("hit " + JSON.stringify(success));
          $window.location.reload()
        },
        function(error) {
          //console.log("not hit " + JSON.stringify(error));
        });
    }
}
