

var localstorageApp = angular.module('BlurAdmin.pages.videos.allVideos');
localstorageApp.controller('TablesCtrl',['$scope', '$filter','$http', 'editableOptions', 'editableThemes','$window','$uibModal', 'baProgressModal','localStorageService',

  function ($scope, $filter, $http, editableOptions, editableThemes,$window,$uibModal, baProgressModal,localStorageService) {

    console.log(localStorageService.get('TOKEN'));
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
    $scope.display=true;
    $http.get("/api/all-videos").then(function(response) {
                // console.log("hit");
                // console.log("response"+JSON.stringify(response.data.data));
                // // console.log("respomse data "+JSON.stringify(response.data));

               $scope.users = response.data.data;
            });

            $scope.redirect = function () {
                $window.location.href = "#/videos/addVideos";
            }


    $scope.removeVideo = function(id, $index) {
      var m = parseInt(id);
      if ($window.confirm("Are you sure you want to delete?") == true) {
        $http.post("/api/delete-video/" + m).then(function(response) {
          $scope.users.splice( $index, 1 );
        });
        // $window.location.reload()
      } else {
      }
    }


    $scope.open = function(e,id,page, size, addOrEdit) {
      $scope.id = id;
      $scope.display=true;
      console.log(id);
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        controller: ['$scope', '$http', 'id', function( $scope, $http, id ) {
          $scope.add = true ;

          $scope.form = {};

          console.log(id);

          $scope.getVideo = function(id){

             $scope.gotVideo = {};
             $http.get("/api/get-video/"+id).then(function(response) {
            console.log(response.data.response.data);
            $scope.gotVideo = response.data.response.data;
            $scope.form.title = $scope.gotVideo.title;
            $scope.form.description = $scope.gotVideo.description;
            $scope.form.author = $scope.gotVideo.author;
            $scope.form.duration = $scope.gotVideo.duration;
            $scope.form.public = $scope.gotVideo.ispublic;


          });
        }
        $scope.updateVideo = function() {
        console.log("Update called");
          $scope.id = id;

          console.log('working');
          var m = parseInt(id);
          console.log($scope.form);
          // console.log("level "+$scope.form.level.level);
          $http({
              method: 'POST',
              format: 'json',
              url: '/api/edit-video/'+m,
              data:JSON.stringify({
                title: $scope.form.title,
                description: $scope.form.description,
                author: $scope.form.author,
                duration: $scope.form.duration,
                ispublic: $scope.form.public
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
          $scope.getVideo(id);
          $scope.updateVideo();
          $scope.add = false;
          $scope.display=true;
          //$scope.updateCourse();
        }
        else{
          $scope.add = true;

        }


      //
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
