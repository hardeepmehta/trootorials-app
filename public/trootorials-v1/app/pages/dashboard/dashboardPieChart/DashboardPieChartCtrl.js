var localstorageApp = angular.module('BlurAdmin.pages.dashboard');

localstorageApp.controller('DashboardPieChartCtrl', ['$scope', '$timeout', '$http', '$window', 'baConfig', 'baUtil', 'localStorageService',
  function($scope, $timeout, $http, $window, baConfig, baUtil, localStorageService) {

    // console.log("retrieve" + localStorageService.get('TOKEN'))
    var token = localStorageService.get('TOKEN')
    if (token == null) {
      $window.location.href = '/trootorials-v1/index.html';
    }

    token = token.substring(1, token.length - 1);


    $http.get("/trootorials-v1/api/all-summary?token=" + token).then(function(response) {
      if (response.data.error === 0) {
        //  console.log("got 0");
        localStorageService.remove('TOKEN')
        $window.location.href = '/trootorials-v1/index.html';
      } else {
        //  console.log(response.data[0].courses);
        //  console.log(response.data[1].videos);
        //  console.log(response.data[2].users);
        $scope.charts = [{
            color: pieColor,
            description: 'All Courses',
            stats: response.data[0].courses,
            //  icon: 'book',
            link: '#/courses/allCourses'
          },
          {
            color: pieColor,
            description: 'All Videos',
            stats: response.data[1].videos,
            //  icon: 'video-camera',
            link: '#/videos/allVideos'

          }, {
            color: pieColor,
            description: 'Total Users',
            stats: response.data[2].users,
            //  icon: 'user',
            link: '#/users'
          }
        ];

      }
    });

    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {

      $('.chart').each(function() {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function() {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function() {
      loadPieCharts();
      updatePieCharts();
    }, 1000);
  }
]);
