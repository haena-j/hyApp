/**
 * Created by Yeeun Jung on 2016-09-03.
 */

(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('SearchController',SearchController);
  /** @ngInject */
  function SearchController(HttpSvc, HOST, $location, AuthService) { //화장품 검색

    var vm = this;
    vm.host = HOST;
    //검색
      HttpSvc.getSearch($location.search().param)
        .success(function (values) {
          vm.cosmeticsList = values;
        }).error(function () {
      });

    vm.save = function (interest) {  //관심리스트 저장
    var interestVO = {
      member_index: AuthService.index(),
      cos_index: interest.cos_index
    };
    HttpSvc.addInterest(interestVO)
      .success(function (values) {
        if(values == 1)
          alert('저장하였습니다.');
        else
          alert('이미 저장되었습니다.');
      }).error(function (status) {
      alert('저장 실패');
      alert(status);
    });
  };

  }
    })();
