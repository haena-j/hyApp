/**
 * Created by Yeeun Jung on 2016-09-03.
 */

(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('InterestController',InterestController);
  /** @ngInject */
  function InterestController(HttpSvc, HOST, $location, AuthService) { //관심리스트 

    var vm = this;
    vm.host = HOST;

    //페이지 열자마자 회원에 해당하는 관심리스트 목록 불러오기
    vm.Test = function () {
      HttpSvc.getInterestList(AuthService.index())
        .success(function (values) {
          vm.cosmeticsList = values;
        }).error(function (values, status) {
        alert('실패');
      });
    };
    vm.Test();


    vm.delete = function (query) {
      HttpSvc.deleteInterestCos(query)
        .success(function () {alert("삭제되었습니다.");
        location.reload();
      }).error(function (values) {alert("삭제실패!");});
    }


  }

})();
