
var localstorageApp =  angular.module('BlurAdmin.pages.users');
  localstorageApp.controller('UserPageCtrl',['$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http', '$uibModal', 'baProgressModal','localStorageService',

  function ($scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal, baProgressModal,localStorageService) {

    console.log("retrieve" + localStorageService.get('TOKEN'))
    var token = localStorageService.get('TOKEN')

    $scope.users = [];
    $http.get("/api/all-users").then(function(response) {
      $scope.users = response.data.data;
    });

    $scope.createPost = function(named, mobiled, emailid, passwordv ,levelid) {
      console.log("called add");
      console.log(named)
      console.log(mobiled)

      console.log(emailid)
      console.log(passwordv)
      console.log(levelid)
      levelid = 1

      var data = {
        name: named,
        mobile: mobiled,
        email: emailid,
        password: passwordv,
        level: levelid
      }
      $http({
          method: 'POST',
          format: 'json',
          url: '/api/add-user',
          data: JSON.stringify({
            name: named,
            mobile: mobiled,
            email: emailid,
            password: passwordv,
            level: levelid
          })
        })
        .then(function(success) {
          console.log(success)
          // $http.get("/api/all-users").then(function(response) {
          //   $scope.users = response.data.data;
          // });
          $window.location.href = '/users.html'
          // $scope.users.push(data);
          //console.log("hit " + JSON.stringify(success));
          // $window.location.reload()
        }, function(error) {
          //console.log("not hit " + JSON.stringify(error));
        });
    }

    $scope.removeCourse = function(id) {
      var m = parseInt(id);
      if (confirm("Are you sure you want to delete?") == true) {
        $http.post("/api/delete-user/" + m).then(function(response) {
        });
        // $window.location.reload()
      } else {
      }
    }


    $scope.open = function(e,id,page, size, addOrEdit) {
      $scope.id = id;
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        controller: ['$scope', '$http', 'id', function( $scope, $http, id ) {
          $scope.add = true ;
          $scope.form = {};
          $scope.levels = [{
             level: '1'
           },{
             level: '2'
           }];

          $scope.getUser = function(id){

             $scope.gotUser = {};
             $http.get("/api/get-user/"+id).then(function(response) {
            //console.log(response.data.response.data);
            $scope.gotUser = response.data.response.data;
            console.log($scope.gotUser.name);
            $scope.form.name = $scope.gotUser.name;  //set to fields
            $scope.form.mobile = $scope.gotUser.mobile;
            $scope.form.email = $scope.gotUser.email;
            $scope.form.password = $scope.gotUser.password;
          //  $scope.form.level = $scope.gotUser.level;
            $scope.form.level = $scope.levels[$scope.gotUser.level - 1];
          });
      }



          $scope.updateCourse = function() {
          console.log("Update called");
            $scope.id = id;


            var m = parseInt(id);
            console.log($scope.form);
            console.log("level "+$scope.form.level.level);
            $http({
                method: 'POST',
                format: 'json',
                url: '/api/edit-user/'+m,
                data:JSON.stringify({
                  name: $scope.form.name,
                  mobile: $scope.form.mobile,
                  email: $scope.form.email,
                  password: $scope.form.password,
                  level: $scope.form.level.level
                })
              })
              .then(function(success) {
                console.log("api");
                console.log("hit " + JSON.stringify(success));
                // $window.location.reload()
              }, function(error) {
                console.log("not hit " + JSON.stringify(error));
              });
          }
          if(addOrEdit == 1){
            $scope.getUser(id);
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


])
