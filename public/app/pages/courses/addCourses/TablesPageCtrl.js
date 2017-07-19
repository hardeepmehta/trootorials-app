/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
// const Sequelize = require('sequelize');


(function() {
  'use strict';

  angular.module('BlurAdmin.pages.courses.addCourses')
    .controller('TablesPageCtrl', TablesPageCtrl);

  /** @ngInject */
  function TablesPageCtrl($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal) {

    // express = require('express'),
    // console.log("environment:"+process.env['MYSQL_HOST']);

    $http.get("/api/all-courses").then(function(response) {
      $scope.users = response.data.data;
    });


    $scope.createPost = function(titled, descriptiond, durationd) {
      $http({
          method: 'POST',
          format: 'json',
          url: '/api/add-course',
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
        $http.post("/api/delete-course/" + m).then(function(response) {
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
          url: '/api/edit-course/'+m,
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
