/**
 * Created by HYEYOON on 2016-08-30.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('LoginController',LoginController)
    .controller('JoinController', JoinController);
  function LoginController($location, AuthService, $mdDialog) {
    var vm = this;
    vm.data = {};
    if(AuthService.isAuthenticated() == true){
      $location.path('/main');
    }
    vm.login = function(data) {
      AuthService.login(data.id, data.password).then(function() {
        $location.path('/main');
        vm.setCurrentUserId(data.id);
      });
    };
    vm.signIn = function(){
      $location.path('/join');
    };
  }
 function JoinController( HOST, Upload, $timeout, $location) {
    var vm = this;
    vm.submit = function(join) {
      //사진 파일 업로드를위해 Upload 이용. 값들을 data에 담아 전송
      var file = Upload.upload({
        url: HOST + "/api/main",
        method: "POST",
        data: {
          id: join.id,
          password: join.password,
          name: join.name,
          birth: join.birth,
          files: join.picFile
        }
      }).then(function () {
        $timeout(function () {
        alert("로그인해주세요");
        });
      }, function (response) {
        if (response.status > 0)
          vm.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 *
          evt.loaded / evt.total));
      });
      $location.path('/login');    //가입완료시 login.html 로 이동
    };

    vm.goToLogin = function () {
      $location.path('/login');
    }
  }

})();
