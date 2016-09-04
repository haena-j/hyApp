/**
 * Created by HYEYOON on 2016-08-29.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('UserSharedPageController',UserSharedPageController)
    .controller('UserSharedDetailController', UserSharedDetailController);
  /** @ngInject */
  function UserSharedPageController(HttpSvc, HOST, $location, AuthService) {
    var vm = this;
    vm.host = HOST;
    //추천 버튼 누를 경우 추천수 증가해주는 함수
    vm.giveStar = function (result) {
      var member_id = result.id;
      HttpSvc.updateMemberStar(member_id)
        .success(function () {
          alert("★");
          location.reload();     //화면 refresh 해줌 -> 추천수 증가시킨 것이 바로 반영되도록!
        })
        .error(function () {
        })
    };

    //클릭한 회원의 화장대 상세페이지로 이동
    vm.goToDetail = function(result) {
      $location.path('/userSharedDetail').search({param: result.member_index});
      //파라미터로 클릭한회원의 index값을 같이 보내주면서 페이지 이동

    };

    //페이지 접속했을 경우 바로 실행되는 함수 Test 정의
    vm.Test = function () {
      HttpSvc.getRelatedMemberList(AuthService.index())     //관련순 상위 3개 회원 List 가져옴
        .success(function (values) {
          vm.RelationList = values;
        }).error(function () {
      });

      HttpSvc.getHighRankList(AuthService.index())      //추천수순 상위 3개 회원 List 가져옴
        .success(function (values) {
          vm.highRankList = values;
        }).error(function () {
      });

    };
    vm.Test();   //함수 Test 실행

  }
  function UserSharedDetailController( $location, HttpSvc, HOST) {
    var vm = this;
    vm.host = HOST;
    var member_index = $location.search().param;
    HttpSvc.getMyCosmeticsByMemberIndex(member_index)
      .success(function (values) {
        vm.cosmeticsInfoList = values;
      })
      .error(function (values) {alert("error" + values);});
  }
    })();
