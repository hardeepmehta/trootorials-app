var localstorageApp = angular.module('BlurAdmin.pages.users');
localstorageApp.controller('UserPageCtrl', ['$rootScope', '$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
  '$uibModal', 'baProgressModal', 'localStorageService', '$state', '$rootScope',

  function($rootScope, $scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal, localStorageService, $state, $rootScope) {

    var token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/trootorials-v1/index.html';
    }
    token = token.substring(1, token.length - 1);

    $scope.users = [];

    $scope.id = 0;

    $http.get("/trootorials-v1/api/all-users?token=" + token).then(function(response) {
      if (response.data.error === 0) {
        // //console.log("got 0");
        localStorageService.remove('TOKEN')
        $window.location.href = '/trootorials-v1/index.html';
      }
      $scope.loading = true;
      setTimeout(function() {
        $scope.loading = false;
        $scope.$apply();
      }, 2000);
      $scope.users = response.data.data;
    });

    $scope.open = function(size, bool, id) {
      $scope.bool = bool
      $scope.id = id


      var modalInstance = $uibModal.open({
        templateUrl: 'app/pages/users/addUser.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$scope',
        size: size,
        resolve: {
          users: function() {
            return $scope.users;
          },
          bool: function() {
            return $scope.bool;
          },
          id: function() {
            return $scope.id;
          },
          token: function() {
            return token
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
          $scope.loading = true;
          setTimeout(function() {
            $scope.loading = false;
            $scope.$apply();
          }, 2000);
          if (bool == 0) {
            $scope.users = selectedItem;
          } else if (bool == 1) {
            $scope.users.push(selectedItem.data)

          }

          // //console.log("updates users" + JSON.stringify($scope.users))
        }
        // , function () {
        //   $log.info('Modal dismissed at: ' + new Date());
        // }
      );
    };



    $scope.removeUser = function(id, $index) {
      var m = parseInt(id);
        swal({
          title: "Are you sure?",
        text: "You will not be able to recover this User!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
        },
    function() {
      $http.post("/trootorials-v1/api/delete-user/" + m + "?token=" + token).then(function(response) {
        $scope.loading = true;
        swal({
          title: "Deleted",
          text: "User has been successfully deleted",
          type: "success"
        }, function() {
          // location.reload();
          // $scope.loading = false;
          setTimeout(function() {


            $scope.loading = false;


            $scope.$apply();
          }, 2000);
        });

          $scope.users.splice($index, 1);

      });
    });

    }

    $scope.openProgressDialog = baProgressModal.open;
    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }
])


angular.module('BlurAdmin.pages.users').controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http', 'bool', 'id', '$timeout', 'token','users','Upload',
 function($scope, $uibModalInstance, $http, bool, id, $timeout, token, users, Upload) {

  $scope.error = ""
  $scope.form = {};
  $scope.b = bool;
  // //console.log($scope.b);
  // //console.log("token" + token)
  $scope.levels = [{
    level: 1
  }, {
    level: 2
  }];
  if (bool == 1) {
    $scope.form.level = $scope.levels[1];

  }

  //console.log("id value " + id)

  //console.log("Bool value " + bool)
  if (bool == 0) {
    $http.get("/trootorials-v1/api/get-user/" + id + "/" + "?token=" + token).then(function(response) {
      // //console.log(response);
      // //console.log(response.data.response.data);
      $scope.form = response.data.response.data;
      $scope.form.level = $scope.levels[response.data.response.data.level - 1];
      // //console.log($scope.form.level);
    });
  }

  $scope.updatedCourse = function() {
    var count=0
    users.forEach(function(el){
      if(el.email == $scope.form.email)
      count++
    })
    if(count > 1 )
    $scope.error = "Title already exists"
    else {
      if($scope.form.file){
          // console.log($scope.form.file)
   $scope.upload($scope.form.file,function(url){
    // console.log("URL "+url)
  var m = parseInt(id);
  $http({
      method: 'POST',
      format: 'json',
      url: '/trootorials-v1/api/edit-user/' + m + '/' + '?token=' + token,
      data: JSON.stringify({
        name: $scope.form.name,
        mobile: $scope.form.mobile,
        email: $scope.form.email,
        imageUrl: url,
        level: $scope.form.level.level
      })
    })
    .then(function(success) {
      $http.get("/trootorials-v1/api/all-users/?token=" + token).then(function(response) {
        $uibModalInstance.close(response.data.data);
      });
    }
  );
})
}
else{
  var m = parseInt(id);
  $http({
      method: 'POST',
      format: 'json',
      url: '/trootorials-v1/api/edit-user/' + m + '/' + '?token=' + token,
      data: JSON.stringify({
        name: $scope.form.name,
        mobile: $scope.form.mobile,
        email: $scope.form.email,
        // password: $scope.form.password,
        level: $scope.form.level.level
      })
    })
    .then(function(success) {
      // //console.log("api");
      // //console.log("hit " + JSON.stringify(success));
      $http.get("/trootorials-v1/api/all-users/?token=" + token).then(function(response) {
        $uibModalInstance.close(response.data.data);
      });

    }, function(error) {
      // //console.log("not hit " + JSON.stringify(error));
    });
}
  }
}

  $scope.createPost = function(named, mobiled, emailid, levelid, file) {
    // //console.log(levelid);
    if (file) { //check if from is valid
        // console.log(file)
         $scope.upload(file,function(url){
          // console.log("URL "+url)
    var data = {
      name: named,
      mobile: mobiled,
      email: emailid,
      password: emailid,
      imageUrl: url,
      level: parseInt(levelid)
    }
    $http({
        method: 'POST',
        format: 'json',
        url: '/trootorials-v1/api/add-user/?token=' + token,
        data: JSON.stringify({
          name: named,
          mobile: mobiled,
          email: emailid,
          password: emailid,
          imageUrl: url,
          level: parseInt(levelid)
        })
      })
      .then(function(success) {
        // console.log(success)
        if (success.data.error == true)
          $scope.error = "User already exists. Please enter a new email id"

        else {
          $uibModalInstance.close(success.data.data);
        }
      }, function(error) {
        // //console.log("not hit " + JSON.stringify(error));
      });
    })
  }
  else{
    $scope.error = "Upload a file"
  }
  }

  $scope.upload = function(file,cb) {
    // console.log(file)
    Upload.upload({
        url: '/trootorials-v1/api/user/upload', //webAPI exposed to upload the file
        data:{file:file} //pass file as data, should be user ng-model
    }).then(function (resp) {
            if(resp.data[0][1]['path']){
            // return resp.data[0][1]['path']
            $scope.fileUrl = resp.data[0][1]['path']
            console.log($scope.fileUrl)
            cb($scope.fileUrl);
          }
            else {
              $scope.error = "Error uploading files"
            }
        })
    }

}]);
