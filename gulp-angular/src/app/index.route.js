(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $mdIconProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('userSharedPage', {
        url: '/userSharedPage',
        templateUrl: 'app/userSharedPage/userSharedPage.html',
        controller: 'UserSharedPageController',
        controllerAs: 'userSharedPage'
      })

      .state('userSharedDetail', {
        url: '/userSharedDetail',
        templateUrl: 'app/userSharedPage/userSharedDetail.html',
        controller: 'UserSharedDetailController',
        controllerAs: 'userSharedDetail'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })

      .state('join', {
        url: '/join',
        templateUrl: 'app/login/join.html',
        controller: 'JoinController',
        controllerAs: 'signIn'
      })

      .state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'setting'
      })




      //정민부분
      .state('mycostable', {
        url: '/mycostable',
        templateUrl: 'app/mycostable/mycostable.html',
        controller: 'MyCosTableController',
        controllerAs: 'mycostable'
      })

      .state('write', {
        url: '/write',
        templateUrl: 'app/write/write.html',
        controller: 'WriteController',
        controllerAs: 'writeController'
      })

      .state('searchAtWrite', {
        url: '/searchAtWrite',
        templateUrl: 'app/write/searchAtWrite.html',
        controller: 'SearchAtWriteController',
        controllerAs: 'searchAtWrite'
      })

    //예은부분
      .state('interest', {
        url: '/interest',
        templateUrl: 'app/interest/interest.html',
        controller: 'InterestController',
        controllerAs: 'interest'
      })
      .state('search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
      })
    ;

    $urlRouterProvider.otherwise('/login');

    $mdIconProvider
      .defaultIconSet('myDressingRoom.svg', 24);
  }

})();
