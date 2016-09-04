/**
 * Created by JUNGMIN on 2016-09-03.
 */

(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('MyCosTableController', MyCosTableController);

  /** @ngInject */
  function MyCosTableController (HttpSvc, $location, HOST, AuthService) {
    var vm = this;
    vm.host = HOST;
    var member_index = AuthService.index();

    //내 화장대 접근했을 때 바로 실행되는 함수 Test 정의
    vm.Test = function () {
      HttpSvc.findByMemIndex(member_index)
        .success(function (values) {
          vm.mycosmeticsList = values;
        })
        .error(function () {

        })

    };
    vm.Test(); //함수 Test 실행

    //plusIcon을 누르면 리뷰쓰기 페이지로 이동
    vm.submit = function () {
      $location.path('/write')
    };

    //내 화장대 각 리뷰 상세페이지로 이동
    // vm.detailOf
  }

})();
