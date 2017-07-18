/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.courses.addCourses')
      .controller('TablesPageCtrl', TablesPageCtrl);

  /** @ngInject */
  function TablesPageCtrl($scope, $filter, editableOptions, editableThemes,$window,$http,$uibModal, baProgressModal) {

    $http.get("http://localhost:7800/api/course").then(function(response) {
                console.log("hit");
                console.log("response"+JSON.stringify(response.data.data));
                // console.log("respomse data "+JSON.stringify(response.data));

               $scope.users = response.data.data;
            });



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
    $scope.createPost = function () {
        $scope.form ={
          title:'',
          description:'',
          duration:''
        }
        // console.log($scope.obj);
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': '"application/json; charset=utf-8";',
                    // 'dataType': '"json"'
                    // 'Content-Type': undefined
                }
            }
        // var parameter = JSON.stringify($scope.obj);
        $http.post("http://localhost:7800/api/addCourse",$scope.form,config).then(function(response) {
                console.log("hit");
                console.log(response);
                console.log("response"+JSON.stringify(response));
                // console.log("respomse data "+JSON.stringify(response.data));

              //  $scope.users = response.data.data;
            });


        // console.log(  $scope.obj);
    }



    $scope.removeUser = function(id) {
      var m = parseInt(id);
      if (confirm("Are you sure you want to delete?") == true) {
          // $scope.users.splice(index, 1);
          $http.post("http://localhost:7800/api/courseDelete/"+m).then(function(response) {
          //         console.log("hit");
                  console.log(response);
          //         // console.log("respomse data "+JSON.stringify(response.data));
          //
          //       //  $scope.users = response.data.data;
              });
      } else {

      }

    };



    $scope.addUser = function() {
      // $http.post("http://localhost:7800/api/addCourse").then(function(response) {
      //         console.log("hit");
      //         console.log("response"+JSON.stringify(response.data.data));
      //         // console.log("respomse data "+JSON.stringify(response.data));
      //
      //       //  $scope.users = response.data.data;
      //     });
      $scope.inserted = {
        // id: $scope.users.length+1,
        title: '',
        description: null,
        duration: null
      };
      $scope.users.push($scope.inserted);
    }
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
