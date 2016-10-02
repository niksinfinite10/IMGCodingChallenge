'use strict';

/**
 * @ngdoc overview
 * @name imgcoddingChallangeApp
 * @description
 * # imgcoddingChallangeApp
 *
 * Main module of the application.
 */
angular
  .module('imgcoddingChallangeApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
