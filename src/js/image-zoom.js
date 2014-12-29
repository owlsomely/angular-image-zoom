/*
 * angular-image-zoom
 *
 * ImageZoom AngularJS directive for zooming images
 *
 * (c) 2014 Chen Liang <code@chen.technology> All rights reserved.
 * See the LICENSE file distributed with this work.
 */
'use strict';
/*global angular*/
var ImageZoom = angular.module('ImageZoom', [])
  .constant('ImageZoomDefaultConfig', {
    templateUrl: 'image-zoom.html',
    zoomFactor: 1.5,
    backgroundColor: 'transparent'
  })
  .controller('ImageZoomController', ['$scope',
    function ($scope) {
      $scope.imgSrc = '';
      $scope.zoomImgSrc = '';
    }
  ])
  .directive('imageZoom', ['ImageZoomDefaultConfig', '$document',
    function (ImageZoomDefaultConfig, $document) {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: function (tElement, tAttrs) {
          // <image-zoom data-template-url="/something.html"></image-zoom>
          return tAttrs.templateUrl || ImageZoomDefaultConfig.templateUrl;
        },
        scope: {
          imageSrc: '@',
          zoomFactor: '=?',
          maxHeight: '=?',
          maxWidth: '=?',
          positionAbsolute: '=?',
          backgroundColor: '=?',
          templateUrl: '=?templateUrl'
        },
        link: function ($scope, element) {

          var lens = element.find('div');
          var image = element.find('img');
          var el;
          var nWidth;
          var nHeight;
          var lensCSS;
          var isLensHidden = false;
          var isImageLoading = false;

          // Check if zoomFactor was set 
          // otherwise set it to ImageZoomDefaultConfig.zoomFactor
          if(!$scope.zoomFactor){
            $scope.zoomFactor = ImageZoomDefaultConfig.zoomFactor;
          }

          // Check if backgroundColor was set 
          // otherwise set it to ImageZoomDefaultConfig.backgroundColor
          if(!$scope.backgroundColor){
            $scope.backgroundColor = ImageZoomDefaultConfig.backgroundColor;
          }

          //Enable Parent Controller to change the imageSrc
          var watchImageSrc = $scope.$parent.$watch('imageSrc', function (newVale, oldValue) {
            //console.log('[imageGlass][watchImageSrc][new: ' + newVale + '][oldValue:' + oldValue + ']');
            if (newVale) {
              $scope.imageSrc = newVale;
            }
          });

          // if touch devices, do nothing
          if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return;
          }

          var hideLens = function () {
            lens.css({
              opacity: 0,
              filter: 'alpha(opacity=0)',
              display: 'none', // won't interfer other components
            });
            isLensHidden = true;
          };

          var showGlass = function () {
            lens.css({
              display: 'block',
              opacity: 1,
              filter: 'alpha(opacity=100)'
            });
          };

          // Update the background image
          var changeLensBgImg = function (img) {
            lens.css({
              background: $scope.backgroundColor + ' url(' + img + ') no-repeat',
              'background-size': nWidth * $scope.zoomFactor + 'px ' + nHeight * $scope.zoomFactor + 'px'
            });
          };

          var mousemove = function (evt) {
            lensCSS = $scope.magnify(evt);
            if (lensCSS) {
              lens.css(lensCSS);
            }
          };

          var mouseleave = function (evt) {
            console.log('[mouseleave]');
            hideLens();
            $document.off('mousemove', mousemove);
            $document.off('mouseleave', mouseleave);
          };

          element.on('mouseenter', function () {
            if (isLensHidden) {
              showGlass();
            }
            var extInfo = {
              width: element[0].offsetWidth,
              height: element[0].offsetHeight,
              imageWidth: image[0].offsetWidth,
              imageHeight: image[0].offsetHeight,
              lensWidth: lens[0].offsetWidth,
              lensHeight: lens[0].offsetHeight
            };
            el = angular.extend($scope.getOffset(element[0]), extInfo);
            $document.on('mousemove', mousemove);
            $document.on('mouseleave', mouseleave);
          });

          // clean up
          element.on('destroy', watchImageSrc);

          // When image loaded, get image natural width and height
          image.bind('load', function (evt) {
            console.log('imaged loaded');
            nWidth = this.naturalWidth;
            nHeight = this.naturalHeight;
            changeLensBgImg($scope.imageSrc);
            if($scope.maxHeight || $scope.maxWidth){
              ensureAspectRatio(nWidth, nHeight);
            }
          });

          var ensureAspectRatio = function(nWidth, nHeight) {
            var maxWidth = image.width || $scope.maxWidth,
                maxHeight = image.height || $scope.maxHeight;

            var newSize = calculateAspectRatioFit(nWidth, nHeight, maxWidth, maxHeight);
            element.css({
              width: newSize.width + 'px',
              height: newSize.height + 'px'
            });
          };

          /**
            * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
            * images to fit into a certain area.
            *
            * @param {Number} srcWidth Source area width
            * @param {Number} srcHeight Source area height
            * @param {Number} maxWidth Fittable area maximum available width
            * @param {Number} maxHeight Fittable area maximum available height
            * @return {Object} { width, heigth }
            */
          var calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
              console.log({srcW: srcWidth, srcH:srcHeight});
              var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

              return { width: srcWidth*ratio, height: srcHeight*ratio };
           };

          var getLensBgStyle = function (evt) {
            var mx, my, rx, ry, px, py, bgp;

            // IE8 uses evt.x and evt.y
            mx = (evt.pageX) ? (evt.pageX - el.left) : evt.x;
            my = (evt.pageY) ? (evt.pageY - el.top) : evt.y;

            // Consider page scrolling if attr is set
            if($scope.positionAbsolute){
              my -= document.body.scrollTop;
              mx -= document.body.scrollLeft;
            }

            if (mx < el.width && my < el.height && mx > 0 && my > 0) {
              showGlass();
            } else {
              hideLens();
              return;
            }
            rx = Math.round(mx * $scope.zoomFactor - el.lensWidth / 2) * -1;
            ry = Math.round(my * $scope.zoomFactor - el.lensHeight / 2) * -1;
            bgp = rx + 'px ' + ry + 'px';

            px = mx - el.lensWidth / 2;
            py = my - el.lensHeight / 2;

            var bgSize = (el.width * $scope.zoomFactor) + 'px ' + (el.height * $scope.zoomFactor)  + 'px'

            return {
              left: px + 'px',
              top: py + 'px',
              backgroundPosition: bgp,
              backgroundSize: bgSize
            };
          };

          $scope.magnify = function (evt) {
            var img;

            if (!nWidth && !nHeight) {
              if (isImageLoading) {
                return;
              }
              img = new Image();
              img.onload = function () {
                nWidth = img.width;
                nHeight = img.height;
                isImageLoading = false;
              };
              img.src = $scope.imageSrc;
              isImageLoading = true;
            } else {
              return getLensBgStyle(evt);
            }
            return;
          };


          $scope.getOffset = function (el) {
            var offsetLeft = 0;
            var offsetTop = 0;
            if (el) {
              if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
                offsetTop += el.offsetTop;
              }
              while (el.offsetParent) {
                el = el.offsetParent;
                offsetTop += el.offsetTop;
                offsetLeft += el.offsetLeft;
              }
            }
            return {
              left: offsetLeft,
              top: offsetTop
            };
          };

          $scope.getLensStyle = function () {
            return {
              background: 'url(' + $scope.imageSrc + ') no-repeat',
              width: ($scope.lensWidth) ? $scope.lensWidth + 'px' : '',
              height: ($scope.lensHeight) ? $scope.lensHeight + 'px' : ''
            };
          };
        }
      };
    }
  ]);
