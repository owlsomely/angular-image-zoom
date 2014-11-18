angular.module('ImageZoomExample', ['ImageZoom'])
  .controller('ExampleCtrl', ['$scope',
    function ($scope) {
      $scope.imageSrc = 'Pevensey_castle-09.jpg';
      $scope.switchImage = function (imageSrc) {
        console.log('change image to: ' + imageSrc);
        $scope.imageSrc = imageSrc;
      };
    }
  ]);
