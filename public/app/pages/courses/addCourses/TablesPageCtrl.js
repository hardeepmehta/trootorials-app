/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.courses.addCourses')
    .controller('TablesPageCtrl', TablesPageCtrl);


  /** @ngInject */
  function TablesPageCtrl($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal) {

    $http.get("http://localhost:7800/api/course").then(function(response) {
      $scope.users = response.data.data;
    });


    $scope.createPost = function(titled, descriptiond, durationd) {
      $http({
          method: 'POST',
          format: 'json',
          url: 'http://localhost:7800/api/addCourse',
          data: JSON.stringify({
            title: titled,
            description: descriptiond,
            duration: durationd
          })
        })
        .then(function(success) {
          //console.log("hit " + JSON.stringify(success));
          $window.location.reload()
        }, function(error) {
          //console.log("not hit " + JSON.stringify(error));
        });
    }



    $scope.removeCourse = function(id) {
      var m = parseInt(id);
      if (confirm("Are you sure you want to delete?") == true) {
        $http.post("http://localhost:7800/api/courseDelete/" + m).then(function(response) {
        });
        $window.location.reload()
      } else {
      }
    };

    $scope.updateCourse = function(id,titled, descriptiond, durationd) {
      $window.location.reload()

     console.log("scope id"+id);
     console.log("scope title"+titled);
     console.log("scope descriptiond"+descriptiond);
     console.log("scope durationd"+durationd);
    //  console.log("scope user"+JSON.stringify($scope.users));


      var m = parseInt(id);
      $http({
          method: 'POST',
          format: 'json',
          url: 'http://localhost:7800/api/courseUpdate/'+m,
          data: JSON.stringify({
            title: titled,
            description: descriptiond,
            duration: durationd
          })
        })
        .then(function(success) {
          console.log("hit " + JSON.stringify(success));
          //$window.location.reload()
        }, function(error) {
          console.log("not hit " + JSON.stringify(error));
        });
    }

    // $scope.addUser = function() {
    //   // $http.post("http://localhost:7800/api/addCourse").then(function(response) {
    //   //         console.log("hit");
    //   //         console.log("response"+JSON.stringify(response.data.data));
    //   //         // console.log("respomse data "+JSON.stringify(response.data));
    //   //
    //   //       //  $scope.users = response.data.data;
    //   //     });
    //   $scope.inserted = {
    //     // id: $scope.users.length+1,
    //     title: '',
    //     description: null,
    //     duration: null
    //   };
    //   $scope.users.push($scope.inserted);
    // }
    $scope.open = function(page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
    };
    $scope.openProgressDialog = baProgressModal.open;

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }

})();
