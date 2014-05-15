angular.module('ImageZoomExample', ['ImageZoom'])
  .controller('ExampleCtrl', ['$scope',
    function ($scope) {
      $scope.switchImage = function (imageSrc) {
        console.log('change image to: ' + imageSrc);
        $scope.imageSrc = imageSrc;
      };
    }
  ]);
