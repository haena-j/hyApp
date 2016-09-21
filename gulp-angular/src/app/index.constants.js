/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('HOST', 'http://52.79.133.27:8080')
    .constant('AUTH_EVENTS', {
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
      admin: 'admin_role',
      public: 'public_role'
    })
  ;
})();
