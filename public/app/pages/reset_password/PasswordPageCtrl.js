// var sql = require('services/encryptionService');

var localstorageApp = angular.module('BlurAdmin.pages.reset_password');
localstorageApp.controller('PasswordPageCtrl', ['$scope', '$window', '$http', 'localStorageService',
  function($scope, $window, $http, localStorageService) {
    $scope.error=""

    var token = localStorageService.get('TOKEN')
    if(token == null){
      $window.location.href = '/index.html';
    }
    token = token.substring(1, token.length - 1);
    $http.get("/api/loggedin/"+token).then(function(response) {
    console.log("response"+JSON.stringify(response.data.error))
    if(response.data.error == true){
      localStorageService.remove('TOKEN')
      $window.location.href = '/index.html';
    }
    });
    var currentPassword = ""

    token = token.substring(1, token.length - 1);
    $http.get("/api/show-password/" + token).then(function(response) {
      //  $scope.users = response.data.data;
      console.log("response here" + JSON.stringify(response.data.password));
      currentPassword = response.data.password
    });

    $scope.resetPassword = function() {
      console.log("old password" + $scope.form.oldPassword);

      if (currentPassword != $scope.form.oldPassword){
        $scope.error = "Current password doesnot match"
      }

      if ($scope.form.newPassword != $scope.form.confirmPassword){
        $scope.error = "New password and confirm password donot match"
      }

      if (currentPassword == $scope.form.oldPassword && $scope.form.newPassword == $scope.form.confirmPassword) {
        console.log("currentPassword matches ")
        $http({
            method: 'POST',
            format: 'json',
            url: '/api/update-password/' + token,
            data: JSON.stringify({
              new_password: $scope.form.newPassword,
              // confirm_password: $scope.form.currentPassword,
              //duration: durationd
            })
          })
          .then(function(success) {
              console.log("Successs" + success)
              $scope.error= "Password changed successfully"
            },
            function(error) {
              //console.log("not hit " + JSON.stringify(error));
            });
      }
    }
  }
]);
