/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos.allVideos')
      .controller('TablesCtrl', TablesPageCtrl);

  /** @ngInject */
  function TablesPageCtrl($scope, $filter, editableOptions, editableThemes,$window,$uibModal, baProgressModal) {



    $scope.users = [
      {
        "CourseId": 1,
        "videoID":1,
        "title":'hello',
        "thumbnail":'assets/img/app/thumbnail.jpg',
        "name": "Esther Vang",
        "author": 'admin',

      },
      {
        "CourseId": 1,
        "videoID":2,
        "title":'hello',
        "thumbnail":'assets/img/app/thumbnail.jpg',
        "name": "Esther Vang",
        "author": 'admin',

      },
      {
        "CourseId": 1,
        "videoID":3,
        "title":'hello',
        "thumbnail":'assets/img/app/thumbnail.jpg',
        "name": "Esther Vang",
        "author": 'admin',

      },
      {
        "CourseId": 1,
        "videoID":4,
        "title":'hello',
        "thumbnail":'assets/img/app/thumbnail.jpg',
        "name": "Esther Vang",
        "author": 'admin',

      },
      {
        "CourseId": 1,
        "videoID":5,
        "title":'hello',
        "thumbnail":'assets/img/app/thumbnail.jpg',
        "name": "Esther Vang",
        "author": 'admin',

      }

    ];

    $scope.statuses = [
      {value: 1, text: 'Good'},
      {value: 2, text: 'Awesome'},
      {value: 3, text: 'Excellent'},
    ];

    $scope.groups = [
      {id: 1, text: 'user'},
      {id: 2, text: 'customer'},
      {id: 3, text: 'vip'},
      {id: 4, text: 'admin'}
    ];

    $scope.showGroup = function(user) {
      if(user.group && $scope.groups.length) {
        var selected = $filter('filter')($scope.groups, {id: user.group});
        return selected.length ? selected[0].text : 'Not set';
      } else return 'Not set'
    };

    $scope.showStatus = function(user) {
      var selected = [];
      if(user.status) {
        selected = $filter('filter')($scope.statuses, {value: user.status});
      }
      return selected.length ? selected[0].text : 'Not set';
    };


    $scope.removeUser = function(index) {
    // $window.alert('Are u sure??');
    if (confirm("Are You Sure U want to delete ??") == true) {
        $scope.users.splice(index, 1);
    } else {

    }

      // console.log('success');
    };

    // $scope.addUser = function() {
    //   // $scope.inserted = {
    //   //   id: $scope.users.length+1,
    //   //   name: '',
    //   //   status: null,
    //   //   group: null
    //   // };
    //   // $scope.users.push($scope.inserted);
    // };
    $scope.open = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        resolve: {
          items: function () {
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
