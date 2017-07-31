var localstorageApp = angular.module('LocalLogin', ['LocalStorageModule']);

localstorageApp.controller('LoginCtrl', ['$scope', 'localStorageService', '$http', '$window', function($scope, localStorageService, $http, $window) {

  // console.log("retrieve " + localStorageService.get('TOKEN'))

  if (localStorageService.get('TOKEN') != null) {
    $window.location.href = '/trootorials-v1/home.html';
  }

  $scope.error = ""
  // console.log("error"+$scope.error)

  $scope.login = function() {
    $http({
        method: 'POST',
        format: 'json',
        url: 'api/login',
        data: JSON.stringify({
          email: $scope.uemail,
          password: $scope.upasswd,
        })
      })
      .then(function(success) {
        // console.log(JSON.stringify(success))
        if (success.data.error == true) {
          // console.log(JSON.stringify(success.data.message))

          if( success.data.message == "password did not match")
            $scope.error = "Incorrect email or password"
          else
            $scope.error = "User doesnot exist"
        }
        else {
          // console.log(JSON.stringify(success.data.level))
          if (JSON.stringify(success.data.level) == 1) {
            var token = JSON.stringify(success.data.token)
            localStorageService.add('TOKEN', JSON.stringify(success.data.token)); // Password name added to local storage
            // console.log("retrieve " + localStorageService.get('TOKEN'))
            $window.location.href = '/trootorials-v1/home.html';
          }
          else {
            $scope.error = "You are not authorised"
          }
        }
      }, function(error) {
        $scope.error = "Incorrect email or password"
      });
  }
}]);
