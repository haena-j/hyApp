/**
 * Created by HYEYOON on 2016-08-29.
 */
(function() {
  'use strict';
  angular.module('gulpAngular')
    .controller('NavigationController', NavigationController);
  /** @ngInject */
  function NavigationController($state, AuthService, $location,  AUTH_EVENTS) {
    var vm = this;
    vm.id = AuthService.id();

    // vm.$on(AUTH_EVENTS.notAuthorized, function(event) {
    //  alert(event + "You are not allowed to access this resource.");
    // });
    //
    // vm.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    //   AuthService.logout();
    //   $state.go('login');
    //   alert(event + "Sorry, You have to login again.");
    // });
    vm.setCurrentUserId = function(id) {
      vm.id = id;
    };

    vm.goToSettings = function () {
      $location.path('/settings');
    };

    vm.goToMain = function () {
      $location.path('/main');
    };
  }
})();
