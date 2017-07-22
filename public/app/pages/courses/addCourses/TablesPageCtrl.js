
/** @ngInject */
var localstorageApp = angular.module('BlurAdmin.pages.courses.addCourses');
    localstorageApp.controller('TablesPageCtrl',['$scope', '$filter', 'editableOptions', 'editableThemes','$window', '$http', '$uibModal','baProgressModal','localStorageService',

  function ($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal,localStorageService) {

    console.log("retrieve" + localStorageService.get('TOKEN'))
    var token = localStorageService.get('TOKEN')
    if(token == null){
      $window.location.href = '/index.html';
    }
    
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
          $window.location.reload()
        }, function(error) {
        });
    }

    $scope.removeCourse = function(id) {
      var m = parseInt(id);
      if (confirm("Are you sure you want to delete?") == true) {
        $http.post("http://localhost:7800/api/delete-course/" + m).then(function(response) {
        });
        $window.location.reload()
      } else {
      }
    };



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
    $scope.open = function(e,id,page, size, addOrEdit) {
      $scope.id = id;
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        controller: ['$scope', '$http', 'id', function( $scope, $http, id ) {
          $scope.add = true ;
          $scope.form = {};

          $scope.getCourse = function(id){
             $scope.gotCourse = {};
             $http.get("/api/get-course/"+id).then(function(response) {
             $scope.gotCourse = response.data.response.data;
            console.log($scope.gotCourse);
            $scope.form.title = $scope.gotCourse.title;  //set to fields
            $scope.form.description = $scope.gotCourse.description;
            $scope.form.duration = $scope.gotCourse.duration;



          });
      }



          $scope.updateCourse = function() {
          console.log("Update called");
            $scope.id = id;

            var m = parseInt(id);
            console.log($scope.form);
            $http({
                method: 'POST',
                format: 'json',
                url: '/api/edit-course/'+m,
                data:JSON.stringify({
                  title: $scope.form.title,
                  description: $scope.form.description,
                  duration: $scope.form.duration
                })
              })
              .then(function(success) {
                console.log("api");
                console.log("hit " + JSON.stringify(success));
                //$window.location.reload()
              }, function(error) {
                console.log("not hit " + JSON.stringify(error));
              });
          }
          if(addOrEdit == 1){
            $scope.getCourse(id);
            $scope.add = false;
            //$scope.updateCourse();
          }
          else{
            $scope.add = true;

          }


        }],
        resolve: {
          items: function() {
            return $scope.items;
          },
          id: function() {
            return $scope.id;
          }
        }
      });
    };
    $scope.openProgressDialog = baProgressModal.open;

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }

]);
