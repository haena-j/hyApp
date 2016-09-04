// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//최종변경일 20160727 16:19
//변경자 : 정혜윤
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngAnimate', 'ui.router', 'ngFileUpload', 'jett.ionic.filter.bar'])

  .constant('HOST', 'http://192.168.11.112:8080')
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      /*******************혜윤부분*******************/
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('tab.main', {
        url: '/main',
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main.html',
            controller: 'MainCtrl'
          }
        },
        cache: 'false'
      })
      .state('join', {
        url: '/join',
        templateUrl: 'templates/join.html',
        controller: 'JoinCtrl'
      })

      .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html',
        controller: 'SettingCtrl'
      })

      .state('tab.userSharedPage', {
        url: '/userSharedPage',
        views: {
          'tab-userSharedPage': {
            templateUrl: 'templates/tab-userSharedPage.html',
            controller: 'RelatedMemberListCtrl'
          }
        },
        cache: 'false'
      })

      .state('userSharedPage-detail', {
        url: '/userSharedPage-detail',
        templateUrl: 'templates/userSharedPage-detail.html',
        controller: 'SharedPageDetailCtrl',
        cache: 'false'
      })
      .state('tab.api', { //관리자페이지
        url: '/api',
        views: {
          'tab-api': {
            templateUrl: 'templates/tab-api.html',
            controller: 'ApiCtrl'
          }
        }
      })
      .state('searchApi', { //관리자페이지
        url: '/searchApi',
        templateUrl: 'templates/searchApi.html',
        controller: 'searchApiCtrl'
      })
      /*******************혜윤부분끝*******************/
      /*******************정민부분*******************/
      .state('tab.write', { //추가1
        url: '/write',
        views: {
          'tab-write': {
            templateUrl: 'templates/tab-write.html',
            controller: 'WriteCtrl'
          }
        }
      })

      .state('tab.mycostable', {
        url: '/mycostable',
        views: {
          'tab-mycostable': {
            templateUrl: 'templates/tab-mycostable.html',
            controller: 'MycostableCtrl'
          }
        },
        cache: 'false'
      })

      .state('writeaftersearch', {
        url: '/writeaftersearch',
        templateUrl: 'templates/writeaftersearch.html',
        controller: 'WriteAfterSearchCtrl'
      })

      .state('searchAtWrite', {
        url: '/searchAtWrite',
        templateUrl: 'templates/searchAtWrite.html',
        controller: 'SearchAtWriteCtrl'

      })

      .state('mycostable-detail', {
        url: '/mycostable-detail',
        templateUrl: 'templates/mycostable-detail.html',
        controller: 'MyCosTableDetailCtrl',
        cache: 'false'

      })

      .state('mycostable-edit', {
        url: '/mycostable-edit',
        templateUrl: 'templates/mycostable-edit.html',
        controller: 'MyCosTableEditCtrl'

      })


      /*******************정민부분끝*******************/
      /*******************예은부분*******************/

      .state('tab.search', { //화장품검색
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('tab.interest', { //관심리스트목록
        url: '/interest',
        views: {
          'tab-interest': {
            templateUrl: 'templates/tab-interest.html',
            controller: 'InterestCtrl'
          }
        }
      })
    /*******************예은부분끝*******************/
    ;


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider
      .otherwise('/login');
  })

  //사용자 인증관련코드
  // .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  //   $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
  //     if ('data' in next && 'authorizedRoles' in next.data) {
  //       var authorizedRoles = next.data.authorizedRoles;
  //       if (!AuthService.isAuthorized(authorizedRoles)) {
  //         event.preventDefault();
  //         $state.go($state.current, {}, {reload: true});
  //         $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
  //       }
  //     }
  //   });
  // })
;
