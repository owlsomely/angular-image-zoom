Angular Image Zoom
==================
A native angular.js diretive that provide basic image-hover-zoom feature like jQuery's [CloudZoom](https://github.com/smurfy/cloud-zoom)

Created for [http://owl.gift](http://owl.gift)

# Size
* JS: min: 3,015 B
* CSS: 650 B
* Template: 148 B

Demo
----
[http://owlsomely.github.io/angular-image-zoom/](http://owlsomely.github.io/angular-image-zoom/)

![Screenshot](https://github.com/owlsomely/angular-image-zoom/raw/master/doc/img/screenshot.png "https://github.com/owlsomely/angular-image-zoom/raw/master/doc/img/screenshot.png")

Usage
-----
1. include the image-zoom as a dependency for your app.

    ```js
    angular.module('myApp', ['ImageZoom']);
    ```

2. include the supplied CSS file (or create your own).
3. add image-zoom element

  ```html
  <div image-src="./Pevensey_castle-09.jpg" image-zoom></div>
  ```

  **Alternate Template URL**
  ```html
  <div image-src="./Pevensey_castle-09.jpg" image-zoom data-template-url="/assets/my-image-template.html"></div>
  ```

4. *optional* Switch Images (refer to the demo):

  ```html
  <body ng-app="ImageZoomExample" ng-controller="ExampleCtrl">
    <div class="container">
      <h1>Angular Image Zoom Demo</h1>
      <div class="thumbnail" style="width: 400px;">
        <div image-src="./Pevensey_castle-09.jpg" image-zoom>
        </div>
        </div>
        <h2>Switch Images</h2>
        <div class="row thumbnails">
          <div class="col-xs-4">
            <a ng-click="switchImage('Pevensey_castle-09.jpg')" class="thumbnail product-image">
              <img src="320px-Pevensey_castle-09.jpg" alt="wooops" />
            </a>
          </div>
          <div class="col-xs-4">
            <a ng-click="switchImage('Pevensey_Castle_exterior.jpg')" class="thumbnail product-image">
              <img src="320px-Pevensey_Castle_exterior.jpg" alt="woops" />
            </a>
          </div>
        </div>
    </div>
  </body>
  ```

## Contributing

`npm install`

### Run Local Server
`grunt dev`

### Build
`grunt build`

## Authors

**Chen Liang**

+ http://chen.technology
+ http://github.com/uschen


## References:
Inspired by [https://github.com/jotielim/ng-magnify](https://github.com/jotielim/ng-magnify)

## License:
Licensed under the MIT license
