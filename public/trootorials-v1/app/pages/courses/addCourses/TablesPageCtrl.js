var localstorageApp = angular.module('BlurAdmin.pages.courses.addCourses');
localstorageApp.controller('TablesPageCtrl', ['$rootScope', '$scope', '$filter', 'editableOptions', 'editableThemes', '$window', '$http',
  '$uibModal', 'baProgressModal', 'localStorageService', '$state', '$rootScope','Upload',

  function($rootScope, $scope, $filter, editableOptions, editableThemes, $window, $http, $uibModal,
    baProgressModal, localStorageService, $state, $rootScope,Upload) {
    var token = null
    // console.log("retrieve" + localStorageService.get('TOKEN'))
    token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/trootorials-v1/index.html';
    }
    token = token.substring(1, token.length - 1);

    $scope.courses = [];
    $scope.id = 0;

    $http.get("/trootorials-v1/api/all-courses?token=" + token).then(function(response) {
      //   console.log(response.data.data);
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
      $scope.courses = response.data.data;
    });

    $scope.open = function(size, bool, id) {
      $scope.bool = bool
      $scope.id = id

      var modalInstance = $uibModal.open({
        // animation: $ctrl.animationsEnabled,
        // ariaLabelledBy: 'modal-title',
        // ariaDescribedBy: 'modal-body',
        templateUrl: 'app/pages/courses/addCourses/add.html',
        controller: 'ModalInstanceCtrlCourse',
        controllerAs: '$scope',
        size: size,
        // appendTo: parentElem,
        resolve: {
          courses: function() {
            return $scope.courses;
          },
          bool: function() {
            return $scope.bool;
          },
          id: function() {
            return $scope.id;
          },
          token: function() {
            return token;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
          // console.log("Modal closed ")
          // console.log("selectedItem"+JSON.stringify(selectedItem));
          $scope.loading = true;

          if (bool == 0) {
            $scope.courses = selectedItem;
          } else if (bool == 1) {
            //console.log($scope.courses)
            if($scope.courses != undefined)
              $scope.courses.push(selectedItem)
            else {

              var arr = [];
              arr[0] = selectedItem;
              $scope.courses = arr;
            }
          }
          setTimeout(function() {
            $scope.loading = false;
            $scope.$apply();
          }, 2000);
          // $scope.$apply();
          //  console.log($scope.form);
          // console.log("updates users"+JSON.stringify($scope.users))
        },
        //    function () {
        //     $log.info('Modal dismissed at: ' + new Date());
        //   }
      );
    };



    $scope.removeCourse = function(id, $index) {
      var m = parseInt(id);
        swal({
          title: "Are you sure?",
        text: "You will not be able to recover this Course!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
        },
    function() {
      $http.post("/trootorials-v1/api/delete-course/" + m + "?token=" + token).then(function(response) {
        $scope.loading = true;
        swal({
          title: "Deleted",
          text: "Course has been successfully deleted",
          type: "success"
        }, function() {
          // location.reload();
          // $scope.loading = false;
          setTimeout(function() {


            $scope.loading = false;


            $scope.$apply();
          }, 2000);
        });

          $scope.courses.splice($index, 1);
        $http.post("/trootorials-v1/api/deletecourse-mapping/" + m + "?token=" + token).then(function(response) {

        });
      });
    });

    }



    $scope.openProgressDialog = baProgressModal.open;
    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }
])


angular.module('BlurAdmin.pages.courses.addCourses').controller('ModalInstanceCtrlCourse', ['$scope', '$uibModalInstance', '$http', 'bool', 'id', '$timeout', 'token','courses','Upload',
 function($scope, $uibModalInstance, $http, bool, id, $timeout, token,courses,Upload) {
  $scope.form = {};
  $scope.b = bool;
  $scope.error = ""
  // console.log(JSON.stringify(courses))

  // console.log($scope.b);

  // console.log("id value " + id)

  // console.log("Bool value " + bool)
  if (bool == 0) {
    $http.get("/trootorials-v1/api/get-course/" + id + "?token=" + token).then(function(response) {
      // console.log(response);
      // console.log("Edit response"+JSON.stringify(response.data.response));
      $scope.form = response.data.response;
    });
  }


  $scope.updateCourse = function() {
    // console.log("Update called");
    var count=0
    courses.forEach(function(el){
      if(el.title == $scope.form.title)
      count++
    })
    if(count > 1 )
    $scope.error = "Title already exists"

    else {
      if ($scope.form.file) { //check if from is valid
          // console.log($scope.form.file)
           $scope.upload($scope.form.file,function(url){
            // console.log("URL "+url)

      var m = parseInt(id);
      // console.log($scope.form);
      $http({
          method: 'POST',
          format: 'json',
          url: '/trootorials-v1/api/edit-course/' + m + "?token=" + token,
          data: JSON.stringify({
            title: $scope.form.title,
            description: $scope.form.description,
            duration: $scope.form.duration,
            level: $scope.form.level,
            imageUrl: url
          })
        })
        .then(function(success) {
          $http.get("/trootorials-v1/api/all-courses?token=" + token).then(function(response) {
            $uibModalInstance.close(response.data.data);
          });

        });
    })
  }
    else {
      var m = parseInt(id);
      // console.log($scope.form);
      $http({
          method: 'POST',
          format: 'json',
          url: '/trootorials-v1/api/edit-course/' + m + "?token=" + token,
          data: JSON.stringify({
            title: $scope.form.title,
            description: $scope.form.description,
            duration: $scope.form.duration
          })
        })
        .then(function(success) {
          $http.get("/trootorials-v1/api/all-courses?token=" + token).then(function(response) {
            $uibModalInstance.close(response.data.data);
          });

        }
      );
    }
  }
}

  $scope.createPost = function(title, description, duration,level,file) {
    if (file) { //check if from is valid
        // console.log(file)
         $scope.upload(file,function(url){
          // console.log("URL "+url)
          var data = {
            title: title,
            description: description,
            duration: duration,
            imageUrl: url,
            level: level
          }
          $http({
              method: 'POST',
              format: 'json',
              url: '/trootorials-v1/api/add-course?token=' + token,
              data: JSON.stringify({
                title: title,
                description: description,
                duration: duration,
                imageUrl: url,
                level: level

              })
            })
            .then(function(success) {
              // console.log("Add response"+success)
              // console.log("success data" + JSON.stringify(success));
              if (success.data.error == true) {
                $scope.error = "Title already exists. Please enter new a title"
              } else
              //  console.log("Closing modal")
                $uibModalInstance.close(success.data.data);
            }, function(error) {
              // console.log("not hit " + JSON.stringify(error));
            });
        })
    }
    else {
      $scope.error = "Upload a file"
    }

    // console.log("fileURL "+$scope.fileUrl)
  }

  $scope.upload = function(file,cb) {
    // console.log(file)
    Upload.upload({
        url: '/trootorials-v1/api/course/upload', //webAPI exposed to upload the file
        data:{file:file} //pass file as data, should be user ng-model
    }).then(function (resp) {
            // console.log("API hit upload")
            // console.log("upload resp "+resp)
            if(resp.data[0][1]['path']){
            // return resp.data[0][1]['path']
            $scope.fileUrl = resp.data[0][1]['path']
            // console.log($scope.fileUrl)
            cb($scope.fileUrl);
          }
            else {
              $scope.error = "Error uploading files"
            }
        },function(error){
          // console.log("Not hit")
          // console.log("error" + JSON.stringify(error))
        })
    }
  }

// }
]);
