/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
      .controller('UserPageCtrl', UserPageCtrl);

  /** @ngInject */
  function UserPageCtrl($scope, $filter, editableOptions, editableThemes,$window) {



    $scope.users = [
      {
        "UserId": 1,
        "CourseId": 1,
        "PaymentId": 454545,
        "CourseName": "MEAN STACK",

      },
      {
        "UserId": 1,
        "CourseId": 2,
        "PaymentId": 454545,
        "CourseName": "FULL STACK",

      },
      {
        "UserId": 1,
        "CourseId": 3,
        "PaymentId": 454545,
        "CourseName": "MEAN STACK",

      },
      {
        "UserId": 1,
        "CourseId": 4,
        "PaymentId": 2454545,
        "CourseName": "MEAN STACK",

      }

    ];

    // $scope.statuses = [
    //   {value: 1, text: 'Good'},
    //   {value: 2, text: 'Awesome'},
    //   {value: 3, text: 'Excellent'},
    // ];

    // $scope.groups = [
    //   {id: 1, text: '30 hours'},
    //   {id: 2, text: '35 hours'},
    //   {id: 3, text: '40 hours'},
    //   {id: 4, text: '40 hours'}
    // ];
    //
    // $scope.showGroup = function(user) {
    //   if(user.group && $scope.groups.length) {
    //     var selected = $filter('filter')($scope.groups, {id: user.group});
    //     return selected.length ? selected[0].text : 'Not set';
    //   } else return 'Not set'
    // };
    //
    // $scope.showStatus = function(user) {
    //   var selected = [];
    //   if(user.status) {
    //     selected = $filter('filter')($scope.statuses, {value: user.status});
    //   }
    //   return selected.length ? selected[0].text : 'Not set';
    // };


    $scope.removeUser = function(index) {
      if (confirm("Are you sure you want to delete?") == true) {
          $scope.users.splice(index, 1);
      } else {

      }

    };

    $scope.addUser = function() {
      $scope.inserted = {
        id: $scope.users.length+1,
        name: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
    };

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }

})();
