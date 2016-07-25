/**
 * Created by HYEYOON on 2016-06-05.
 */
angular.module('myApp')
  .controller('AboutCtrl', function ($scope, HttpSvc) {
    $scope.getUserList = function() {
      HttpSvc.getUserList()
        .success(function (values, status, headers) {
          $scope.UserList = values;
        })
        .error(function(values, status) {

        });
    };
    $scope.getUserList();
  });
