// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngAnimate', 'ui.router', 'ngFileUpload'])


  .constant('HOST', 'http://localhost:8080')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


  .config(function($stateProvider, $urlRouterProvider, USER_ROLES) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

    .state('tab.userSharedPage', {
      url: '/userSharedPage',
      views:{
        'tab-userSharedPage':{
          templateUrl: 'templates/tab-userSharedPage.html',
          controller: 'RelatedMemberListCtrl'
        }
      }
    })
    .state('tab.api', {
      url: '/api',
      views:{
        'tab-api':{
          templateUrl: 'templates/tab-api.html',
          controller: 'ApiCtrl'
        }
      }
      ,
      data: {
        authorizedRoles: [USER_ROLES.admin]
      }
    })

    .state('join', {
      url: '/join',
      templateUrl: 'templates/join.html',
      controller: 'JoinCtrl'
    })

    .state('tab.member', {
      url: '/member',
      views: {
        'tab-member': {
          templateUrl: 'templates/tab-member.html',
          controller: 'MemberCtrl'
        }
      }
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingCtrl'
    })
    .state('searchApi', {
      url: '/searchApi',
      templateUrl:'templates/searchApi.html',
      controller:'searchApiCtrl'
    })
    .state('userSharedPage-detail', {
      url: '/userSharedPage:detail',
      templateUrl: 'templages/userSharedPage-detail.html',
      controller:'SharedPageDetailCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider
    .otherwise('/login');
})
  // .run(function($httpBackend){
  //   $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
  // })

  .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
      if ('data' in next && 'authorizedRoles' in next.data) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          $state.go($state.current, {}, {reload: true});
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        }
      }
      // if (!AuthService.isAuthenticated()) {
      //   if (next.name !== 'login') {
      //     event.preventDefault();
      //     $state.go('login');
      //   }
      // }
    });
  });
