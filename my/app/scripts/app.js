'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular
  .module('myApp', [
    'ngAnimate',
    'ui.router'
  ])
  .constant('HOST', 'http://localhost:8080')
  .service('HttpSvc', function($http, HOST) {
    this.getUserList = function () {
      return $http({
        url: HOST + '/api/user',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
    }
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        data: {
          requireLogin: false
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        data: {
          requireLogin: true
        }
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact',
        data: {
          requireLogin: true
        }
      });
    $urlRouterProvider.otherwise('/');
  });

