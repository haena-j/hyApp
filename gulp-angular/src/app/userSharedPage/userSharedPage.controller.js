/**
 * Created by HYEYOON on 2016-08-29.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('UserSharedPageController',UserSharedPageController)
    .controller('UserSharedDetailController', UserSharedDetailController);

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

          vm.tiles = buildGridModel({
            img : "",
            id : "",
            level : "",
            level_name : "",
            background : "",
            recent_review_img : "",
            count : "",
            member_index: ""
          });

          function buildGridModel(tileTmpl){
            var it, results = [ ];
            for (var i=0; i<vm.highRankList.length; i++) {
              it = angular.extend({},tileTmpl);
              it.img = vm.host + vm.highRankList[i].image;
              it.id = vm.highRankList[i].id;
              it.level = vm.highRankList[i].level;
              it.level_name = vm.highRankList[i].level_name;
              it.span  = { row : 1, col : 1 };
              it.recent_review_img = vm.highRankList[i].recent_review_img;
              it.count = vm.highRankList[i].count;
              it.member_index = vm.highRankList[i].member_index;
              if(i == 1){
                it.span.row = it.span.col = 2;
              }
              if(i == 4){
                it.span.col = 2;
              }
              if(i == 5){
                it.span.row = it.span.col = 2;
              }

              results.push(it);
            }
            return results;
          }

        }).error(function () {
      });

    };
    vm.Test();   //함수 Test 실행

    vm.currentIndex = 0;
    vm.setCurrentSlideIndex = function (index) {
      vm.currentIndex = index;
    };
    vm.isCurrentSlideIndex = function (index) {
      return vm.currentIndex === index;
    };
    vm.prevSlide = function () {
      vm.currentIndex = (vm.currentIndex < vm.RelationList.length -1) ? ++vm.currentIndex : 0;
    };
    vm.nextSlide = function () {
      vm.currentIndex = (vm.currentIndex > 0) ? --vm.currentIndex : vm.RelationList.length - 1;
    };
    }

  function UserSharedDetailController( $location, HttpSvc, HOST) {
    var vm = this;
    vm.host = HOST;
    vm.background = "";
    var member_index = $location.search().param;
    HttpSvc.getMyCosmeticsByMemberIndex(member_index)
      .success(function (values) {
        vm.cosmeticsInfoList = values;
      })
      .error(function (values) {
        alert("error" + values);
      });

    HttpSvc.findUserByMIndex(member_index)
      .success(function (values) {
        vm.memberInfo = values;
        if(vm.memberInfo.count >= 10){
          vm.background = "assets/images/cosmetics.jpg";
        }
        else if(vm.memberInfo.count < 10 && vm.memberInfo.count >5){
          vm.background = "assets/images/cosmetics0.jpg";
        }
        else {
          vm.background = "assets/images/image.jpg";
        }
      })
      .error(function () {
      })
  }
    })();
