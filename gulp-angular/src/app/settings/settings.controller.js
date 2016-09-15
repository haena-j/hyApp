/**
 * Created by HYEYOON on 2016-09-04.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('SettingsController', SettingsController);

  function SettingsController(AuthService, $location,HOST, Upload, $timeout) {
    var vm = this;
    vm.pic = HOST.toString() + AuthService.image();
    vm.name = AuthService.name();
    vm.logout = function () {     //로그아웃기능
      AuthService.logout();
      $location.path('/login');
    };
    vm.changePhoto = function (param) {
      var file = Upload.upload({
        url: HOST + "/api/updateMemberImage",
        method: "POST",
        data: {
          id: AuthService.id(),
          files: param
        }
      }).then(function (response) {
        $timeout(function () {
          alert("프로필 사진 변경완료");
        });
        location.reload();
      }, function (response) {
        if (response.status > 0)
          vm.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 *
          evt.loaded / evt.total));
      });
    };
  }
})();
