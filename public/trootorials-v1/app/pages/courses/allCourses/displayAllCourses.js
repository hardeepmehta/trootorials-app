var localstorageApp = angular.module('BlurAdmin.pages.courses.allCourses');
localstorageApp.controller('displayAllCourses', ['$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http', '$uibModal', 'baProgressModal', 'localStorageService',
  function($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal, localStorageService) {

    var token = null;
    $scope.clicked = false;

    // console.log("retrieve" + localStorageService.get('TOKEN'))
    token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/trootorials-v1/index.html';
    }
    token = token.substring(1, token.length - 1);

    $http.get("/trootorials-v1/api/all-courses?token=" + token)
      .then(function(response) {
        //  console.log("hit");
        //  console.log("response"+JSON.stringify(response));
        if (response.data.error === 0) {
          // console.log("got 0");
          localStorageService.remove('TOKEN')
          $window.location.href = '/trootorials-v1/index.html';
        }
        $scope.loading = true;
        setTimeout(function() {
          $scope.loading = false;
          $scope.$apply();
        }, 2000);
        $scope.reciCourse = response.data.data;
      });

      $scope.courseClicked = function(id){
        $scope.clicked = true;
        $scope.videos=[];

        $http.get("/trootorials-v1/api/videos/" + id +"/"+"?token="+token).then(function(response) {
        var arr = response.data.data
        // console.log(JSON.stringify(response.data.response.data));
        // console.log(arr);
        for(var i = 0;i<arr.length;i++){
          console.log(arr[i].videoid);
          // $http.get("/api/get-video/" + arr[i].videoid+ "?token=" + token).then(function(response) {
            // console.log(response.data.response.data);
        var d = {
          videoid: arr[i].videoid,
          title: arr[i].title,
          description: arr[i].description
        }
        $scope.videos.push(d);
      }
    });
    }
  // });
}
// }
]);
